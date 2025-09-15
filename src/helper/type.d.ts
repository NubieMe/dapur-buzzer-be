type InfluencerBody = {
  name: string;
  username: string;
  followers: number;
  image: string;
  recommended: boolean;
}

type FilterQuery = {
  page: number;
  limit: number;
  order: string;
  search: string;
}
