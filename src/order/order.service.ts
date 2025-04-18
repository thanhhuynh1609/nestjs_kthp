import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from '../types/order';
import { CreateOrderDTO } from './order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  async listOrdersByUser(userId: string) {
    const orders = await this.orderModel
      .find({ owner: userId })
      .populate('owner')
      .populate('products.product');

    if (!orders) {
      throw new HttpException('No Orders Found', HttpStatus.NO_CONTENT);
    }
    return orders;
  }

  async createOrder(orderDTO: CreateOrderDTO, userId: string) {
    const createOrder = {
      owner: userId,
      products: orderDTO.products,
    };
    const { _id } = await this.orderModel.create(createOrder);
    let order = await this.orderModel
      .findById(_id)
      .populate('products.product');

    const totalPrice = order.products.reduce((acc, product) => {
      const price = product.product.price * product.quantity;
      return acc + price;
    }, 0);
    await order.update({ totalPrice });

    order = await this.orderModel
      .findById(_id)
      .populate('owner')
      .populate('products.product');
    return order;
  }

  async listOrdersForSeller(sellerId: string) {
    // Tìm tất cả đơn hàng có sản phẩm thuộc về người bán
    const orders = await this.orderModel
      .find()
      .populate('owner')
      .populate('products.product');

    // Lọc các đơn hàng có sản phẩm thuộc về người bán
    const sellerOrders = orders.filter((order) =>
      order.products.some((item) => item.product.owner.toString() === sellerId),
    );

    if (!sellerOrders || sellerOrders.length === 0) {
      throw new HttpException('No Orders Found for Seller', HttpStatus.NO_CONTENT);
    }

    return sellerOrders;
  }

  async listAllOrders() {
    return await this.orderModel.find()
      .populate('owner')
      .populate('products.product');
  }

  async deleteByAdmin(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }
}
