import {
  User,
  ConversationTranslation as PrismaConversationTranslation,
  Conversation as PrismaConversation,
} from "@prisma/client";

export type Conversation = PrismaConversation;
export type ConversationTranslation = PrismaConversationTranslation;

export type ConversationWithUser = Conversation & {
  user: User;
  translation?: ConversationTranslation;
};
