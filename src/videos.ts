import { Youtube } from './';
import { IVideo } from './interface';

import * as _ from 'lodash';

export class Videos {
  private videos: IVideo[] = [];
  private lastVideo: IVideo = {} as IVideo;
  constructor(private youtube: Youtube = new Youtube()) { }

  public getNextVideo(): IVideo {
    return _.first(this.videos) as IVideo;
  }

  public getAllVideos(): IVideo[] {
    return this.videos;
  }

  public removeVideo(video: IVideo): void {
    this.setLastPlayedVideo(video);
    this.videos = _.reject(this.videos, ['id', video.id]);
  }

  public setLastPlayedVideo(video: IVideo): void {
    this.lastVideo = video;
  }

  public getLastPlayedVideo(): IVideo {
    return this.lastVideo;
  }

  public addVideo(id?: string): Promise<void> {
    if (!_.isUndefined(id)) {
      return this.youtube.getVideo(id).then((video: IVideo) => {
        this.videos.push(video);
        return Promise.resolve();
      }, (err) => Promise.reject(err));
    } else {
      // TODO: Add IMVDB/Youtube service to get content
      return Promise.resolve();
    }
  }
}
