import { Image, Page } from "@react-pdf/renderer";
import { createElement } from "react";
import type { Attachment } from "../../types/cv";

// A4 in points: 595.28 x 841.89
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

export function createAttachmentPages(
  attachments: Attachment[],
): React.ReactElement[] {
  return attachments
    .filter((a) => a.mimeType.startsWith("image/"))
    .map((att) =>
      createElement(
        Page,
        {
          key: `att-${att.id}`,
          size: "A4",
          style: { padding: 0, margin: 0 },
        },
        createElement(Image, {
          src: att.dataUrl,
          style: {
            objectFit: "contain",
            maxWidth: A4_WIDTH,
            maxHeight: A4_HEIGHT,
          },
        }),
      ),
    );
}
