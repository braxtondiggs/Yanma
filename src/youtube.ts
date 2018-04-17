import * as _ from 'lodash';
import * as moment from 'moment';
import { IVideo } from './interface';
const YoutubeAPI = require('youtube-api');

export class Youtube {
  constructor() {
    YoutubeAPI.authenticate({
      key: process.env.GOOGLE_API as string,
      type: 'key'
    });
  }

  public getVideo(id: string): Promise<IVideo> {
    return new Promise((resolve, reject) => {
      YoutubeAPI.videos.list({
        id,
        part: 'contentDetails, snippet'
      }, (err: object, result: any) => {
        if (err) reject(err);
        const video = _.first(result.items) as any;
        resolve({
          description: video.snippet.description,
          duration: moment.duration(video.contentDetails.duration).asMilliseconds(),
          id: video.id,
          image: video.snippet.thumbnails.maxres.url,
          publishedAt: video.snippet.publishedAt,
          title: video.snippet.title,
          url: this.convertIDtoURL(video.id)
        } as IVideo);
      });
    });
  }

  public convertIDtoURL(id: string): string {
    return `http://www.youtube.com/watch?v=${id}`;
  }
}
