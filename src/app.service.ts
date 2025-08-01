import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bienvenid@s a la API RESTFUL Wellness Challange, puedes ingresar a la documentacion swagger en la siguiente ruta host:port//swagger/api-docs#/ ejemplo: http://localhost:7000/swagger/api-docs#/';
  }
}
