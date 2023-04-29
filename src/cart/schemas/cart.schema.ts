import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CartItem, CartMeta } from '../dto/create-cart.dto';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop({
    id: { type: String },
    quantity: { type: Number },
  })
  items: CartItem[];

  @Prop({
    totalMRPAmount: { type: Number },
    totalTAXAmount: { type: Number },
    taxAmount: { type: Number },
    isPaid: { type: Boolean },
  })
  meta: CartMeta;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
