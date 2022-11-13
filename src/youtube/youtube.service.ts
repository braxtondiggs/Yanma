import { Injectable } from '@nestjs/common';
import { launch } from 'puppeteer';
import { spawn } from 'child_process';

@Injectable()
export class YoutubeService {
  async run() {
    const width = 3840;
    const height = 2160;
    const browser = await launch({
      headless: false,
      defaultViewport: {
        width,
        height
      },
      args: [
        '--enable-usermedia-screen-capturing',
        '--allow-http-screen-capture',
        '--no-sandbox',
        '--auto-select-desktop-capture-source=Screen Recorder',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--use-gl=egl',
        '--autoplay-policy=no-user-gesture-required',
        `--window-size=${width},${height}`
      ]
    });
    const page = await browser.newPage();

    await page.goto('http://127.0.0.1:8080', { waitUntil: 'networkidle2' });
    const context = browser.defaultBrowserContext();
    context.clearPermissionOverrides();

    const ffmpeg = spawn('ffmpeg', [
      '-i',
      '-',
      // select first stream intended for output
      '-map',
      '0',
      // video codec config: low latency, adaptive bitrate
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-tune',
      'zerolatency',
      '-g:v',
      '60',

      // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
      '-c:a',
      'aac',
      '-strict',
      '-2',
      '-ar',
      '44100',
      '-b:a',
      '64k',

      //force to overwrite
      '-y',

      // used for audio sync
      '-use_wallclock_as_timestamps',
      '1',
      '-async',
      '1',

      '-flags',
      '+global_header',
      '-f',
      'tee',
      `[f=flv:onfail=ignore]rtmp://a.rtmp.youtube.com/live2/${process.env.YOUTUBE_STREAM_KEY}`
    ]);

    ffmpeg.on('close', (code, signal) => {
      console.log('FFmpeg child process closed, code ' + code + ', signal ' + signal);
    });

    ffmpeg.stdin.on('error', (e) => {
      console.log('FFmpeg STDIN Error', e);
    });

    ffmpeg.stderr.on('data', (data) => {
      console.log('FFmpeg STDERR:', data.toString());
    });

    function str2ab(str) {
      const buf = new ArrayBuffer(str.length);
      const bufView = new Uint8Array(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    }

    await page.exposeFunction('storeChunk', function (chunk) {
      const data = Buffer.from(str2ab(chunk));
      ffmpeg.stdin.write(data);
    });

    page.evaluate(async () => {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      function arrayBufferToString(buffer) {
        // Convert an ArrayBuffer to an UTF-8 String

        const bufView = new Uint8Array(buffer);
        const length = bufView.length;
        let result = '';
        let addition = Math.pow(2, 8) - 1;

        for (let i = 0; i < length; i += addition) {
          if (i + addition > length) {
            addition = length - i;
          }
          result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
        }
        return result;
      }

      if (stream) {
        const mediaStream = new MediaStream();
        const video = stream.getVideoTracks()[0];
        const audio = stream.getAudioTracks()[0];
        mediaStream.addTrack(video);
        mediaStream.addTrack(audio);

        const recorder = new MediaRecorder(mediaStream, {
          mimeType: 'video/webm;codecs=vp9'
        });
        recorder.ondataavailable = async ({ data }) => {
          if (data.size === 0) return;
          console.log('emit');
          const buffer = await data.arrayBuffer();
          window.storeChunk(arrayBufferToString(buffer));
        };
        recorder.start(1000);
      }
    });

    await new Promise((r) => setTimeout(r, 120000));
    ffmpeg.stdin.end();
    ffmpeg.kill('SIGINT');
    console.log('end');
    await browser.close();
  }
}
