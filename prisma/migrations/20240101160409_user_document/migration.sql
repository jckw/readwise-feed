-- CreateTable
CREATE TABLE "user_document" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_book_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_document_pkey" PRIMARY KEY ("id")
);
