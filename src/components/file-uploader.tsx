"use client";

import { useState, useCallback, ChangeEvent, DragEvent, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, File as FileIcon, Download, X, Cog, FileImage, FileText, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { convertFile } from '@/app/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export type ConversionTarget = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'jpg' | 'png' | 'html' | 'pdfa';

export type FileStatus = {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'converting' | 'success' | 'error';
  convertedFileUrl?: string;
  error?: string;
  targetFormat: ConversionTarget;
};

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 25;
const ALLOWED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.ms-powerpoint', // .ppt
  'image/png', // .png
  'image/jpeg', // .jpg, .jpeg
  'image/tiff', // .tiff
  'image/bmp', // .bmp
  'image/gif', // .gif
  'application/pdf', // .pdf
  'text/html', // .html
];

const getTargetFormats = (fileType: string): ConversionTarget[] => {
    if (fileType.startsWith('image/')) return ['pdf'];
    if (fileType.includes('word') || fileType.includes('msword')) return ['pdf'];
    if (fileType.includes('sheet') || fileType.includes('ms-excel')) return ['pdf'];
    if (fileType.includes('presentation') || fileType.includes('ms-powerpoint')) return ['pdf'];
    if (fileType === 'text/html') return ['pdf'];
    if (fileType === 'application/pdf') return ['docx', 'xlsx', 'pptx', 'jpg', 'png', 'pdfa'];
    return [];
};

const getDefaultTargetFormat = (fileType: string): ConversionTarget => {
    const targets = getTargetFormats(fileType);
    return targets[0] || 'pdf';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
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

const FileProgressItem = ({ fileStatus, onRemove, onTargetFormatChange }: { fileStatus: FileStatus, onRemove: () => void, onTargetFormatChange: (id: string, format: ConversionTarget) => void }) => {
  const Icon = useMemo(() => {
    if (fileStatus.file.type.startsWith('image/')) return FileImage;
    if (fileStatus.file.type.includes('document') || fileStatus.file.type.includes('presentation') || fileStatus.file.type.includes('sheet') || fileStatus.file.type.includes('pdf')) return FileText;
    return FileIcon;
  }, [fileStatus.file.type]);

  const statusInfo = useMemo(() => {
    switch (fileStatus.status) {
      case 'pending': return { text: 'Pending conversion' };
      case 'uploading': return { text: 'Preparing...' };
      case 'converting': return { text: 'Converting...' };
      case 'success': return { text: 'Converted successfully!' };
      case 'error': return { text: fileStatus.error || 'Conversion failed' };
    }
  }, [fileStatus.status, fileStatus.error]);

  const targetFormats = getTargetFormats(fileStatus.file.type);

  return (
    <div className="flex items-center space-x-4 rounded-lg border p-3">
      <Icon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{fileStatus.file.name}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>{formatFileSize(fileStatus.file.size)}</span>
          <div className="flex items-center gap-1">
            <span>.{fileStatus.file.name.split('.').pop()}</span>
            <ArrowRight className="h-3 w-3" />
            {targetFormats.length > 1 ? (
                <Select
                    value={fileStatus.targetFormat}
                    onValueChange={(value) => onTargetFormatChange(fileStatus.id, value as ConversionTarget)}
                    disabled={fileStatus.status !== 'pending'}
                >
                    <SelectTrigger className="h-6 text-xs w-auto px-2 py-1">
                        <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                        {targetFormats.map(format => (
                            <SelectItem key={format} value={format}>.{format}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <span>.{fileStatus.targetFormat}</span>
            )}
           </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
            <Badge variant={fileStatus.status === 'success' ? 'default' : fileStatus.status === 'error' ? 'destructive' : 'secondary'}>
                {statusInfo.text}
            </Badge>
        </div>
        {(fileStatus.status === 'uploading' || fileStatus.status === 'converting') && (
           <Progress value={fileStatus.progress} className="h-2 mt-2" />
        )}
      </div>
      <div className="flex items-center gap-2">
        {fileStatus.status === 'success' && fileStatus.convertedFileUrl && (
          <a href={fileStatus.convertedFileUrl} download={`${fileStatus.file.name.split('.').slice(0, -1).join('.')}.${fileStatus.targetFormat}`}>
            <Button size="icon" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </a>
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
      const targetFormat = getDefaultTargetFormat(file.type);
      filesToAdd.push({ file, id: `${file.name}-${file.size}-${Date.now()}`, progress: 0, status: 'pending', targetFormat });
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

  const handleTargetFormatChange = (id: string, format: ConversionTarget) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, targetFormat: format } : f));
  };

  const processFileConversion = async (id: string) => {
    const fileStatus = files.find(f => f.id === id);
    if (!fileStatus) return;

    try {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading', progress: 25 } : f));
        
        const dataUri = await fileToDataUri(fileStatus.file);
        
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'converting', progress: 50 } : f));

        const result = await convertFile(dataUri, fileStatus.file.name, fileStatus.file.type, fileStatus.targetFormat);

        if (result.success && result.url) {
            setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'success', progress: 100, convertedFileUrl: result.url } : f));
        } else {
            throw new Error(result.error || 'Conversion failed');
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: errorMessage } : f));
    }
  };

  const handleConvertAll = async () => {
    setIsConverting(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      toast({ title: "No files to convert", description: "All files have been processed or are in progress."});
      setIsConverting(false);
      return;
    }
    
    const conversionPromises = pendingFiles.map(file => processFileConversion(file.id));
    await Promise.all(conversionPromises);

    setIsConverting(false);
    toast({ title: 'Conversion process finished', description: 'Check the status of each file.' });
  };

  return (
    <div>
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
            id="file-upload" 
            className="hidden" 
            multiple 
            onChange={handleFileChange}
            accept={ALLOWED_FILE_TYPES.join(',')}
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
                onTargetFormatChange={handleTargetFormatChange}
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
    </div>
  );
}
