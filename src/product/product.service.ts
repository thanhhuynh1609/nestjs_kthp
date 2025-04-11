import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Product } from '../types/product';
import { User } from '../types/user';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().populate('owner');
  }

  async findByOwner(userId: string): Promise<Product[]> {
    const objectId = new Types.ObjectId(userId);
    return await this.productModel.find({ owner: objectId }).populate('owner');
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('owner');
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NO_CONTENT);
    }
    return product;
  }

  async create(productDTO: CreateProductDTO, user: User): Promise<Product> {
    const createdProduct = new this.productModel({
      ...productDTO,
      owner: user._id, // Lưu đúng ObjectId
    });
    await createdProduct.save();
    return createdProduct.populate('owner');
  }

  async update(
    id: string,
    productDTO: UpdateProductDTO,
    userId: string,
  ): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (product.owner.toString() !== userId) {
      throw new HttpException(
        'You do not own this product',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await product.updateOne(productDTO);
    return await this.productModel.findById(id).populate('owner');
  }

  async delete(id: string, userId: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (product.owner.toString() !== userId) {
      throw new HttpException(
        'You do not own this product',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await product.deleteOne();
    return product.populate('owner');
  }
}
