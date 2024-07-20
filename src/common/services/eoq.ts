import { api } from '@/config/axios.config';

export const getEOQ = async ({
  month = '',
  year = '',
  page = 1,
  limit = 10,
}) => {
  const response = await api.get('/eoq', {
    params: {
      month,
      year,
      page,
      limit,
    },
  });
  return response.data;
};
