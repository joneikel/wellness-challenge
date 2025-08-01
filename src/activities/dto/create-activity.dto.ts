import { IsString, IsDate, IsNumber, Min, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ example: '65abc1234567890def' })
  @IsString()
  readonly userId: string;

  @ApiProperty({ example: '2025-07-31', type: 'string', format: 'date' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  readonly date: Date;

  @ApiProperty({ example: 5000, required: false })
  @ValidateIf((dto) => dto.steps !== undefined)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  readonly steps?: number;

  @ApiProperty({ example: 6.5, required: false })
  @ValidateIf((dto) => dto.sleep !== undefined)
  @IsNumber()
  @Min(0)
  readonly sleep?: number;

  @ApiProperty({ example: 30, required: false })
  @ValidateIf((dto) => dto.cardioPoints !== undefined)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  readonly cardioPoints?: number;

  // Validación personalizada: no permitir fechas futuras
  validateDate(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activityDate = new Date(this.date);
    activityDate.setHours(0, 0, 0, 0);
    return activityDate <= today;
  }
}
