import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { generateError } from 'zod-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = generateError(error.issues, {

        })
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: formatted.message, 
        })
      }
      throw new BadRequestException('Validation failed')
    }
    return value
  }
}
