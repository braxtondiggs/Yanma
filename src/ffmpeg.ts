const ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');

export class FFMPEG {

  public streamVideo(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg({ source: ytdl(`http://www.youtube.com/watch?v=${id}`) })
        .format('flv')
        // .noVideo()
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
          return resolve(id);
        })
        .run();
    });
  }
}
