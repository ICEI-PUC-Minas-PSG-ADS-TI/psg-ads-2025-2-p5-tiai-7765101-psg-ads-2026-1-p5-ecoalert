import { api } from '@/api/api';
import { routes } from '@/constants/api-routes';

export async function fetchSensors(params) {
  const response = await api.get(routes.sensors.list, { params });
  return response.data;
}

export async function fetchSensorById(id) {
  const response = await api.get(routes.sensors.getById(id));
  return response.data;
}
