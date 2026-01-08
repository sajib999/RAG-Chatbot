import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { db } from "./db-config";
import { documents } from "./db-schema";
import { generateEmbedding } from "./embed";

export async function searchDocuments(
  query: string,
  limit: number = 3,
  threshold: number = 0.5
) {
  try {
    const embedding = await generateEmbedding(query);

    const similarity = sql<number>`1 - (${cosineDistance(
      documents.embedding,
      embedding
    )})`;

    const similarDocuments = await db
      .select({
        id: documents.id,
        content: documents.content,
        similarity,
      })
      .from(documents)
      .where(gt(similarity, threshold))
      .orderBy(desc(similarity))
      .limit(limit);

    return similarDocuments;
  } catch (error) {
    console.error("Error searching documents:", error);
    // Return empty array or null to avoid crashing
    return [];
  }
}
