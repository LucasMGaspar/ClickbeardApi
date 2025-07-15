import {
  Controller,
  Get,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/specialties')
export class ListSpecialtiesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async listSpecialties() {
    const specialties = await this.prisma.specialty.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return {
      specialties: specialties.map(specialty => ({
        id: specialty.id,
        name: specialty.name,
      })),
    }
  }
}