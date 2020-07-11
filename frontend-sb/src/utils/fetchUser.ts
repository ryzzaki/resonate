import axios from 'axios';
import { UrlEnums } from '../enums/urls.enum';

export default async function (token: string | null) {
  return axios.get(`${UrlEnums.API_URL}/auth/private/user/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
