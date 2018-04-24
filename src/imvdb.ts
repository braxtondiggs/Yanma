import * as rq from 'request-promise';

export class IMVDB {

  public getVideo(id: number): rq.RequestPromise {
    return rq({ uri: `https://imvdb.com/api/v1/video/${id}`, qs: { include: 'sources,featured' }, json: true });
  }

  public searchVideos(query: string): rq.RequestPromise {
    return rq({ uri: 'http://imvdb.com/api/v1/search/videos', qs: { q: encodeURI(query) }, json: true });
  }

  public searchEntities(query: string): rq.RequestPromise {
    return rq({ uri: 'http://imvdb.com/api/v1/search/entities', qs: { q: encodeURI(query) }, json: true });
  }
}
