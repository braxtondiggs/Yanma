export interface IIMVDBVideo {
  id: number;
  production_status: string;
  song_title: string;
  song_slug: string;
  url: string;
  multiple_versions: boolean;
  version_name: string;
  version_number: number;
  is_imvdb_pick: boolean;
  aspect_ratio?: string;
  year: number;
  verified_credits: false;
  artists: IIMVDBArist[];
  image: IIMVDBImages;
  directors?: IIMVDBDirector[];
  release_date_stamp: number;
  release_date_string: string;
}

export interface IIMVDBSearchVideo {
  total_results: number;
  current_page: number;
  per_page: number;
  total_pages: number;
  results: IIMVDBVideo[];
}

export interface IIMVDBArist {
  name: string;
  slug: string;
  url: string;
}

export interface IIMVDBImages {
  o?: string;
  l?: string;
  b?: string;
  t?: string;
  s?: string;
}

export interface IIMVDBDirector {
  position_name: string;
  position_code: string;
  entity_name: string;
  entity_slug: string;
  entity_id: number;
  position_notes: string;
  position_id: number;
  entity_url: string;
}
