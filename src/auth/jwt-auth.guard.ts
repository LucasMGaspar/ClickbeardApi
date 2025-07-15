import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Env } from 'src/prisma/env'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Env, true>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('Token não fornecido')
    }

    try {
      const publicKey = this.configService.get('JWT_PUBLIC_KEY', { infer: true })
      
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: Buffer.from(publicKey, 'base64'),
        algorithms: ['RS256'],
      })
      
      
      request['user'] = payload
    } catch (error) {
      throw new UnauthorizedException('Token inválido')
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}