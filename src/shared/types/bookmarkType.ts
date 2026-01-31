import type { Cargo } from "./cargo";

export type BookmarkParams = {
  cargo: Cargo;
  id: number;
  user: number;
};

export interface BookmarkPostData {
  user: number | undefined;
  cargo: number;
}
