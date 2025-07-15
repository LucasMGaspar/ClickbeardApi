import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './prisma/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5501',
      'http://localhost:5500',
      'http://localhost:5501'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
  console.log(`🚀 Server running on http://localhost:${port}`)
}
bootstrap()
