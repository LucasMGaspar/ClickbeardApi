import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('/appointments')
@UseGuards(JwtAuthGuard)
export class ListUserAppointmentsController {
  constructor(private prisma: PrismaService) {}

  @Get('/my')
  async listMyAppointmenrs(@Request() req: any) {
    const userId = req.user.sub

    const appointments = await this.prisma.appointment.findMany({
      where: {
        userId,
        status: {
          not: 'CANCELLED'
        }
      },
      include: {
        barber: {
          select: {
            id: true,
            name: true
          }
        },
        specialty: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    })

    return {
      appointments: appointments.map(appointment => ({
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        status: appointment.status,
        barber: appointment.barber,
        specialty: appointment.specialty
      }))
    }
  }
}