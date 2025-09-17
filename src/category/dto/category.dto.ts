import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { generateUuid } from 'src/utils';

export class CategoryDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category_uuid: string = generateUuid();

  @ApiProperty()
  @IsString()
  category_name: string;
}
