import {
  ConversationTranslation as PrismaConversationTranslation,
  Conversation as PrismaConversation,
} from "@prisma/client";
import { UserWithProfile } from "./User";

export type Conversation = PrismaConversation;
export type ConversationTranslation = PrismaConversationTranslation;

export type ConversationWithUser = Conversation & {
  user: UserWithProfile;
  translation?: ConversationTranslation;
};
