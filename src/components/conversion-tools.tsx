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
  FileText,
} from "lucide-react";
import { FileUploader } from "./file-uploader";
import { PlaceholderTool } from "./placeholder-tool";

export function ConversionTools() {
  return (
    <Tabs defaultValue="convert" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
        <TabsTrigger value="convert" className="flex flex-col md:flex-row gap-2 items-center py-2">
          <FileUp className="h-5 w-5" /> Convert
        </TabsTrigger>
        <TabsTrigger value="merge" className="flex flex-col md:flex-row gap-2 items-center py-2">
          <GitMerge className="h-5 w-5" /> Merge
        </TabsTrigger>
        <TabsTrigger value="split" className="flex flex-col md:flex-row gap-2 items-center py-2">
          <Scissors className="h-5 w-5" /> Split
        </TabsTrigger>
        <TabsTrigger value="compress" className="flex flex-col md:flex-row gap-2 items-center py-2">
          <Minimize className="h-5 w-5" /> Compress
        </TabsTrigger>
        <TabsTrigger value="edit" className="flex flex-col md:flex-row gap-2 items-center py-2">
          <FileText className="h-5 w-5" /> More Tools
        </TabsTrigger>
      </TabsList>
      <div className="mt-6">
        <TabsContent value="convert">
          <FileUploader />
        </TabsContent>
        <TabsContent value="merge">
            <PlaceholderTool title="Merge PDFs" description="Combine multiple PDF files into a single document. Upload your files and arrange them in the desired order." />
        </TabsContent>
        <TabsContent value="split">
             <PlaceholderTool title="Split PDF" description="Extract one or more pages from a PDF file. Select the pages or ranges you want to split." />
        </TabsContent>
        <TabsContent value="compress">
             <PlaceholderTool title="Compress PDF" description="Reduce the file size of your PDF while optimizing for maximal quality." />
        </TabsContent>
        <TabsContent value="edit">
             <PlaceholderTool title="More PDF Tools Coming Soon!" description="We are working on adding more tools like Edit, Rotate, Unlock, Watermark, and more. Stay tuned!" />
        </TabsContent>
      </div>
    </Tabs>
  );
}
