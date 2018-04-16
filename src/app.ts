'use strict';
import { whilst } from 'async';
import * as _ from 'lodash';
import * as moment from 'moment';
const Youtube = require('youtube-api');
const ffmpeg = require('fluent-ffmpeg');
const NodeMediaServer = require('node-media-server');
const ytdl = require('ytdl-core');
const videos = ['4jT6479VDPI', 'hC2-_L1TomY', 'dT-AVgjAiKs'];

class App {
  constructor() {
    this.config();
    this.getVideos();
    this.startServer();
  }

  private config() {
    Youtube.authenticate({
      key: process.env.GOOGLE_API as string,
      type: 'key'
    });
  }

  private getVideos() {
    whilst(() => _.size(videos) > 0,
      (callback: any) => {
        Youtube.videos.list({
          id: videos[0],
          part: 'contentDetails'
        }, (err: object, video: any) => {
          if (err) callback(err);
          const id = video.items[0].id;
          const duration = moment.duration(video.items[0].contentDetails.duration).asMilliseconds();
          console.log(id, duration);
          this.streamVideo(id).then(() => {
            videos.shift();
            return callback();
          });
        });
      }, (err: any) => {
        if (err) console.log(err);
        console.log('all done');
      });
  }

  private streamVideo(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg({ source: ytdl(`http://www.youtube.com/watch?v=${id}`) })
        .format('flv')
        .audioCodec('copy')
        .videoCodec('copy')
        .inputOptions([
          '-re'
        ])
        .output('rtmp://localhost/live/STREAM_NAME')
        .on('start', (commandLine: any) => {
          console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('error', (err: any) => {
          return reject(err.message);
        })
        .on('end', () => {
          console.log('end');
          return resolve();
        })
        .run();
    });
  }

  private startServer() {
    const config = {
      http: {
        allow_origin: '*',
        port: 8000
      },
      rtmp: {
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30,
        port: 1935
      }
    };

    const nms = new NodeMediaServer(config);
    nms.run();

    nms.on('preConnect', (id: any, args: any) => {
      console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
      // let session = nms.getSession(id: any);
      // session.reject();
    });

    nms.on('postConnect', (id: any, args: any) => {
      console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
    });

    nms.on('doneConnect', (id: any, args: any) => {
      console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
    });

    nms.on('prePublish', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
      // let session = nms.getSession(id: any);
      // session.reject();
    });

    nms.on('postPublish', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });

    nms.on('donePublish', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });

    nms.on('prePlay', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
      // let session = nms.getSession(id: any);
      // session.reject();
    });

    nms.on('postPlay', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });

    nms.on('donePlay', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });
  }
}

export default new App();
