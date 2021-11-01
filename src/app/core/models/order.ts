import { ResponseClientDTO } from './client';
import { ResponseOrderItemDTO } from './order-item';

export interface ResponseOrderDTO {
  id: string;
  client: ResponseClientDTO;
  items: ResponseOrderItemDTO[];
}
