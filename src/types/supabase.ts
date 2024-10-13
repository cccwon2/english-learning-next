export type Database = {
  auth: {
    users: {
      id: string;
      email: string;
    };
  };
  public: {
    conversations: {
      id: number;
      user_id: string;
      message: string;
      is_user_message: boolean;
      created_at: string;
      updated_at: string;
    };
    conversation_translations: {
      id: number;
      conversation_id: number;
      translated_message: string;
      response: string;
      translated_response: string;
      created_at: string;
      updated_at: string;
    };
  };
};
