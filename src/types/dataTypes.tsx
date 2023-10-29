export type ProfileData = {
  id: string;
  username: string;
};

export type NoteData = {
  profile_id: string;
  content: string;
  tag: string;
};

export type NoteDataItem = {
  content: string;
  tag: string | null;
};
