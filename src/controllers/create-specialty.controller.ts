import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ConflictException,
  UseGuards,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { AdminGuard } from 'src/auth/admin.guard'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

const createSpecialtyBodySchema = z.object({
  name: z.string().min(1, 'Nome da especialidade é obrigatório'),
})

type CreateSpecialtyBodySchema = z.infer<typeof createSpecialtyBodySchema>

@Controller('/specialties')
export class CreateSpecialtyController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, AdminGuard) 
  @UsePipes(new ZodValidationPipe(createSpecialtyBodySchema))
  async createSpecialty(@Body() body: CreateSpecialtyBodySchema) {
    const { name } = body

    const existingSpecialty = await this.prisma.specialty.findFirst({
      where: {
        name: name,
      },
    })

    if (existingSpecialty) {
      throw new ConflictException('Especialidade já existe')
    }

    const specialty = await this.prisma.specialty.create({
      data: {
        name,
      },
    })

    return {
      id: specialty.id,
      name: specialty.name,
    }
  }
}