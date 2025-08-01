import {
  IsString,
  IsEnum,
  IsDate,
  IsNumber,
  Min,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeDto {
  @ApiProperty({ example: '70,000 pasos en 7 días' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'steps', enum: ['steps', 'sleep', 'cardio_points'] })
  @IsEnum(['steps', 'sleep', 'cardio_points'])
  readonly type: 'steps' | 'sleep' | 'cardio_points';

  @ApiProperty({
    example: '2025-04-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  readonly startDate: Date;

  @ApiProperty({
    example: '2025-04-07T23:59:59.999Z',
    type: 'string',
    format: 'date-time',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  readonly endDate: Date;

  @ApiProperty({ example: 'cumulative', enum: ['cumulative', 'daily'] })
  @IsEnum(['cumulative', 'daily'])
  readonly goalType: 'cumulative' | 'daily';

  @ApiProperty({ example: 70000 })
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  readonly targetValue: number;

  @ApiProperty({ example: 3, required: false })
  @ValidateIf((dto) => dto.goalType === 'daily')
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  readonly requiredDays?: number;

  // Validación personalizada: endDate > startDate
  validateDates(): boolean {
    if (!this.startDate || !this.endDate) return false;
    return this.endDate > this.startDate;
  }

  // Validación personalizada: requiredDays solo si es meta diaria
  validateRequiredDays(): boolean {
    if (this.goalType === 'daily') {
      return this.requiredDays >= 1 && this.requiredDays <= this.daysBetween();
    }
    return true;
  }

  private daysBetween(): number {
    const diff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
