CREATE TABLE "rag_chatbot" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE INDEX "embedding_index" ON "rag_chatbot" USING hnsw ("embedding" vector_cosine_ops);