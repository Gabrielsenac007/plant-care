import { api } from './api';
import type { Dashboard, Plant, PlantRequest } from '../types';

export const plantService = {
  list: async (params?: { name?: string; categoryId?: number }) =>
    (await api.get<Plant[]>('/plants', { params })).data,
  dashboard: async () => (await api.get<Dashboard>('/plants/dashboard')).data,
  create: async (data: PlantRequest) => (await api.post<Plant>('/plants', data)).data,
  update: async (id: number, data: PlantRequest) => (await api.put<Plant>(`/plants/${id}`, data)).data,
  remove: async (id: number) => {
    await api.delete(`/plants/${id}`);
  },
};
