export class CartItem {
  id: string;
  quantity: number;
}

export class CartMeta {
  totalMRPAmount: number;
  totalTAXAmount: number;
  taxAmount: number;
  isPaid: boolean;
}

export class CartDto {
  items: Array<CartItem>;
  totalMrp: number;
  taxAmount: number;
  totalAmount: number;
  isPaid: number;
}
