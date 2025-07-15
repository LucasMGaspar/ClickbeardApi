import {
  Controller,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { AdminGuard } from 'src/auth/admin.guard'

@Controller('/appointments')
export class ListAppointmentsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async handle(
    @Query('date') date?: string,
    @Query('status') status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  ) {
    const whereClause: any = {};

    // Filtrar por data se fornecida
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.appointmentDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // Filtrar por status se fornecido
    if (status) {
      whereClause.status = status;
    }

    const appointments = await this.prisma.appointment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        barber: {
          select: {
            id: true,
            name: true,
          },
        },
        specialty: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });

    // Formatar resposta
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      appointmentDate: appointment.appointmentDate,
      status: appointment.status,
      user: {
        id: appointment.user.id,
        name: appointment.user.name,
        email: appointment.user.email,
      },
      barber: {
        id: appointment.barber.id,
        name: appointment.barber.name,
      },
      specialty: {
        id: appointment.specialty.id,
        name: appointment.specialty.name,
      },
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }));

    return {
      appointments: formattedAppointments,
      total: formattedAppointments.length,
    };
  }
}