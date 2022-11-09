import { Module } from '@nestjs/common';
import { YoutubeService } from 'src/youtube/youtube.service';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway, YoutubeService]
})
export class EventsModule {}
