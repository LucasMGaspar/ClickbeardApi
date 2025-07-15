import {
  Body, Controller, HttpCode, Post, Get, Query,
  UsePipes, BadRequestException, UseGuards, Request,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

// ──────────────────────────────────────────────
const TZ = 'America/Sao_Paulo';

const createAppointmentBodySchema = z.object({
  barberId: z.uuid('ID do barbeiro deve ser um UUID válido'),
  specialtyId: z.uuid('ID da especialidade deve ser um UUID válido'),
  appointmentDate: z.string().datetime('Data do agendamento deve ser uma data ISO válida'),
});
type CreateAppointmentBody = z.infer<typeof createAppointmentBodySchema>;

@Controller('/appointments')
export class CreateAppointmentController {
  constructor(private prisma: PrismaService) { }


  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createAppointmentBodySchema))
  async handle(
    @Body() body: CreateAppointmentBody,
    @Request() req: any,
  ) {
    const { barberId, specialtyId, appointmentDate } = body;
    const userId = req.user.sub;


    const appointmentUTC = fromZonedTime(appointmentDate, TZ);
    const nowUTC = new Date();
    if (appointmentUTC <= nowUTC)
      throw new BadRequestException('O agendamento deve ser feito para uma data futura');

    const appointmentBR = toZonedTime(appointmentUTC, TZ);
    const hour = appointmentBR.getHours();
    const minutes = appointmentBR.getMinutes();
    if (hour < 8 || hour >= 18)
      throw new BadRequestException('A barbearia funciona das 8h às 18h');
    if (minutes !== 0 && minutes !== 30)
      throw new BadRequestException('Os agendamentos devem ser feitos em intervalos de 30 minutos (00 ou 30)');
    if (appointmentBR.getDay() === 0)
      throw new BadRequestException('A barbearia não funciona aos domingos');

    const barber = await this.prisma.barber.findUnique({
      where: { id: barberId },
      include: { specialties: { include: { specialty: true } } },
    });
    if (!barber) throw new BadRequestException('Barbeiro não encontrado');

    const hasSpecialty = barber.specialties.some(bs => bs.specialty.id === specialtyId);
    if (!hasSpecialty)
      throw new BadRequestException('Este barbeiro não possui a especialidade solicitada');

    const existing = await this.prisma.appointment.findFirst({
      where: { barberId, appointmentDate: appointmentUTC },
    });

    let appointment;
    if (existing) {
      if (existing.status === 'CANCELLED') {
        appointment = await this.prisma.appointment.update({
          where: { id: existing.id },
          data: { userId, specialtyId, status: 'SCHEDULED' },
          include: {
            user: { select: { id: true, name: true, email: true } },
            barber: { select: { id: true, name: true } },
            specialty: { select: { id: true, name: true } },
          },
        });
      } else {
        throw new BadRequestException('Este horário já está ocupado para o barbeiro selecionado');
      }
    } else {
      try {
        appointment = await this.prisma.appointment.create({
          data: {
            userId, barberId, specialtyId,
            appointmentDate: appointmentUTC,
            status: 'SCHEDULED',
          },
          include: {
            user: { select: { id: true, name: true, email: true } },
            barber: { select: { id: true, name: true } },
            specialty: { select: { id: true, name: true } },
          },
        });
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002')
          throw new BadRequestException('Este horário já está ocupado para o barbeiro selecionado');
        throw err;
      }
    }

    return {
      id: appointment.id,
      appointmentDate: appointment.appointmentDate,
      status: appointment.status,
      user: appointment.user,
      barber: appointment.barber,
      specialty: appointment.specialty,
    };
  }

  @Get('/available-times')
  async getAvailableTimes(
    @Query('barberId') barberId: string,
    @Query('date') date: string,
  ) {
    if (!barberId || !date)
      throw new BadRequestException('barberId e date são obrigatórios');

    const startUTC = fromZonedTime(`${date}T00:00:00`, TZ);
    const endUTC = fromZonedTime(`${date}T23:59:59.999`, TZ);

    const nowUTC = new Date();
    const nowBR = toZonedTime(nowUTC, TZ);
    const todayBR = new Date(nowBR.getFullYear(), nowBR.getMonth(), nowBR.getDate());

    const appointmentDayBR = toZonedTime(startUTC, TZ);
    if (appointmentDayBR < todayBR)
      throw new BadRequestException('A data deve ser hoje ou no futuro');

    const barber = await this.prisma.barber.findUnique({ where: { id: barberId } });
    if (!barber) throw new BadRequestException('Barbeiro não encontrado');

    const dayAppointments = await this.prisma.appointment.findMany({
      where: {
        barberId,
        appointmentDate: { gte: startUTC, lte: endUTC },
        status: { not: 'CANCELLED' },
      },
      select: { appointmentDate: true },
    });

    const allTimes: string[] = [];
    for (let h = 8; h < 18; h++) {
      allTimes.push(`${h.toString().padStart(2, '0')}:00`);
      allTimes.push(`${h.toString().padStart(2, '0')}:30`);
    }


    const occupiedTimes = dayAppointments.map(a => {
      const d = toZonedTime(a.appointmentDate, TZ);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    });

    let availableTimes = allTimes.filter(t => !occupiedTimes.includes(t));

    if (appointmentDayBR.getTime() === todayBR.getTime()) {
      const minAllowed = nowBR.getHours() * 60 + nowBR.getMinutes() + 30;
      availableTimes = availableTimes.filter(t => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m > minAllowed;
      });
    }

    return {
      date,
      barberId,
      barberName: barber.name,
      availableTimes,
      totalSlots: allTimes.length,
      availableSlots: availableTimes.length,
      occupiedTimes,
    };
  }
}
