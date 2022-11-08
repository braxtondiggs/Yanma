import { Injectable } from '@nestjs/common';
import { launch } from 'puppeteer';
import { spawn } from 'child_process';

@Injectable()
export class YoutubeService {
  async run() {
    launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }).then(async (browser) => {
      const page = await browser.newPage();

      await page.goto('https://www.youtube.com/watch?v=sHz8Zr8fj6I', { waitUntil: 'networkidle2' });

      await this.stream({
        page: page,
        key: 'xxxx-xxxx-xxxx-xxxx',
        fps: 30,
        pipeOutput: true,
        prepare: function (browser, page) {
          console.log('Preparing...');
        },
        render: function (browser, page, frame) {
          console.log('Rendering...');
        }
      });

      await browser.close();
    });
  }

  private async stream(options) {
    const browser = options.browser || (await launch());
    const page = options.page || (await browser.newPage());

    await options.prepare(browser, page);

    const ffmpegPath = options.ffmpeg || 'ffmpeg';
    const fps = options.fps || 30;
    const resolution = options.resolution || '1280x720';
    const preset = options.preset || 'medium';
    const rate = options.rate || '2500k';
    const threads = options.threads || '2';

    const outUrl = options.output || 'rtmp://a.rtmp.youtube.com/live2/';

    const ffmpegArgs = (fps) => [
      // IN
      '-f',
      'image2pipe',
      '-use_wallclock_as_timestamps',
      '1',
      '-i',
      '-',
      '-f',
      'lavfi',
      '-i',
      'anullsrc',
      // OUT
      // '-filter:v bwdif=mode=send_field:parity=auto:deint=all',
      '-s',
      resolution,
      '-vsync',
      'cfr',
      '-r',
      fps,
      '-g',
      fps * 2,
      '-vcodec',
      'libx264',
      '-x264opts',
      'keyint=' + fps * 2 + ':no-scenecut',
      '-preset',
      preset,
      '-b:v',
      rate,
      '-minrate',
      rate,
      '-maxrate',
      rate,
      '-bufsize',
      rate,
      '-pix_fmt',
      'yuv420p',
      '-threads',
      threads,
      '-f',
      'lavfi',
      '-acodec',
      'libmp3lame',
      '-ar',
      '44100',
      '-b:a',
      '128k',
      '-f',
      'flv'
    ];

    const args = ffmpegArgs(fps);

    const fullUrl = outUrl + options.key;
    args.push(fullUrl);

    const ffmpeg = spawn(ffmpegPath, args);

    let screenshot = null;

    if (options.pipeOutput) {
      ffmpeg.stdout.pipe(process.stdout);
      ffmpeg.stderr.pipe(process.stderr);
    }

    while (true) {
      await options.render(browser, page);

      screenshot = await page.screenshot({ type: 'jpeg' });

      ffmpeg.stdin.write(screenshot);
    }
  }
}
