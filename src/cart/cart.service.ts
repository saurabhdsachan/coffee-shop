import { Injectable } from '@nestjs/common';
import { CartItem, CartMeta } from './dto/create-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Promise from 'bluebird';
import { Cart } from './schemas/cart.schema';
import { Product } from 'src/products/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  calculateCart(cartItems) {
    let totalMRPAmount = 0;
    let totalTAXAmount = 0;
    const isPaid = false;

    cartItems.forEach((item) => {
      totalMRPAmount += item.quantity * item.product.mrp;
      totalTAXAmount +=
        (item.quantity * item.product.mrp * item.product.taxPercent) / 100;
    });
    console.log('cartItems', cartItems);
    return {
      totalMRPAmount,
      totalTAXAmount,
      taxAmount: totalMRPAmount + totalTAXAmount,
      isPaid,
    };
  }

  async getCart(id: string): Promise<Cart> {
    const cart = await this.cartModel.findById(id).populate('products').exec();
    if (!cart) {
      throw new Error(`Cart ${id} not found`);
    }
    return cart;
  }

  async createCart(cartItem: CartItem): Promise<Cart> {
    const cart = new this.cartModel({
      items: [cartItem],
      meta: CartMeta,
    });

    cart.items = await Promise.map(cart.items, async (item) => {
      const product = await this.productModel.findById(item.id).exec();
      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }
      item.product = product;
      return item;
    });

    cart.meta = this.calculateCart(cart.items);
    cart.save();

    return cart;
  }

  async updateCart(id: string, cartItem: CartItem) {
    let found = false;
    const cart = await this.cartModel.findById(id).exec();

    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].id === cartItem.id) {
        cart.items[i].quantity += cartItem.quantity;
        found = true;
        break;
      }
    }

    if (!found) {
      cart.items.push(cartItem);
    }

    cart.items = await Promise.map(cart.items, async (item) => {
      const product = await this.productModel.findById(item.id).exec();
      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }
      item.product = product;
      return item;
    });

    cart.meta = this.calculateCart(cart.items);
    cart.save();

    return cart;
  }

  async checkout(id: string, isPaid) {
    const cart = await this.cartModel.findById(id).exec();

    cart.meta.isPaid = isPaid.isPaid;
    cart.save();

    return cart;
  }
}
