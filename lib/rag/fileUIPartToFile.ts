export function fileUIPartToFile(uiFile: any): File | null {
  try {
    // uiFile.data might be ArrayBuffer, Uint8Array, or base64
    return new File([uiFile.data], uiFile.name, { type: uiFile.type });
  } catch (err) {
    console.error("fileUIPartToFile error:", err);
    return null;
  }
}
