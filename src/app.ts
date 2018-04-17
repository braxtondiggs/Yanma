'use strict';
import { whilst } from 'async';
import * as _ from 'lodash';
import { FFMPEG, Server, Videos, Youtube } from './';
import { IVideo } from './interface';

class App {
  constructor(
    private ffmpeg: FFMPEG = new FFMPEG(),
    // private server: Server = new Server(),
    private videos: Videos = new Videos(),
    private youtube: Youtube = new Youtube()) {
    Promise.all([
      this.videos.addVideo('4jT6479VDPI'),
      this.videos.addVideo('hC2-_L1TomY'),
      this.videos.addVideo('dT-AVgjAiKs')
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
        console.log('all done');
      });
  }
}

export default new App();
