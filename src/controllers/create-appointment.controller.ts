import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Query,
  UsePipes,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 

const createAppointmentBodySchema = z.object({
  barberId:       z.uuid('ID do barbeiro deve ser um UUID válido'),
  specialtyId:    z.uuid('ID da especialidade deve ser um UUID válido'),
  appointmentDate:z.string().datetime('Data do agendamento deve ser uma data válida'),
});
type CreateAppointmentBodySchema = z.infer<typeof createAppointmentBodySchema>;

@Controller('/appointments')
export class CreateAppointmentController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createAppointmentBodySchema))
  async handle(@Body() body: CreateAppointmentBodySchema, @Request() req: any) {
    const { barberId, specialtyId, appointmentDate } = body;
    const userId = req.user.sub;

    const appointmentDateTime = new Date(appointmentDate);
    const now                 = new Date();

    if (appointmentDateTime <= now)
      throw new BadRequestException('O agendamento deve ser feito para uma data futura');

    const hour    = appointmentDateTime.getHours();
    const minutes = appointmentDateTime.getMinutes();
    if (hour < 8 || hour >= 18)
      throw new BadRequestException('A barbearia funciona das 8h às 18h');
    if (minutes !== 0 && minutes !== 30)
      throw new BadRequestException('Os agendamentos devem ser feitos em intervalos de 30 minutos (00 ou 30)');
    if (appointmentDateTime.getDay() === 0)
      throw new BadRequestException('A barbearia não funciona aos domingos');

    const barber = await this.prisma.barber.findUnique({
      where: { id: barberId },
      include: { specialties: { include: { specialty: true } } },
    });
    if (!barber) throw new BadRequestException('Barbeiro não encontrado');

    const hasSpecialty = barber.specialties.some(bs => bs.specialty.id === specialtyId);
    if (!hasSpecialty)
      throw new BadRequestException('Este barbeiro não possui a especialidade solicitada');

  
    const anyAppointment = await this.prisma.appointment.findFirst({
      where: { barberId, appointmentDate: appointmentDateTime },
    });

    let appointment;
    if (anyAppointment) {
      if (anyAppointment.status === 'CANCELLED') {
        
        appointment = await this.prisma.appointment.update({
          where: { id: anyAppointment.id },
          data: {
            userId,
            specialtyId,
            status: 'SCHEDULED',
          },
          include: {
            user:      { select: { id: true, name: true, email: true } },
            barber:    { select: { id: true, name: true } },
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
            userId,
            barberId,
            specialtyId,
            appointmentDate: appointmentDateTime,
            status: 'SCHEDULED',
          },
          include: {
            user:      { select: { id: true, name: true, email: true } },
            barber:    { select: { id: true, name: true } },
            specialty: { select: { id: true, name: true } },
          },
        });
      } catch (err) {
       
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          throw new BadRequestException('Este horário já está ocupado para o barbeiro selecionado');
        }
        throw err; 
      }
    }

    return {
      id:             appointment.id,
      appointmentDate:appointment.appointmentDate,
      status:         appointment.status,
      user:           appointment.user,
      barber:         appointment.barber,
      specialty:      appointment.specialty,
    };
  }

  @Get('/available-times')
  async getAvailableTimes(
    @Query('barberId') barberId: string,
    @Query('date')     date:     string,
  ) {
    if (!barberId || !date)
      throw new BadRequestException('barberId e date são obrigatórios');

    const targetDate = new Date(date);
    const now        = new Date();
    const today      = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const appointmentDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    if (appointmentDay < today)
      throw new BadRequestException('A data deve ser hoje ou no futuro');

    const barber = await this.prisma.barber.findUnique({ where: { id: barberId } });
    if (!barber) throw new BadRequestException('Barbeiro não encontrado');

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay   = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        barberId,
        appointmentDate: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELLED' },
      },
      select: { appointmentDate: true },
    });

    const allTimes: string[] = [];
    for (let h = 8; h < 18; h++) {
      allTimes.push(`${h.toString().padStart(2, '0')}:00`);
      allTimes.push(`${h.toString().padStart(2, '0')}:30`);
    }

    const occupiedTimes = existingAppointments.map(a =>
      `${a.appointmentDate.getHours().toString().padStart(2, '0')}:` +
      `${a.appointmentDate.getMinutes().toString().padStart(2, '0')}`,
    );

    let availableTimes = allTimes.filter(t => !occupiedTimes.includes(t));

    if (appointmentDay.getTime() === today.getTime()) {
      const currentMin = now.getHours() * 60 + now.getMinutes() + 30; // 30 min de antecedência
      availableTimes = availableTimes.filter(t => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m > currentMin;
      });
    }

    return {
      date,
      barberId,
      barberName: barber.name,
      availableTimes,
      totalSlots:      allTimes.length,
      availableSlots:  availableTimes.length,
      occupiedTimes,
    };
  }
}
