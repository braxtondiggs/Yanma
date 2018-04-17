export interface IYoutube {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number,
    resultsPerPage: number
  };
  items: IYoutubeItems[];
}

export interface IYoutubeItems {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string,
    channelId: string,
    title: string,
    description: string,
    thumbnails?: any,
    channelTitle: string,
    tags: string[],
    categoryId: string,
    liveBroadcastContent: string,
    defaultLanguage: string,
    localized: {
      title: string,
      description: string
    },
    defaultAudioLanguage: string
  };
  contentDetails: {
    duration: string,
    dimension: string,
    definition: string,
    caption: string,
    licensedContent: string,
    projection: string
  };
}
