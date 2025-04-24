// DTO tạo đơn hàng
export interface CreateOrderDTO {
  products: {
    product: string; // ID sản phẩm
    quantity: number; // Số lượng sản phẩm
  }[];
}

// DTO cập nhật trạng thái đơn hàng
export class UpdateOrderStatusDTO {
  readonly trangThai: 'Chờ xử lý' | 'Đang giao hàng' | 'Đã giao' | 'Đã hủy';
}