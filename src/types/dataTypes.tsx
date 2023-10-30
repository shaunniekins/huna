export type ProfileData = {
  id: string;
  username: string;
};

export type NoteData = {
  profile_id: string;
  username: string;
  content: string;
  tag: string;
};

export type NoteDataItem = {
  profile_id: string;
  username: string;
  content: string;
  tag: string;
};
