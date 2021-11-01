import { ResponseProductDTO } from './product';

export interface OrderItem {
  product: ResponseProductDTO;
  price: string;
  quantity: number;
}
