import axios from 'axios';
import { UrlEnums } from '../enums/urls.enum';
import playData from '../types/playData';

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

export const signOutUser = async () => {
  return axios.get(`${UrlEnums.API_URL}/auth/signout`, {
    withCredentials: true,
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

export const playSong = async (
  token: string,
  deviceId: string,
  data: playData
) => {
  return axios.put(
    `${UrlEnums.API_URL}/spotify/play?deviceId=${deviceId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const pauseSong = async (token: string) => {
  return axios.put(
    `${UrlEnums.API_URL}/spotify/pause`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const resumeSong = async (token: string) => {
  return axios.put(
    `${UrlEnums.API_URL}/spotify/resume`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const fetchSessions = async (token: string | null) => {
  return axios.get(`${UrlEnums.API_URL}/session`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createSession = async (token: string | null, data: any) => {
  return axios.post(`${UrlEnums.API_URL}/session`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
