import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Challenge } from './challenge.entity';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post('v1/create')
  @ApiOperation({ summary: 'Crear un nuevo reto de bienestar' })
  @ApiBody({ type: CreateChallengeDto })
  @ApiResponse({
    status: 201,
    description: 'Reto creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '65abc1234567890def' },
        name: { type: 'string', example: '70,000 pasos en 7 días' },
        type: { type: 'string', example: 'steps' },
        startDate: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-01T00:00:00.000Z',
        },
        endDate: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-07T23:59:59.999Z',
        },
        goalType: { type: 'string', example: 'cumulative' },
        targetValue: { type: 'number', example: 70000 },
        requiredDays: { type: 'number', example: 3 },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-05T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o fechas incorrectas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'La fecha de fin debe ser posterior a la de inicio',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async createChallenge(@Body() dto: CreateChallengeDto): Promise<Challenge> {
    if (!dto.validateDates()) {
      throw new HttpException(
        'La fecha de fin debe ser posterior a la de inicio',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!dto.validateRequiredDays()) {
      throw new HttpException(
        'requiredDays debe estar entre 1 y el número total de días del reto',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.challengesService.createChallenge(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('v1/findAll')
  @ApiOperation({ summary: 'Obtener todos los retos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de retos',
    type: [CreateChallengeDto],
  })
  async getAllChallenges(): Promise<Challenge[]> {
    return this.challengesService.getAllChallenges();
  }

  @Get('v1/active')
  @ApiOperation({
    summary: 'Obtener retos activos (fecha actual dentro del rango)',
  })
  @ApiResponse({
    status: 200,
    description: 'Retos activos',
    type: [CreateChallengeDto],
  })
  async getActiveChallenges(): Promise<Challenge[]> {
    return this.challengesService.getActiveChallenges();
  }

  @Get('v1/findId/:id')
  @ApiOperation({ summary: 'Obtener un reto por ID' })
  @ApiParam({ name: 'id', type: 'string', example: '65abc1234567890def' })
  @ApiResponse({
    status: 200,
    description: 'Reto encontrado',
    type: CreateChallengeDto,
  })
  @ApiResponse({ status: 404, description: 'Reto no encontrado' })
  async getChallengeById(@Param('id') id: string): Promise<Challenge> {
    const challenge = await this.challengesService.getChallengeById(id);
    if (!challenge) {
      throw new HttpException('Challenge not found', HttpStatus.NOT_FOUND);
    }
    return challenge;
  }
}
