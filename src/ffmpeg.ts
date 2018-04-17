const ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');

export class FFMPEG {

  public streamVideo(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg({ source: ytdl(`http://www.youtube.com/watch?v=${id}`) })
        .format('flv')
        // .noVideo() // TODO: Custom Video
        .audioCodec('libmp3lame')
        .videoCodec('copy')
        .inputOptions([
          '-deinterlace',
          '-re'
        ])
        .outputOptions([
          '-r 30',
          '-g 60',
          '-pix_fmt yuv420p',
          '-bufsize 512k'
        ])
        // .output('rtmp://localhost/live/STREAM_NAME') // DEV Only
        .output(`rtmp://a.rtmp.youtube.com/live2/${process.env.YOUTUBE_LIVE_KEY}`)
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
