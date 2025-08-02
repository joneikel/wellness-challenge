# wellness-challenge

Reto de Bienestar es: API RESTFUL que permite gestionar el progreso de los usuarios en distintos retos de salud, tomando como base los datos de actividad física, manteniendo la integridad de los datos del usuario y aplicando una estructura que sea escalable y eficiente.

Esta API RESTful gestiona retos de bienestar basados en actividad física (pasos, sueño, puntos cardio). Permite a los usuarios unirse a retos, registrar actividad diaria y ver su progreso en tiempo real.

## Tecnologías utilizadas

- **Framework**: NestJS + TypeScript
- **Base de datos**: MongoDB con Mongoose
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger
- **Control de versiones**: GitHub

## Cómo correr el proyecto localmente

1. Clonar el repositorio:
   git clone https://github.com/joneikel/wellness-challenge.git
   cd wellness-challenge
2. Instalar dependencias:
   npm install
3. Crea archivo .env con la siguiente estructura:
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/
   DB=Wellness_Challenge
4. Inicia la api:
   npm run start
5. Accede a la documentacion swagger de la API:
   http://localhost:7000/swagger/api-docs#/

## Diseño del sistema

El sistema sigue una arquitectura modular de NestJS, con los siguientes módulos:

- **user**: Gestiona la información de los usuarios.
- **challenge**: Definición de retos (acumulativos o diarios).
- **user-challenges**: Participación de usuarios en retos, con seguimiento de progreso.
- **activity**: Registro diario de actividad, con acumulación atómica y actualización automática de progreso.

Los datos se almacenan en MongoDB con colecciones bien definidas y relaciones lógicas.

## Justificación de decisiones técnicas

#### Estructura de datos

- Se usaron 4 colecciones principales para mantener separación de responsabilidades y escalabilidad.
- _UserChallenges_ actúa como tabla de relación con estado (progreso, completado, fechas).
- Índices únicos garantizan que no haya duplicados.

#### Validación

- Uso de DTOs con class-validator para validación en tiempo de ejecución.
- Pipes globales para transformar y limpiar datos (ej: trim, conversión a número).

#### Concurrencia

- Operaciones atómicas en MongoDB ($inc, findOneAndUpdate) para evitar condiciones de carrera.
- Acumulación segura de pasos, puntos cardio

#### Escalabilidad

- Arquitectura modular permite agregar nuevos tipos de retos o métricas.
- Servicios reutilizables y controladores bien definidos.
- Se utiliza una ruta de versionado en cada endpoint para garantizar compatibilidad con futuras versiones si requieren cambios.

## Endpoints implementados

Se utiliza como ruta base el nombre del modulo seguido de un versionado, a continuación se muestran los endpoints implementados:

### users

- **POST /users/v1/create**: Crea un nuevo usuario.
- **GET /users/v1/findId/{id}**: Obtiene usuario por id.
- **GET /users/v1/findEmail/{email}**: Obtiene un usuario por email.

### challenges

- **POST /challenges/v1/create**: Crea un nuevo reto.
- **GET /challenges/v1/findAll**: Obtiene todos los retos
- **GET /challenges/v1/active**: Obtiene los retos activos
- **GET /challenges/v1/findId/{id}**: Obtiene un reto por id

### user-challenges

- **POST /user-challenges/v1/{userId}/{challengeId}**: Unirse a un reto de bienestar.
- **GET /user-challenges/v1/findAll/{userId}**: Obtiene todos los retos de un usuario
- **GET /user-challenges/leaderboard/{challengeId}**: Obtiene el leaderboard de un reto y los ordena de forma descendente según el porcentaje.

### activities

- **POST /activities/v1/create**: Crea una nueva actividad diaria.

## Conclusión

**Esta API permite gestionar retos de bienestar de forma automática, consistente y escalable.**
**Desde el registro hasta la celebración del logro, todo fluye con lógica clara, manejo de concurrencia y actualización en tiempo real**
**Perfecto para integrar con apps de salud, wearables o plataformas de bienestar corporativo.**
