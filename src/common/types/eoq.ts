import { Itemtype } from './item';

export type EOQType = Itemtype & {
  _count: {
    transactions: number;
  };
  _avg: {
    orderingCosts: number;
    storageCosts: number;
    quantity: number;
  };
  eoq: number;
};
