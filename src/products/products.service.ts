import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new Error(`Product ${id} not found`);
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const createdCat = new this.productModel(createProductDto);
    return createdCat.save();
  }
}
