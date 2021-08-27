export interface SongListItem {
  songs: {
    id: number;
    name: string;
    artist: string;
    lyrics: string;
    file: string;
    cover: string;
    pubish_date: string;
  }[];
}
