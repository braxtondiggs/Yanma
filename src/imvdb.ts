import * as rq from 'request-promise';

export class IMVDB {

  public getVideo(id: string): rq.RequestPromise {
    return rq.get(`https://imvdb.com/api/v1/video/${id}`);
  }

  public searchVideos(query: string): rq.RequestPromise {
    return rq.get('http://imvdb.com/api/v1/search/videos', { qs: [{ q: query }] });
  }

  public searchEntities(query: string): rq.RequestPromise {
    return rq.get('http://imvdb.com/api/v1/search/entities', { qs: [{ q: query }] });
  }
}
