export interface ISpotify {
  artists: {
    href: string,
    items: ISpotifyArtist[],
    limit: number,
    next: string,
    offest: number,
    previous: string,
    total: number
  };
}

export interface ISpotifyRelated {
  artists: ISpotifyArtist[];
}

export interface ISpotifyArtist {
  external_urls?: {
    spotify: string
  };
  followers: {
    href: string,
    total: number
  };
  genres?: string[];
  href: string;
  id: string;
  images: ISpotifyArtistImage[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface ISpotifyArtistImage {
  height: number;
  url: string;
  width: number;
}
