import { ResponseProductDTO } from './product';

export interface ResponseOrderItemDTO {
  product: ResponseProductDTO;
  price: string;
  quantity: number;
}
