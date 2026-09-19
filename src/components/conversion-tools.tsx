"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileUp,
  GitMerge,
  Scissors,
  Minimize,
  RotateCw,
  ShieldCheck,
  Droplets,
  Layers,
} from "lucide-react";
import { FileUploader } from "./file-uploader";
import { PdfTool } from "./pdf-tool";

export function ConversionTools() {
  return (
    <Tabs defaultValue="convert" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 xl:grid-cols-8 h-auto">
        <TabsTrigger value="convert" className="flex flex-col gap-2 items-center py-2">
          <FileUp className="h-5 w-5" /> Convert
        </TabsTrigger>
        <TabsTrigger value="merge" className="flex flex-col gap-2 items-center py-2">
          <GitMerge className="h-5 w-5" /> Merge
        </TabsTrigger>
        <TabsTrigger value="split" className="flex flex-col gap-2 items-center py-2">
          <Scissors className="h-5 w-5" /> Split
        </TabsTrigger>
        <TabsTrigger value="compress" className="flex flex-col gap-2 items-center py-2">
          <Minimize className="h-5 w-5" /> Compress
        </TabsTrigger>
        <TabsTrigger value="rotate" className="flex flex-col gap-2 items-center py-2">
          <RotateCw className="h-5 w-5" /> Rotate
        </TabsTrigger>
        <TabsTrigger value="protect" className="flex flex-col gap-2 items-center py-2">
          <ShieldCheck className="h-5 w-5" /> Protect
        </TabsTrigger>
        <TabsTrigger value="watermark" className="flex flex-col gap-2 items-center py-2">
          <Droplets className="h-5 w-5" /> Watermark
        </TabsTrigger>
        <TabsTrigger value="extract" className="flex flex-col gap-2 items-center py-2">
          <Layers className="h-5 w-5" /> Extract
        </TabsTrigger>
      </TabsList>
      <div className="mt-6">
        <TabsContent value="convert">
          <FileUploader />
        </TabsContent>
        <TabsContent value="merge">
          <PdfTool mode="merge" />
        </TabsContent>
        <TabsContent value="split">
          <PdfTool mode="split" />
        </TabsContent>
        <TabsContent value="compress">
          <PdfTool mode="compress" />
        </TabsContent>
        <TabsContent value="rotate">
          <PdfTool mode="rotate" />
        </TabsContent>
        <TabsContent value="protect">
          <PdfTool mode="encrypt" />
        </TabsContent>
        <TabsContent value="watermark">
          <PdfTool mode="watermark" />
        </TabsContent>
        <TabsContent value="extract">
          <PdfTool mode="extract" />
        </TabsContent>
      </div>
    </Tabs>
  );
}