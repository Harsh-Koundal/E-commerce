import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsVersion from "pdfjs-dist/package.json";

// ✅ Set workerSrc only once (match the installed version)
GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion.version}/pdf.worker.min.js`;


/**
 * Get total pages in a PDF file
 * @param {File|Blob} file - PDF file (from input or drag-drop)
 * @returns {Promise<number>} total pages
 */
export async function getPdfPageCount(file) {
  if (!file) throw new Error("No file provided");
  if (file.type !== "application/pdf") throw new Error("Not a PDF file");

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
}
