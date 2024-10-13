-- CreateTable
CREATE TABLE "public"."conversations" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_user_message" BOOLEAN NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversation_translations" (
    "id" SERIAL NOT NULL,
    "response" TEXT,
    "language" TEXT,
    "conversation_id" INTEGER NOT NULL,
    "translated_message" TEXT,
    "translated_response" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "conversation_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversations_user_id_idx" ON "public"."conversations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_translations_conversation_id_key" ON "public"."conversation_translations"("conversation_id");

-- CreateIndex
CREATE INDEX "conversation_translations_conversation_id_idx" ON "public"."conversation_translations"("conversation_id");

-- AddForeignKey
ALTER TABLE "public"."conversation_translations" ADD CONSTRAINT "conversation_translations_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
