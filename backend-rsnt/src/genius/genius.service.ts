import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { GeniusUrlEnums } from '../auth/interfaces/urls.enum';
import mainConfig from '../config/main.config';
import { load as cheerioLoad } from 'cheerio';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class GeniusService {
  async getLyrics(query: string): Promise<string> {
    let resultUrl = undefined;
    try {
      const url = `${GeniusUrlEnums.GENIUS}/search?${qs.stringify({
        q: query,
      })}`;
      const searchRes = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${mainConfig.geniusSettings.apiToken}`,
        },
      });
      resultUrl = searchRes.data?.response?.hits[0]?.result?.url;
    } catch (e) {
      throw new InternalServerErrorException(`Failed to fetch Genius lyrics from API on: ${e}`);
    }
    if (!resultUrl) {
      throw new BadRequestException(`Lyrics for ${query} are not available!`);
    }
    return this.extractLyrics(resultUrl);
  }

  async extractLyrics(songUrl: string): Promise<string> {
    try {
      const { data } = await axios.get(songUrl);
      const $ = cheerioLoad(data);
      let lyrics = $('div[class="lyrics"]').text().trim();
      if (!lyrics) {
        lyrics = '';
        $('div[class^="Lyrics__Container"]').each((index, element) => {
          if ($(element).text().length !== 0) {
            const snippet = $(element)
              .html()
              .replace(/<br>/g, '\n')
              .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
            lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
          }
        });
      }
      if (!lyrics) {
        throw Error('No lyrics were scraped!');
      }
      return lyrics.trim();
    } catch (e) {
      throw new InternalServerErrorException(`Failed to extract Genius lyrics from ${songUrl} on: ${e}`);
    }
  }
}
