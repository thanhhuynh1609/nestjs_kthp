// order.interface.ts
import { Document, Types } from 'mongoose';
import { User } from './user';
import { Product } from './product';

interface ProductOrder {
  product: Product;
  quantity: number;
}

export interface Order extends Document {
  trangThai: 'Chờ xử lý' | 'Đang giao hàng' | 'Đã giao' | 'Đã hủy'; // Giới hạn các giá trị của trangThai
  owner: Types.ObjectId | User;
  totalPrice: number; // Sử dụng kiểu số thường thay vì kiểu `Number`
  products: ProductOrder[];
  created: Date;
}
