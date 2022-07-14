import { Injectable } from '@nestjs/common';
import scdl from 'soundcloud-downloader';
import { createWriteStream } from 'fs';
import { pipeline, finished } from 'stream/promises';

@Injectable()
export class SoundCloudService {
  async search(query: string) {
    return await scdl.search({ query, resourceType: 'tracks', limit: 10, offset: 0 });
  }

  async download(url: string) {
    return await new Promise(async (resolve, reject) => {
      try {
        const info = await this.info(url);
        const input = await scdl.download(url);
        await pipeline(input, createWriteStream('audio.mp3'));
        await finished(input);
        resolve(info);
      } catch (error) {
        if (error) reject(error);
      }
    });
  }

  async info(url: string) {
    return await scdl.getInfo(url);
  }
}
