import {
  ConversationTranslation as PrismaConversationTranslation,
  Conversation as PrismaConversation,
} from "@prisma/client";
import { Profile } from "./Profile";

export type Conversation = PrismaConversation;
export type ConversationTranslation = PrismaConversationTranslation;

export type ConversationWithProfile = Conversation & {
  profile: Profile;
  translation?: ConversationTranslation;
};
