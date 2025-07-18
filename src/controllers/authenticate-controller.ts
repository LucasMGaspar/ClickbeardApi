import {
    Body,
    Controller, Post,
    UnauthorizedException,
    UsePipes
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'

import z from 'zod'

const authenticateBodySchema = z.object({
     password: z.string(),
     email: z.email(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async authenticateAccount(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (!user) {
        throw new UnauthorizedException('As credenciais do usuário não batem')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
        throw new UnauthorizedException('As credenciais do usuário não batem')
    }

   
    const accessToken = this.jwt.sign({ 
        sub: user.id,
        email: user.email,
        role: user.role 
    })

    return {
        access_token: accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role 
        }
    }
  }
}