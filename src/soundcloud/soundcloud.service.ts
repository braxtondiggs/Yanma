import { Injectable } from '@nestjs/common';
import scdl from 'soundcloud-downloader';
import { createWriteStream, writeFileSync } from 'fs';

@Injectable()
export class SoundCloudService {
  async download(url: string) {
    return await new Promise(async (resolve, reject) => {
      const stream = await scdl.download(url);
      const info = await this.info(url);
      stream.pipe(createWriteStream('audio.mp3'));
      stream.on('end', () => resolve(info));
    });
  }

  async info(url: string) {
    return await scdl.getInfo(url);
  }
}
