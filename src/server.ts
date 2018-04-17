const NodeMediaServer = require('node-media-server');

export class Server {
  private config = {
    http: {
      allow_origin: '*',
      port: 8000
    },
    rtmp: {
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30,
      port: 1935
    }
  };

  constructor() {
    const nms = new NodeMediaServer(this.config);
    nms.run();
    nms.on('preConnect', (id: any, args: any) => {
      console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
      // let session = nms.getSession(id: any);
      // session.reject();
    });

    nms.on('postConnect', (id: any, args: any) => {
      console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
    });

    nms.on('doneConnect', (id: any, args: any) => {
      console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
    });

    nms.on('prePublish', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
      // let session = nms.getSession(id: any);
      // session.reject();
    });

    nms.on('postPublish', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });

    nms.on('donePublish', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });

    nms.on('prePlay', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
      // let session = nms.getSession(id: any);
      // session.reject();
    });

    nms.on('postPlay', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });

    nms.on('donePlay', (id: any, StreamPath: any, args: any) => {
      console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });
  }
}
