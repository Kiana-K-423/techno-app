import { api } from '@/config/axios.config';
import { ProfileType } from '../types';

export const updateProfile = async (
  data: Omit<ProfileType, 'id' | 'createdAt' | 'password'>
) => {
  const response = await api.put('/profile', data);
  return response.data;
};

export const updateProfilePassword = async (
  data: Omit<ProfileType, 'id' | 'createdAt' | 'email' | 'name'> & {
    confirmPassword: string;
    currentPassword: string;
  }
) => {
  const response = await api.put(`/password`, data);
  return response.data;
};
