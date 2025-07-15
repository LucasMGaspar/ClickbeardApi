import {
  Controller,
  Get,
  Query,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/barbers')
export class ListBarbersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async listBarbers(@Query('specialtyId') specialtyId?: string) {
   
    const whereClause = specialtyId 
      ? {
          specialties: {
            some: {
              specialtyId: specialtyId
            }
          }
        }
      : {} 

    const barbers = await this.prisma.barber.findMany({
      where: whereClause,
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return {
      barbers: barbers.map(barber => ({
        id: barber.id,
        name: barber.name,
        age: barber.age,
        hireDate: barber.hireDate,
        specialties: barber.specialties.map(bs => ({
          id: bs.specialty.id,
          name: bs.specialty.name,
        })),
      })),
    }
  }
}