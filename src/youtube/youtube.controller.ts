import { Controller, Get } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  @Get()
  index() {
    // 'ffmpeg -re -i audio.mp3 -c copy -f flv rtmp://a.rtmp.youtube.com/live2/3x5k-dfy6-w1uw-76ww-eax4
    return 'Youtube says hi';
  }
}
