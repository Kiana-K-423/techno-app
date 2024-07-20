import { api } from '@/config/axios.config';

export const getEOQ = async ({ month = '', year = '' }) => {
  const response = await api.get('/eoq', {
    params: {
      month,
      year,
    },
  });
  return response.data;
};
