-- CreateEnum
CREATE TYPE "NameSuffix" AS ENUM ('A', 'B');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "class" INTEGER NOT NULL,
    "nameSuffix" "NameSuffix" NOT NULL DEFAULT 'A',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "is_user_message" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationTranslation" (
    "id" SERIAL NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "translated_message" TEXT,
    "response" TEXT,
    "translated_response" TEXT,
    "language" TEXT,

    CONSTRAINT "ConversationTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_grade_class_name_nameSuffix_key" ON "User"("grade", "class", "name", "nameSuffix");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationTranslation_conversation_id_key" ON "ConversationTranslation"("conversation_id");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationTranslation" ADD CONSTRAINT "ConversationTranslation_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
