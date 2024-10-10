import { User } from "./User";

export interface Conversation {
  id: number;
  user_id: number;
  message: string;
  is_user_message: boolean;
  created_at: string;
}

export interface ConversationTranslation {
  id: number;
  conversation_id: number;
  translated_message?: string;
  response?: string;
  translated_response?: string;
  language?: string;
}

export interface ConversationWithUser extends Conversation {
  users: User;
  translation?: ConversationTranslation;
}
