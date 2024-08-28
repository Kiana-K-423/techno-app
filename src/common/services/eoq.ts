import { api } from '@/config/axios.config';

export const getEOQ = async ({
  month = '',
  year = '',
  page = 1,
  limit = 10,
  itemId = '',
  orderingCosts = 0,
  storageCosts = 0,
}) => {
  const response = await api.get('/eoq', {
    params: {
      month,
      year,
      page,
      limit,
      itemId,
      orderingCosts,
      storageCosts,
    },
  });
  return response.data;
};
