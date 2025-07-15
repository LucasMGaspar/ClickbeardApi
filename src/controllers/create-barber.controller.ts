import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  BadRequestException,
  UseGuards,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { AdminGuard } from 'src/auth/admin.guard'

const createBarberBodySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  age: z.number().min(18, 'Idade mínima é 18 anos').max(100, 'Idade máxima é 100 anos'),
  hireDate: z.string().datetime('Data de contratação deve ser uma data válida'),
  specialtyIds: z.array(z.string()).min(1, 'Pelo menos uma especialidade deve ser selecionada'),
})

type CreateBarberBodySchema = z.infer<typeof createBarberBodySchema>

@Controller('/barbers')
export class CreateBarberController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, AdminGuard) 
  @UsePipes(new ZodValidationPipe(createBarberBodySchema))
  async createBarber(@Body() body: CreateBarberBodySchema) {
    const { name, age, hireDate, specialtyIds } = body

    const existingSpecialties = await this.prisma.specialty.findMany({
      where: {
        id: {
          in: specialtyIds,
        },
      },
    })

    if (existingSpecialties.length !== specialtyIds.length) {
      throw new BadRequestException('Uma ou mais especialidades não foram encontradas')
    }

    const barber = await this.prisma.barber.create({
      data: {
        name,
        age,
        hireDate: new Date(hireDate),
      },
    })

    await this.prisma.barberSpecialty.createMany({
      data: specialtyIds.map(specialtyId => ({
        barberId: barber.id,
        specialtyId,
      })),
    })

    const createdBarber = await this.prisma.barber.findUnique({
      where: { id: barber.id },
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    })

    return {
      id: createdBarber!.id,
      name: createdBarber!.name,
      age: createdBarber!.age,
      hireDate: createdBarber!.hireDate,
      specialties: createdBarber!.specialties.map(bs => ({
        id: bs.specialty.id,
        name: bs.specialty.name,
      })),
    }
  }
}