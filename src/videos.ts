import { IMVDB, Spotify, Youtube } from './';
import { ISpotify, ISpotifyArtist, IVideo } from './interface';

import * as _ from 'lodash';

export class Videos {
  private videos: IVideo[] = [];
  private lastVideo: IVideo = {} as IVideo;
  constructor(
    private imvdb: IMVDB = new IMVDB(),
    private spotify: Spotify = new Spotify(),
    private youtube: Youtube = new Youtube()
  ) { }

  public getNextVideo(): IVideo {
    return _.first(this.videos) as IVideo;
  }

  public getAllVideos(): IVideo[] {
    return this.videos;
  }

  public removeVideo(video: IVideo): void {
    this.setLastPlayedVideo(video);
    this.videos = _.reject(this.videos, ['id', video.id]);
  }

  public setLastPlayedVideo(video: IVideo): void {
    this.lastVideo = video;
  }

  public getLastPlayedVideo(): IVideo {
    return this.lastVideo;
  }

  public addVideo(id?: string): Promise<void> {
    if (!_.isUndefined(id)) {
      return this.youtube.getVideo(id).then((video: IVideo) => {
        this.videos.push(video);
        return Promise.resolve();
      }, (err) => Promise.reject(err));
    } else {
      const video: IVideo = this.getLastPlayedVideo();
      const artist: string = (video.artist && _.isEmpty(video.artist.artists)) ? video.artist.artists[0].name : 'Drake';
      return this.spotify.getRelatedArtist(artist).then((response: ISpotify) =>
        response.artists.items
      ).then((related_artists: ISpotifyArtist[]) => {
        related_artists = _.shuffle(related_artists);
        _.forEach(related_artists, (related_artist: ISpotifyArtist) => {
          return this.imvdb.searchVideos(related_artist.name);
        });
      });
    }
  }
}
