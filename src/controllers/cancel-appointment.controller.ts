import {
  Controller,
  Patch,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'


@Controller('/appointments')
@UseGuards(JwtAuthGuard)
export class CancelAppointmentController {
  constructor(private prisma: PrismaService) {}

  @Patch(':id/cancel')
  async cancelAppointment(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.sub;

    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para cancelar este agendamento');
    }

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('Este agendamento já foi cancelado');
    }


    const now = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);
    const diffHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 2) {
      throw new BadRequestException('Agendamentos só podem ser cancelados com 2 horas de antecedência');
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return {
      message: 'Agendamento cancelado com sucesso',
      appointment: updatedAppointment,
    };
  }
}