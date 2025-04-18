// admin/admin.controller.ts
import {
    Controller,
    Get,
    Put,
    Delete,
    Param,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { AdminGuard } from '../guards/admin.guard';
  import { UserService } from '../shared/user.service';
  import { ProductService } from '../product/product.service';
  import { OrderService } from '../order/order.service';
  
  @Controller('admin')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  export class AdminController {
    constructor(
      private userService: UserService,
      private productService: ProductService,
      private orderService: OrderService,
    ) {}
  
    // Quản lý User
    @Get('users')
    async listUsers() {
      return await this.userService.findAll();
    }
  
    @Delete('users/:id')
    async deleteUser(@Param('id') id: string) {
      return await this.userService.delete(id);
    }
  
    // Quản lý Product
    @Get('products')
    async listAllProducts() {
      return await this.productService.findAll();
    }
  
    @Delete('products/:id')
    async deleteProduct(@Param('id') id: string) {
      return await this.productService.deleteByAdmin(id);
    }
  
    // Quản lý Order
    @Get('orders')
    async listAllOrders() {
      return await this.orderService.listAllOrders();
    }
  
    @Delete('orders/:id')
    async deleteOrder(@Param('id') id: string) {
      return await this.orderService.deleteByAdmin(id);
    }
  }