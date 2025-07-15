import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Request } from 'express'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const user = request['user'] as JwtPayload

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado')
    }

   
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso restrito a administradores')
    }

    return true
  }
}