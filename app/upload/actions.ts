"use server";

import { chunkContent } from "@/lib/rag/chunk";
import { db } from "@/lib/rag/db-config";
import { documents } from "@/lib/rag/db-schema";
import { generateEmbeddings } from "@/lib/rag/embed";
import pdf from "pdf-parse";

export async function processPdfFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;
    if (!file) {
      return { success: false, error: "No PDF file provided" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const data = await pdf(buffer);

    if (!data.text || !data.text.trim()) {
      return { success: false, error: "No text found in PDF" };
    }

    const chunks = await chunkContent(data.text);
    const embeddings = await generateEmbeddings(chunks);

    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
    }));

    await db.insert(documents).values(records);

    return {
      success: true,
      message: `Created ${records.length} searchable chunks`,
    };
  } catch (error) {
    console.error("PDF processing error:", error);
    return { success: false, error: "Failed to process PDF" };
  }
}
