import { ISpotify } from './interface';
const SpotifyApi = require('node-spotify-api');

export class Spotify {
  private spotify: any;
  constructor() {
    this.spotify = new SpotifyApi({
      id: process.env.SPOTIFY_ID as string,
      secret: process.env.SPOTIFY_SECRET as string
    });
  }

  public getRelatedArtist(artist: string = 'Drake'): Promise<any> {
    return this.spotify.search({ type: 'artist', query: artist }).then((response: ISpotify) =>
      this.getSpotifyRelatedArtists(response.artists.items[0].id)
    ).then((response: ISpotify) =>
      Promise.resolve(response)
    ).catch((err: any) => Promise.reject(err.message));
  }

  private getSpotifyRelatedArtists(id: string): Promise<any> {
    return this.spotify.request(`https://api.spotify.com/v1/artists/${id}/related-artists`);
  }
}
