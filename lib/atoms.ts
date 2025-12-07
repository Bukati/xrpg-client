import { atom } from "jotai";

export interface XUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  description?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

// User atom - stores the current user data
export const userAtom = atom<XUser | null>(null);

// Auth status atom
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
