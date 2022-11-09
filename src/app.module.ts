import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { SoundCloudModule } from './soundcloud/soundcloud.module';
import { YoutubeModule } from './youtube/youtube.module';
import { YoutubeService } from './youtube/youtube.service';

@Module({
  imports: [ConfigModule.forRoot(), EventsModule, SoundCloudModule, YoutubeModule],
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
