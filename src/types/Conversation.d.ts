import {
  ConversationTranslation as PrismaConversationTranslation,
  Conversation as PrismaConversation,
} from "@prisma/client";

export type Conversation = PrismaConversation;
export type ConversationTranslation = PrismaConversationTranslation;

export type ConversationWithTranslation = Conversation & {
  translation?: ConversationTranslation;
};
