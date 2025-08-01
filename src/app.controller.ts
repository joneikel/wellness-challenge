import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Mensaje de bienvenida',
    schema: {
      type: 'string',
      example:
        'Bienvenid@s a la API RESTFUL Wellness Challange, puedes ingresar a la documentacion swagger en la siguiente ruta host:port//swagger/api-docs#/ ejemplo: http://localhost:7000/swagger/api-docs#/',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
