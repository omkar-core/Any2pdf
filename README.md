# Any2PDF

Any2PDF is an all-in-one, browser-based toolkit for working with documents. Convert files to PDF, merge and split PDFs, compress large documents, rotate pages, protect files with passwords, add watermarks, and extract pages — securely and for free to start.

Built with Next.js (App Router), React, Tailwind CSS, shadcn/ui, Radix UI, and Genkit (Google AI). Conversion orchestration happens over an n8n webhook, with LLM-powered file analysis, OCR text extraction, and alternative-tool suggestions on failure.

## Features

- **Convert to PDF** — DOC, DOCX, XLS, XLSX, PPT, PPTX, PNG, JPG, TIFF, BMP, GIF, HTML. PDFs can also be converted to DOCX, XLSX, PPTX, JPG, PNG, and PDF/A.
- **Bulk processing** — upload up to 10 files at once with real-time progress bars and per-file status.
- **Merge PDFs** — combine multiple PDFs and reorder them before merging.
- **Split PDF** — extract pages using ranges such as `1-3,5,8-10` or `all`.
- **Compress PDF** — low / medium / high compression levels.
- **Rotate PDF** — rotate all pages by 90°, 180°, or 270°.
- **Protect PDF** — encrypt a document with a password.
- **Watermark PDF** — stamp custom text across every page.
- **Extract pages** — pull specific pages into a new PDF.
- **OCR text extraction** — scanned images are run through OCR so the generated PDF text is selectable and searchable.
- **LLM file analysis** — files are analyzed for safety and content before conversion.
- **Smart failure recovery** — when the primary conversion path fails, the LLM recommends alternative tools.

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at <http://localhost:9002>.

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

- `GOOGLE_GENAI_API_KEY` — Google AI (Gemini) API key used by the Genkit flows in `src/ai/`.
- `N8N_WEBHOOK_URL` — the n8n webhook endpoint that orchestrates conversions (currently defaults to the URL defined in `src/app/actions.ts`).

### Scripts

| Script               | Description                                        |
| -------------------- | -------------------------------------------------- |
| `npm run dev`        | Start the Next.js dev server (port 9002)           |
| `npm run build`      | Production build                                   |
| `npm run start`      | Start the production server                        |
| `npm run typecheck`  | Run TypeScript type checking                       |
| `npm run genkit:dev` | Start Genkit with the AI flows                     |
| `npm run genkit:watch` | Start Genkit in watch mode                       |

## Architecture

```
src/
├── ai/                   # Genkit setup + AI flows
│   └── flows/            # analyze-file, ocr-text-extraction, suggest-alternative-conversion-tool
├── app/                  # Next.js App Router pages (home, about, blog, contact, disclaimer, faq, privacy, terms)
│   ├── actions.ts        # Server Actions: convertFile, processPdfAction
│   └── layout.tsx        # Root layout + fonts
├── components/
│   ├── conversion-tools.tsx  # Main tool tabs
│   ├── file-uploader.tsx     # Bulk convert file uploader
│   ├── pdf-tool.tsx          # Reusable engine for merge/split/compress/rotate/protect/watermark/extract
│   ├── layout/               # Header & footer
│   └── ui/                   # shadcn/ui components
├── hooks/
└── lib/
```

Conversion requests are sent to an n8n webhook (`src/app/actions.ts`) that performs the heavy lifting (CloudConvert or equivalent API calls, PDF tool operations) and returns the resulting file as a base64 data URI, which the client offers as a direct download.

## Design

- Color palette: light desaturated blue (`#ADD8E6`) primary, very light blue (`#F0F8FF`) background, orange (`#FFA07A`) accents.
- Font: **PT Sans**.
- Clean, glass-style surfaces with subtle animations and drag-and-drop interactions.

## License

Private project. All rights reserved.