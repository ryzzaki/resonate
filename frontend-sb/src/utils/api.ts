import axios from 'axios';
import { UrlEnums } from '../enums/urls.enum';

export const fetchUser = async (token: string | null) => {
  return axios.get(`${UrlEnums.API_URL}/auth/private/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const refreshUser = async (token: string | null) => {
  return axios.get(`${UrlEnums.API_URL}/auth/user/refresh`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchSongs = async (search: string) => {
  return axios.post(`${UrlEnums.API_URL}/spotify/search?searchQuery=${search}`);
};
