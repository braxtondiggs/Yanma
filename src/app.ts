'use strict';
const Youtube = require('youtube-api');

class App {
  constructor() {
    this.config();
  }

  private config() {
    Youtube.authenticate({
      key: process.env.GOOGLE_API as string,
      type: 'key'
    });
  }
}

export default new App();
