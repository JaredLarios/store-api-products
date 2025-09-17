import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Res,
  Body,
  Query,
  HttpStatus,
  HttpException,
  Param,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Response } from 'express';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CategoryDTO } from './dto/category.dto';
import { DeleteCategory } from './interfaces/category.interface';

@Controller('/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve the list of categories of items.' })
  async getAllCategories(@Res() res: Response) {
    const response = await this.categoryService.getCategories();
    return res.status(HttpStatus.OK).json(response);
  }

  @Post()
  async createCategory(@Body() payload: CategoryDTO, @Res() res: Response) {
    const response = await this.categoryService.createCategory(payload);

    if (!response) {
      throw new HttpException(
        'The new category could not be added',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'The new category created successfully.' });
  }

  @Put()
  async updateCategory(@Body() payload: CategoryDTO, @Res() res: Response) {
    const response = await this.categoryService.updateCategory(payload);

    if (!response) {
      throw new HttpException(
        'The new category could not be added',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'The new category updated successfully.' });
  }

  @Delete()
  @ApiQuery({ name: 'category_uuid', type: String })
  async deleteCategory(@Query() queries: DeleteCategory, @Res() res: Response) {
    const response = await this.categoryService.deleteCategory(queries);

    if (!response) {
      throw new HttpException(
        'The new category could not be added',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'The new category deleted successfully.' });
  }
}
