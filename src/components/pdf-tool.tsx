"use client";

import { useState, useCallback, ChangeEvent, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { processPdfAction } from "@/app/actions";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  UploadCloud,
  File as FileIcon,
  Download,
  X,
  Loader2,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  RotateCw,
  Droplets,
  Combine,
  Scissors,
  Minimize,
  Layers,
} from "lucide-react";

export type PdfToolMode =
  | "merge"
  | "split"
  | "compress"
  | "rotate"
  | "encrypt"
  | "watermark"
  | "extract";

interface PdfToolProps {
  mode: PdfToolMode;
}

export const PDF_TOOL_META: Record<PdfToolMode, { title: string; description: string; multiple: boolean }> = {
  merge: {
    title: "Merge PDFs",
    description: "Combine multiple PDF files into a single document. Reorder your files before merging.",
    multiple: true,
  },
  split: {
    title: "Split PDF",
    description: "Extract pages from a PDF using ranges, e.g. 1-3,5,8-10, or 'all' for every page.",
    multiple: false,
  },
  compress: {
    title: "Compress PDF",
    description: "Reduce the file size of your PDF while optimizing for quality.",
    multiple: false,
  },
  rotate: {
    title: "Rotate PDF",
    description: "Rotate all pages of a PDF by 90, 180, or 270 degrees.",
    multiple: false,
  },
  encrypt: {
    title: "Encrypt PDF",
    description: "Protect your PDF with a password so only intended viewers can open it.",
    multiple: false,
  },
  watermark: {
    title: "Watermark PDF",
    description: "Add a text watermark to every page of your PDF.",
    multiple: false,
  },
  extract: {
    title: "Extract Pages",
    description: "Extract a set of pages (e.g. 2,4,6) from a PDF into a new document.",
    multiple: false,
  },
};

const MODE_ICON: Record<PdfToolMode, typeof FileIcon> = {
  merge: Combine,
  split: Scissors,
  compress: Minimize,
  rotate: RotateCw,
  encrypt: ShieldCheck,
  watermark: Droplets,
  extract: Layers,
};

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 25;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function PdfTool({ mode }: PdfToolProps) {
  const meta = PDF_TOOL_META[mode];
  const Icon = MODE_ICON[mode];
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState<string>("processed.pdf");
  const [error, setError] = useState<string | null>(null);

  const [compressLevel, setCompressLevel] = useState("medium");
  const [rotateDegrees, setRotateDegrees] = useState("90");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [watermarkText, setWatermarkText] = useState("");
  const [ranges, setRanges] = useState("");

  const reset = () => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResultUrl(null);
  };

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const incoming = Array.from(newFiles);
      setFiles(prev => {
        const combined = meta.multiple ? [...prev, ...incoming] : incoming.slice(0, 1);
        if (combined.length > MAX_FILES) {
          toast({
            variant: "destructive",
            title: "File Limit Exceeded",
            description: `You can only upload up to ${MAX_FILES} files at a time.`,
          });
          return prev;
        }
        return combined;
      });
    },
    [meta.multiple, toast]
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  };

  const handleDragEvents = (e: DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    setFiles(prev => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const validate = (): boolean => {
    if (files.length === 0) {
      toast({ variant: "destructive", title: "No files selected", description: "Please upload at least one file." });
      return false;
    }
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast({ variant: "destructive", title: "File Too Large", description: `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.` });
        return false;
      }
    }
    if (mode === "encrypt" && password.length === 0) {
      toast({ variant: "destructive", title: "Password required", description: "Enter a password to encrypt the PDF." });
      return false;
    }
    if (mode === "encrypt" && password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords do not match", description: "Both password fields must match." });
      return false;
    }
    if (mode === "watermark" && watermarkText.trim().length === 0) {
      toast({ variant: "destructive", title: "Watermark text required", description: "Enter the text to use as a watermark." });
      return false;
    }
    if ((mode === "split" || mode === "extract") && ranges.trim().length === 0) {
      toast({ variant: "destructive", title: "Page range required", description: "Enter a page range, e.g. 1-3,5 or 'all'." });
      return false;
    }
    return true;
  };

  const buildOptions = (): Record<string, string> | undefined => {
    switch (mode) {
      case "compress":
        return { level: compressLevel };
      case "rotate":
        return { degrees: rotateDegrees };
      case "encrypt":
        return { password };
      case "watermark":
        return { text: watermarkText.trim() };
      case "split":
      case "extract":
        return { ranges: ranges.trim() };
      default:
        return undefined;
    }
  };

  const handleProcess = async () => {
    if (!validate()) return;

    reset();
    setIsProcessing(true);
    setProgress(25);
    setStatus("processing");

    try {
      const payload = [];
      for (const file of files) {
        const dataUri = await fileToDataUri(file);
        payload.push({ data: dataUri, name: file.name, type: file.type });
      }

      setProgress(50);
      const result = await processPdfAction(payload, mode, buildOptions());

      if (result.success && result.url) {
        setResultUrl(result.url);
        setResultName(result.fileName || `converted.pdf`);
        setProgress(100);
        setStatus("success");
      } else {
        throw new Error(result.error || "Processing failed");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
      setStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-lg transition-colors border-2 border-dashed border-border hover:border-primary",
          isDragging && "bg-primary/10"
        )}
      >
        <input
          type="file"
          id={`pdf-tool-input-${mode}`}
          className="hidden"
          multiple={meta.multiple}
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <label htmlFor={`pdf-tool-input-${mode}`} className="cursor-pointer flex flex-col items-center">
          <Icon className="w-12 h-12 text-muted-foreground mb-4" />
          <span className="font-semibold">Drag & drop {meta.multiple ? "PDF files" : "a PDF file"} here</span>
          <span className="text-muted-foreground mt-1">or click to browse</span>
          <p className="text-xs text-muted-foreground mt-4">
            {meta.multiple ? `Max ${MAX_FILES} files, up to ${MAX_FILE_SIZE_MB}MB each` : `Up to ${MAX_FILE_SIZE_MB}MB, PDF only`}
          </p>
        </label>
      </div>

      {(mode === "compress" || mode === "rotate" || mode === "encrypt" || mode === "watermark" || mode === "split" || mode === "extract") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mode === "compress" && (
            <div className="space-y-2">
              <Label htmlFor="compress-level">Compression Strength</Label>
              <Select value={compressLevel} onValueChange={setCompressLevel}>
                <SelectTrigger id="compress-level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (best quality)</SelectItem>
                  <SelectItem value="medium">Medium (balanced)</SelectItem>
                  <SelectItem value="high">High (smallest size)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {mode === "rotate" && (
            <div className="space-y-2">
              <Label htmlFor="rotate-degrees">Rotation Angle</Label>
              <Select value={rotateDegrees} onValueChange={setRotateDegrees}>
                <SelectTrigger id="rotate-degrees">
                  <SelectValue placeholder="Select angle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90° clockwise</SelectItem>
                  <SelectItem value="180">180°</SelectItem>
                  <SelectItem value="270">90° counter-clockwise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {mode === "encrypt" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pdf-password">Password</Label>
                <Input
                  id="pdf-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pdf-confirm-password">Confirm Password</Label>
                <Input
                  id="pdf-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                />
              </div>
            </>
          )}

          {mode === "watermark" && (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="watermark-text">Watermark Text</Label>
              <Input
                id="watermark-text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL"
              />
            </div>
          )}

          {(mode === "split" || mode === "extract") && (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="page-ranges">Page Ranges</Label>
              <Input
                id="page-ranges"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder='e.g. 1-3,5,8-10 or "all"'
              />
              <p className="text-xs text-muted-foreground">
                Use commas to separate pages and hyphens for ranges. Example: 1-5,9,11-13
              </p>
            </div>
          )}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Selected Files ({files.length})</h4>
          {files.map((file, index) => (
            <div key={`${file.name}-${file.size}-${index}`} className="flex items-center space-x-4 rounded-lg border p-3">
              <FileIcon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              {meta.multiple && (
                <div className="flex flex-col">
                  <Button size="icon" variant="ghost" className="h-6 w-6" disabled={index === 0} onClick={() => moveFile(index, -1)}>
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    disabled={index === files.length - 1}
                    onClick={() => moveFile(index, 1)}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              <Button size="icon" variant="ghost" onClick={() => removeFile(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {(status === "processing" || status === "success") && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={status === "success" ? "default" : "secondary"}>
                  {status === "success" ? "Completed successfully!" : "Processing..."}
                </Badge>
                {status === "processing" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {status === "error" && error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleProcess}
              disabled={isProcessing || files.length === 0}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" /> Run {PDF_TOOL_META[mode].title}
                </>
              )}
            </Button>
            {status === "success" && resultUrl && (
              <a href={resultUrl} download={resultName}>
                <Button size="lg">
                  <Download className="mr-2 h-4 w-4" /> Download Result
                </Button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}