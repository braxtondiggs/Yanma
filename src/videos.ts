import { eachSeries } from 'async';
import { IMVDB, Spotify, Youtube } from './';
import {
  IIMVDBArist, IIMVDBSearchVideo, IIMVDBSources, IIMVDBVideo, ISpotify,
  ISpotifyArtist, ISpotifyRelated, IVideo
} from './interface';

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

  public addVideo(id?: string | null, suggested?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!_.isUndefined(id) && !_.isNull(id)) {
        this.youtube.getVideo(id).then((video: IVideo) => {
          this.videos.push(video);
          return resolve();
        }, (err) => reject(err));
      } else {
        const video: IVideo = this.getLastPlayedVideo();
        let artist: string = (video.artists && _.isEmpty(video.artists)) ? video.artists[0].name : 'Drake';
        artist = suggested ? suggested : artist;
        this.spotify.getRelatedArtist(artist).then((response: ISpotifyRelated) =>
          response.artists
        ).then((related_artists: ISpotifyArtist[]) => {
          eachSeries(_.shuffle(related_artists), (related_artist: ISpotifyArtist, callback) => {
            this.imvdb.searchVideos(related_artist.name).then((response: IIMVDBSearchVideo) => {
              if (response.total_results > 0) {
                return callback(_.chain(response.results).filter((videos: IIMVDBVideo) =>
                  (_.first(videos.artists) as IIMVDBArist).name === related_artist.name
                ).shuffle().first().value());
              }
              callback();
            });
          }, (related_video: IIMVDBVideo | undefined) => {
            if (!_.isUndefined(related_video)) {
              this.imvdb.getVideo(related_video.id).then((response: IIMVDBVideo) => {
                const sources = _.filter(response.sources, ['source', 'youtube']) as IIMVDBSources[];
                if (_.size(sources) > 0) {
                  this.youtube.getVideo(sources[0].source_data).then((_response: IVideo) => {
                    _response.artists = response.artists;
                    _response.featured_artists = response.featured_artists;
                    _response.directors = response.directors;
                    _response.imvdb_id = response.id;
                    _response.imvdb_title = response.song_title;
                    _response.release_date_string = response.release_date_string;
                    this.videos.push(_response);
                    return resolve();
                  }, (err) => reject(err));
                }
              });
            } else {
              this.addVideo(null, 'Somthing Related to Suggest'); // TODO: suggest someting related to related
            }
          });
        });
      }
    });
  }
}
