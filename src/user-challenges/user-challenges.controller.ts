import {
  Controller,
  Post,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserChallengesService } from './user-challenges.service';
import { UserChallenge } from './user-challenge.entity';

@ApiTags('user-challenges')
@Controller('userChallanges/v1/:userId/:challengeId')
export class UserChallengesController {
  constructor(private readonly userChallengesService: UserChallengesService) {}

  @Post()
  @ApiOperation({ summary: 'Unirse a un reto de bienestar' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'ID del usuario',
    example: '65abc1234567890def',
  })
  @ApiParam({
    name: 'challengeId',
    type: 'string',
    description: 'ID del reto',
    example: '65abc1234567890dff',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario inscrito exitosamente en el reto',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '65abc1234567890e00' },
        userId: { type: 'string', example: '65abc1234567890def' },
        challengeId: { type: 'string', example: '65abc1234567890dff' },
        joinedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-07-31T10:00:00.000Z',
        },
        completed: { type: 'boolean', example: false },
        progress: { type: 'number', example: 0 },
        activitiesCount: { type: 'number', example: 0 },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-07-31T10:00:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-07-31T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'El reto no está activo o ya está inscrito',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'User is already enrolled in this challenge',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o reto no encontrado',
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
    description: 'Error interno del servidor (fallo en DB o conexión)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Failed to enroll user due to a server error',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async joinChallenge(
    @Param('userId') userId: string,
    @Param('challengeId') challengeId: string,
  ): Promise<UserChallenge> {
    try {
      const result = await this.userChallengesService.joinChallenge(
        userId,
        challengeId,
      );
      return result;
    } catch (error) {
      console.error('user-challenges.controller ', error);
      // Re-lanzar errores conocidos o convertir errores inesperados
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
