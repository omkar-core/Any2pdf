"use client";

import { useState, useCallback, ChangeEvent, DragEvent, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, File as FileIcon, CheckCircle2, AlertCircle, Download, X, Cog, FileImage, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

type FileStatus = {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'converting' | 'success' | 'error';
  convertedFileUrl?: string;
  error?: string;
};

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 25;
const ALLOWED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'image/png', // .png
  'image/jpeg', // .jpg, .jpeg
  'image/tiff', // .tiff
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const FileProgressItem = ({ fileStatus, onRemove }: { fileStatus: FileStatus, onRemove: () => void }) => {
  const Icon = useMemo(() => {
    if (fileStatus.file.type.startsWith('image/')) return FileImage;
    if (fileStatus.file.type.includes('document') || fileStatus.file.type.includes('presentation') || fileStatus.file.type.includes('sheet')) return FileText;
    return FileIcon;
  }, [fileStatus.file.type]);

  const statusInfo = useMemo(() => {
    switch (fileStatus.status) {
      case 'pending': return { text: 'Pending conversion', color: 'bg-gray-400' };
      case 'uploading': return { text: `Uploading... ${fileStatus.progress}%`, color: 'bg-blue-500' };
      case 'converting': return { text: `Converting... ${fileStatus.progress}%`, color: 'bg-yellow-500' };
      case 'success': return { text: 'Converted successfully!', color: 'bg-green-500' };
      case 'error': return { text: fileStatus.error || 'Conversion failed', color: 'bg-red-500' };
    }
  }, [fileStatus.status, fileStatus.progress, fileStatus.error]);

  return (
    <div className="flex items-center space-x-4 rounded-lg border p-3">
      <Icon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{fileStatus.file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(fileStatus.file.size)}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={fileStatus.status === 'success' ? 'default' : fileStatus.status === 'error' ? 'destructive' : 'secondary'}>
            {statusInfo.text}
          </Badge>
        </div>
        {(fileStatus.status === 'uploading' || fileStatus.status === 'converting') && (
           <Progress value={fileStatus.progress} className="h-2 mt-2" />
        )}
      </div>
      <div className="flex items-center gap-2">
        {fileStatus.status === 'success' && (
          <Button size="icon" variant="outline" onClick={() => window.open(fileStatus.convertedFileUrl, '_blank')}>
            <Download className="h-4 w-4" />
          </Button>
        )}
        <Button size="icon" variant="ghost" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export function FileUploader() {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const filesToAdd: FileStatus[] = [];
    for (const file of Array.from(newFiles)) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: `File "${file.name}" is not a supported type.` });
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast({ variant: 'destructive', title: 'File Too Large', description: `File "${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.` });
        continue;
      }
      if (files.some(f => f.file.name === file.name && f.file.size === file.size)) {
        toast({ variant: 'destructive', title: 'Duplicate File', description: `File "${file.name}" is already in the list.` });
        continue;
      }
      filesToAdd.push({ file, id: `${file.name}-${file.size}-${Date.now()}`, progress: 0, status: 'pending' });
    }
    
    if (files.length + filesToAdd.length > MAX_FILES) {
      toast({ variant: 'destructive', title: 'File Limit Exceeded', description: `You can only upload up to ${MAX_FILES} files at a time.` });
      return;
    }
    
    setFiles(prev => [...prev, ...filesToAdd]);
  }, [files, toast]);

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

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };
  
  const simulateConversion = (id: string) => {
    return new Promise<void>((resolve, reject) => {
      let progress = 0;
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading', progress: 0 } : f));
      
      const uploadInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          clearInterval(uploadInterval);
          progress = 0;
          setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'converting', progress: 0 } : f));
          
          const convertInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
              clearInterval(convertInterval);
              // Simulate success/error
              if (Math.random() > 0.1) { // 90% success rate
                setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'success', progress: 100, convertedFileUrl: URL.createObjectURL(new Blob(["mock pdf content"], { type: "application/pdf" })) } : f));
                resolve();
              } else {
                setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: 'Conversion failed' } : f));
                reject();
              }
            } else {
              setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'converting', progress: Math.min(100, Math.round(progress)) } : f));
            }
          }, 200);
        } else {
          setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading', progress: Math.min(100, Math.round(progress)) } : f));
        }
      }, 100);
    });
  };

  const handleConvertAll = async () => {
    setIsConverting(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      toast({ title: "No files to convert", description: "All files have been processed or are in progress."});
      setIsConverting(false);
      return;
    }
    
    for (const file of pendingFiles) {
      try {
        await simulateConversion(file.id);
      } catch (error) {
        console.error(`Failed to convert ${file.file.name}`);
      }
    }

    setIsConverting(false);
    toast({ title: 'Conversion process finished', description: 'Check the status of each file.' });
  };

  return (
    <Card className="shadow-lg border-2 border-dashed border-border hover:border-primary transition-all duration-300 bg-background/50">
      <CardContent className="p-6">
        <div 
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-lg transition-colors",
            isDragging && "bg-primary/10"
          )}
        >
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            multiple 
            onChange={handleFileChange}
            accept=".docx,.xlsx,.pptx,.png,.jpg,.jpeg,.tiff"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
            <span className="font-semibold">Drag & drop files here</span>
            <span className="text-muted-foreground mt-1">or click to browse</span>
            <p className="text-xs text-muted-foreground mt-4">Max {MAX_FILES} files, up to {MAX_FILE_SIZE_MB}MB each</p>
          </label>
        </div>
        
        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Your Files</h3>
            {files.map(fileStatus => (
              <FileProgressItem 
                key={fileStatus.id}
                fileStatus={fileStatus}
                onRemove={() => removeFile(fileStatus.id)}
              />
            ))}
            <Button 
              onClick={handleConvertAll} 
              disabled={isConverting || !files.some(f => f.status === 'pending')}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              <Cog className={`mr-2 h-4 w-4 ${isConverting ? 'animate-spin' : ''}`} />
              {isConverting ? 'Converting...' : `Convert ${files.filter(f=>f.status === 'pending').length} File(s)`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
