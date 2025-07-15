import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from './prisma/env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate-controller'
import { CreateBarberController } from './controllers/create-barber.controller'
import { CreateSpecialtyController } from './controllers/create-specialty.controller'
import { ListSpecialtiesController } from './controllers/list-specialties.controller'
import { CreateAppointmentController } from './controllers/create-appointment.controller'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { ListUserAppointmentsController } from './controllers/list-user-appointment.controller'
import { ListBarbersController } from './controllers/list-barbers.controller'
import { ListAppointmentsController } from './controllers/list-appointment'
import { CancelAppointmentController } from './controllers/cancel-appointment.controller'

@Module({
  imports: [ConfigModule.forRoot({
    validate: env => envSchema.parse(env),
    isGlobal: true,
  }),
AuthModule,
],
  controllers: [CreateAccountController, 
    AuthenticateController, 
    CreateBarberController,
    CreateSpecialtyController,
    ListSpecialtiesController,
    CreateAppointmentController,
    ListUserAppointmentsController,
    ListBarbersController,
    ListAppointmentsController,
    CancelAppointmentController
    ],

  providers: [PrismaService,
              JwtAuthGuard
  ],
})
export class AppModule {}
