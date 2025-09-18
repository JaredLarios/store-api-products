import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDTO {
  @ApiProperty()
  @IsString()
  item_uuid: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  item_name?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0.001)
  @IsOptional()
  item_price?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  item_price_off?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  item_image_url?: string;

  @ApiProperty({ required: false })
  @Transform(({ value }: { value: string | null }): Date | null =>
    value ? new Date(value) : null,
  )
  @IsDate()
  @IsOptional()
  item_price_off_until_date?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  item_quantity?: number;
}
