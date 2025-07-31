import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("v1/create")
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Juan Pérez' },
        email: { type: 'string', example: 'juan@example.com' },
      },
      required: ['name', 'email'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '65abc1234567890def' },
        name: { type: 'string', example: 'Juan Pérez' },
        email: { type: 'string', example: 'juan@example.com' },
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
    description: 'Email ya existe o datos inválidos',
    schema: {
      type: 'object',
      properties: {
            message: { type: 'string', example: 'Email ya existe' },
            statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('v1/findId/:id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del usuario',
    example: '65abc1234567890def',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '65abc1234567890def' },
        name: { type: 'string', example: 'Juan Pérez' },
        email: { type: 'string', example: 'juan@example.com' },
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
    description: 'Email ya existe o datos inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Email ya existe o datos inválidos',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get('v1/findEmail/:email')
  @ApiOperation({ summary: 'Obtener un usuario por su correo electrónico' })
  @ApiParam({
    name: 'email',
    type: 'string',
    description: 'Email del usuario',
    example: 'juan@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '65abc1234567890def' },
        name: { type: 'string', example: 'Juan Pérez' },
        email: { type: 'string', example: 'juan@example.com' },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-05T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
