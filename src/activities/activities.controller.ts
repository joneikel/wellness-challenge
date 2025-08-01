import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { DailyActivity } from './activity.entity';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('v1/create')
  @ApiOperation({
    summary: 'Registrar actividad diaria (pasos, sueño, cardio)',
  })
  @ApiBody({ type: CreateActivityDto })
  @ApiResponse({
    status: 201,
    description: 'Actividad registrada o actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '65abc1234567890e01' },
        userId: { type: 'string', example: '65abc1234567890def' },
        date: {
          type: 'string',
          format: 'date-time',
          example: '2025-07-31T00:00:00.000Z',
        },
        steps: { type: 'number', example: 5000 },
        sleep: { type: 'number', example: 6.5 },
        cardioPoints: { type: 'number', example: 30 },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-07-31T10:00:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-07-31T15:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos, fecha futura o sin campos de actividad',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Cannot register activity for future dates',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'User not found',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor (fallo en DB o actualización de progreso)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Failed server error',
        },
      },
    },
  })
  async createActivity(@Body() dto: CreateActivityDto): Promise<DailyActivity> {
    try {
      return await this.activitiesService.createActivity(dto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An unexpected error occurred while registering activity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
