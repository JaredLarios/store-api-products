import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { generateUuid } from 'utils';

export class ProductDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  item_uuid: string = generateUuid();

  @ApiProperty()
  @IsString()
  item_name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.001)
  item_price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  item_price_off?: number;

  @ApiProperty()
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

  @ApiProperty()
  @IsNumber()
  @Min(0)
  item_quantity: number;
}
