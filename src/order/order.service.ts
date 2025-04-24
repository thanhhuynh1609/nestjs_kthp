import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../types/order';
import { CreateOrderDTO, UpdateOrderStatusDTO } from './order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  async listOrdersByUser(userId: string) {
    const orders = await this.orderModel
      .find({ owner: userId })
      .populate('owner')
      .populate('products.product');

    orders.forEach((order) => {
      order.products = order.products.filter((p) => p.product != null);
    });

    return orders; // Trả về mảng, có thể rỗng
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

    order.products = order.products.filter((p) => p.product != null);

    const totalPrice = order.products.reduce((acc, product) => {
      const price = product.product.price * product.quantity;
      return acc + price;
    }, 0);
    await order.updateOne({ totalPrice });

    order = await this.orderModel
      .findById(_id)
      .populate('owner')
      .populate('products.product');
    return order;
  }

  async listOrdersForSeller(sellerId: string) {
    const orders = await this.orderModel
      .find()
      .populate('owner')
      .populate('products.product');

    const sellerOrders = orders
      .map((order) => {
        order.products = order.products.filter((p) => p.product != null);
        return order;
      })
      .filter((order) =>
        order.products.some((item) => item.product.owner.toString() === sellerId),
      );

    return sellerOrders; // Trả về mảng, có thể rỗng
  }

  async listAllOrders() {
    const orders = await this.orderModel
      .find()
      .populate('owner')
      .populate('products.product');

    orders.forEach((order) => {
      order.products = order.products.filter((p) => p.product != null);
    });

    return orders; // Trả về mảng, có thể rỗng
  }

  async deleteByAdmin(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order; 
  }

  async updateOrderStatus(id: string, updateOrderStatusDTO: UpdateOrderStatusDTO) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    if (order.trangThai === 'Đã hủy' || order.trangThai === 'Đã giao') {
      throw new HttpException(
        'Cannot update status of a cancelled or delivered order',
        HttpStatus.BAD_REQUEST,
      );
    }
    order.trangThai = updateOrderStatusDTO.trangThai;
    await order.save();
    return this.orderModel
      .findById(id)
      .populate('owner')
      .populate('products.product');
  }
  async updateOrderStatusBySeller(
    orderId: string,
    sellerId: string,
    updateOrderStatusDTO: UpdateOrderStatusDTO,
  ) {
    const order = await this.orderModel
      .findById(orderId)
      .populate('products.product');
  
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
  
    // Kiểm tra xem seller có sở hữu ít nhất một sản phẩm trong đơn hàng không
    const ownsProduct = order.products.some(
      (item) => item.product && item.product.owner.toString() === sellerId,
    );
  
    if (!ownsProduct) {
      throw new HttpException(
        'Forbidden: You cannot update this order',
        HttpStatus.FORBIDDEN,
      );
    }
  
    if (order.trangThai === 'Đã hủy' || order.trangThai === 'Đã giao') {
      throw new HttpException(
        'Cannot update status of a cancelled or delivered order',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    order.trangThai = updateOrderStatusDTO.trangThai;
    await order.save();
  
    return this.orderModel
      .findById(orderId)
      .populate('owner')
      .populate('products.product');
  }
  
}
