import { IIMVDBVideo } from './';

export interface IVideo {
  publishedAt: string;
  title: string;
  description: string;
  duration: number;
  id: string;
  image: string;
  url: string;
  artist?: IIMVDBVideo;
}
