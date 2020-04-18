export interface Photo {
  name: string;
  url: string;
  width: number;
  height: number;
}

export class UserProfile {
  id: number;
  username: string;
  university: string;
  email: string;
  address: string;
  github: string;
  signature: string;
  avatarUrl: string;
  photos: Photo[];
}
