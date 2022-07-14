import { Controller, Get } from '@nestjs/common';
import { SoundCloudService } from './soundcloud.service';

@Controller('soundcloud')
export class SoundCloudController {
  constructor(private readonly soundcloud: SoundCloudService) {}

  @Get()
  index() {
    return this.soundcloud.download('https://soundcloud.com/isvvcisvvcisvvc/droppin-bustaz');
  }
}
