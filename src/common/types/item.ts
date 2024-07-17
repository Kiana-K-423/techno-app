import { CategoryType } from './category';
import { Room } from './room';

export type Itemtype = {
  id: string;
  name: string;
  roomId: string;
  categoryId: string;
  image: string;
  quantity: number;
  unit: string;
  price: number;
  room?: Room;
  category?: CategoryType;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};
