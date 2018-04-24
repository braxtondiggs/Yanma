'use strict';
import { whilst } from 'async';
import * as _ from 'lodash';
import { FFMPEG, Server, Videos } from './';
import { IVideo } from './interface';

class App {
  constructor(
    private ffmpeg: FFMPEG = new FFMPEG(),
    // private server: Server = new Server(),
    private videos: Videos = new Videos()) {
    Promise.all([
      this.videos.addVideo()
    ]).then(() => {
      this.startVideoService();
    });
  }

  private startVideoService() {
    whilst(() => _.size(this.videos.getAllVideos()) > 0,
      (callback: any) => {
        const video: IVideo = this.videos.getNextVideo();
        if (!_.isEmpty(video)) {
          this.ffmpeg.streamVideo(video.id).then((id: string) => {
            this.videos.removeVideo(video);
            return callback();
          }).catch(() => {
            // TODO: Handle reject
          });
        } else {
          this.videos.addVideo().then(() => callback()).catch(() => {
            // TODO: handle reject
          });
        }
      }, (err: any) => {
        if (err) console.log(err);
        this.videos.addVideo().then(() => this.startVideoService());
      });
  }
}

export default new App();
