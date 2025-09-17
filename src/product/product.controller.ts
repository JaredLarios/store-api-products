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
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { DeleteProduct, ProductsQueries } from './interfaces/product.interface';
import { Response } from 'express';
import { ProductDTO } from './dto/product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiQuery({ name: 'category_uuid', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'quantity', type: Number, required: false })
  async getAllProducts(
    @Query() queries: ProductsQueries,
    @Res() res: Response,
  ) {
    const response = await this.productService.findProducts(queries);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post()
  async createProduct(@Body() payload: ProductDTO, @Res() res: Response) {
    const response = await this.productService.createProduct(payload);

    if (!response) {
      throw new HttpException(
        "We couldn't crate the item.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return res.status(HttpStatus.CREATED).json({ message: 'product created' });
  }

  @Patch()
  async updateProduct(@Body() payload: UpdateProductDTO, @Res() res: Response) {
    const response = await this.productService.updateProduct(payload);

    if (!response) {
      throw new HttpException(
        'The Item could not be updated',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return res.status(HttpStatus.ACCEPTED).json({ message: 'prduct updated' });
  }

  @Delete()
  @ApiQuery({ name: 'item_uuid', type: String })
  async deleteProduct(@Query() query: DeleteProduct, @Res() res: Response) {
    const response = await this.productService.deleteProduct(query.item_uuid);

    if (!response) {
      throw new HttpException(
        'Item could not be deleted',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return res
      .status(HttpStatus.ACCEPTED)
      .json({ message: 'Item successfully deleted' });
  }
}
