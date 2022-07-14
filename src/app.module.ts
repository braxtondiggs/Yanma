import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoundCloudModule } from './soundcloud/soundcloud.module';

@Module({
  imports: [SoundCloudModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
