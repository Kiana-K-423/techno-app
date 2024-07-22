import { CustomerType } from './customer';
import { Itemtype } from './item';
import { TransactionType as TranType } from '@prisma/client';

export type TransactionType = {
  id: string;
  uuid: string;
  itemId: string;
  item?: Itemtype;
  customerId: string;
  customer?: CustomerType;
  quantity: number;
  total: number;
  type: string;
  transaction: TranType;
  orderingCosts: number;
  storageCosts: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};
