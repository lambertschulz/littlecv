import { Document, pdf } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import { createElement } from "react";
import { createAttachmentPages } from "../components/pdf/AttachmentPages";
import type { TemplateConfig } from "../templates/registry";
import type { Attachment, CvData, ExportScope } from "../types/cv";
import { saveBlob } from "./save-blob";

export async function exportPdf(
  data: CvData,
  template: TemplateConfig,
  theme: object,
  scope: ExportScope,
  attachments: Attachment[] = [],
): Promise<void> {
  const pages: React.ReactElement[] = [];

  if ((scope === "all" || scope === "coverPage") && data.coverPage) {
    pages.push(createElement(template.coverPage, { data, theme, key: "cp" }));
  }

  if ((scope === "all" || scope === "coverLetter") && data.coverLetter) {
    pages.push(createElement(template.coverLetter, { data, theme, key: "cl" }));
  }

  if (scope === "all" || scope === "cv") {
    pages.push(createElement(template.cv, { data, theme, key: "cv" }));
  }

  // Add image attachments as individual pages (only when exporting "all")
  if (scope === "all" && attachments.length > 0) {
    pages.push(...createAttachmentPages(attachments));
  }

  if (pages.length === 0) return;

  const doc = createElement(Document, {}, ...pages);
  let blob = await pdf(doc).toBlob();

  // Merge PDF attachments using pdf-lib
  const pdfAttachments = attachments.filter(
    (a) => a.mimeType === "application/pdf",
  );
  if (scope === "all" && pdfAttachments.length > 0) {
    blob = await mergePdfAttachments(blob, pdfAttachments);
  }

  await saveBlob(blob, `bewerbung-${scope}.pdf`, "application/pdf", "PDF");
}

async function mergePdfAttachments(
  mainBlob: Blob,
  pdfAttachments: Attachment[],
): Promise<Blob> {
  const mainBytes = new Uint8Array(await mainBlob.arrayBuffer());
  const merged = await PDFDocument.load(mainBytes);

  for (const att of pdfAttachments) {
    const base64 = att.dataUrl.replace(/^data:[^;]+;base64,/, "");
    const pdfBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const srcDoc = await PDFDocument.load(pdfBytes);
    const pages = await merged.copyPages(srcDoc, srcDoc.getPageIndices());
    for (const page of pages) {
      merged.addPage(page);
    }
  }

  const mergedBytes = await merged.save();
  return new Blob([mergedBytes], { type: "application/pdf" });
}
