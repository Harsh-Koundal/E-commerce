import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf";

// Load worker with Vite's URL transform
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

/**
 * Get total pages in a PDF file
 * @param {File} file
 * @returns {Promise<number>}
 */
export async function getPdfPageCount(file) {
  if (!file) throw new Error("No file provided");
  if (file.type !== "application/pdf") throw new Error("Not a PDF file");

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
}
