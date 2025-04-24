import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../utilities/user.decorator';
import { User as UserDocument } from '../types/user';
import { OrderService } from './order.service';
import { CreateOrderDTO, UpdateOrderStatusDTO } from './order.dto';
import { SellerGuard } from '../guards/seller.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  listOrders(@User() { id }: UserDocument) {
    return this.orderService.listOrdersByUser(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createOrder(@Body() order: CreateOrderDTO, @User() { id }: UserDocument) {
    return this.orderService.createOrder(order, id);
  }

  @Get('seller-orders')
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  async listOrdersForSeller(@User() { id }: UserDocument) {
    return await this.orderService.listOrdersForSeller(id);
  }

  @Get('admin/orders')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async listAllOrders() {
    return await this.orderService.listAllOrders();
  }

  @Patch('admin/orders/:id/status')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDTO: UpdateOrderStatusDTO,
  ) {
    return await this.orderService.updateOrderStatus(id, updateOrderStatusDTO);
  }

  @Delete('admin/orders/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async deleteByAdmin(@Param('id') id: string) {
    return await this.orderService.deleteByAdmin(id);
  }

  @Patch('seller-orders/:id/status')
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  async updateOrderStatusBySeller(
    @Param('id') orderId: string,
    @User() { id }: UserDocument,
    @Body() updateOrderStatusDTO: UpdateOrderStatusDTO,
  ) {
    return await this.orderService.updateOrderStatusBySeller(orderId, id, updateOrderStatusDTO);
  }
}
