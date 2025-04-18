// admin/admin.module.ts
import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    SharedModule, 
    ProductModule, 
    OrderModule
  ],
  controllers: [AdminController],
})
export class AdminModule {}