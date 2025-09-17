import {
  Controller,
  Get,
  Post,
  Patch,
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
import { ApiOperation } from '@nestjs/swagger';

@Controller('/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve the list of categories of items.' })
  async getAllCategories(@Res() res: Response) {
    const response = await this.categoryService.getCategories();
    return res.status(HttpStatus.OK).json(response);
  }
}
