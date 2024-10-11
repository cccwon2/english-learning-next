import { User } from "./User";
import { Profile } from "./Profile";

export type UserWithProfile = User & {
  profile: Profile | null;
};
