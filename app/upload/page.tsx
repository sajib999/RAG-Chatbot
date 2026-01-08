"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { processPdfFile } from "./actions";

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const result = await processPdfFile(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "PDF processed successfully",
        });
        e.target.value = "";
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to process PDF",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "An error occurred while processing the PDF",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitStatus: "ready" | "streaming" = isLoading ? "streaming" : "ready";

  return (
    <div className='flex h-[calc(100vh-64px)] bg-background'>
      <aside className='w-64 border-r p-4'>
        <h2 className='mb-2 text-xl font-bold'>Uploads</h2>
        <p className='text-sm text-muted-foreground'>
          Upload PDFs for AI processing
        </p>
      </aside>

      <div className='flex flex-1 flex-col justify-center p-6 max-w-3xl'>
        <PromptInputProvider>
          <PromptInput multiple globalDrop onSubmit={handleFileUpload}>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>

            <PromptInputBody>
              <PromptInputTextarea placeholder='Add instructions (optional)...' />
            </PromptInputBody>

            <PromptInputFooter>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>

              <PromptInputSubmit status={submitStatus} disabled={isLoading} />
            </PromptInputFooter>
          </PromptInput>
        </PromptInputProvider>

        {message && (
          <Alert
            className='mt-4'
            variant={message.type === "error" ? "destructive" : "default"}>
            <AlertTitle>
              {message.type === "error" ? "Error!" : "Success!"}
            </AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
