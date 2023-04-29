import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItem } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':id')
  getCart(@Param('id') id: string) {
    return this.cartService.getCart(id);
  }

  @Put(':id')
  updateCart(@Param('id') id: string, @Body() cartItem: CartItem) {
    return this.cartService.updateCart(id, cartItem);
  }

  @Post()
  createCart(@Body() cartItem: CartItem) {
    return this.cartService.createCart(cartItem);
  }

  @Put('checkout/:id')
  checkout(@Param('id') id: string, @Body() isPaid) {
    console.log('isPaid', isPaid);
    return this.cartService.checkout(id, isPaid);
  }
}
