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

export const searchSongs = async (token: string, search: string) => {
  return axios.get(
    `${UrlEnums.API_URL}/spotify/search?searchString=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
