export class CreateProductDto {
  name: string;
  id: number;
  inventory: number;
  mrp: number;
  complementary: boolean;
  taxPercent: number;
}
