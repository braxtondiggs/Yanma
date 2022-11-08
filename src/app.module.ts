import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoundCloudModule } from './soundcloud/soundcloud.module';
import { YoutubeModule } from './youtube/youtube.module';
import { YoutubeService } from './youtube/youtube.service';

@Module({
  imports: [SoundCloudModule, YoutubeModule],
  controllers: [AppController],
  providers: [AppService, YoutubeService]
})
export class AppModule implements OnModuleInit {
  constructor(private readonly youtube: YoutubeService) {}

  onModuleInit() {
    console.log(`Initialization...`);
    this.youtube.run();
  }
}
