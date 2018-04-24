import { IIMVDBArist, IIMVDBDirector } from './';

export interface IVideo {
  publishedAt: string;
  title: string;
  description: string;
  duration: number;
  id: string;
  image: string;
  url: string;
  artists?: IIMVDBArist[];
  featured_artists?: IIMVDBArist[];
  directors?: IIMVDBDirector[];
  imvdb_id?: number;
  imvdb_title?: string;
  release_date_string?: string;
}
