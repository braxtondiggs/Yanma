import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoundCloudModule } from './soundcloud/soundcloud.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [SoundCloudModule, YoutubeModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
