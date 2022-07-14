import { Module } from '@nestjs/common';
import { SoundCloudController } from './soundcloud.controller';
import { SoundCloudService } from './soundcloud.service';

@Module({
  controllers: [SoundCloudController],
  providers: [SoundCloudService]
})
export class SoundCloudModule {}
