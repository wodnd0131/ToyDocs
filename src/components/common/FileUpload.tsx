import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onFileSelect: (files: File[]) => void;
  onProcessingComplete?: (result: unknown) => void;
  className?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
}

export const FileUpload = ({
  accept = '.txt,.doc,.docx,.pdf,.mp3,.wav,.m4a',
  maxSize = 50,
  multiple = false,
  onFileSelect,
  onProcessingComplete,
  className,
  title = '파일 업로드',
  description = '파일을 선택하거나 드래그해서 업로드하세요',
  disabled = false
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    const mockFile = new File(["mock content"], files[0].name, { type: files[0].type });
    
    onFileSelect([mockFile]);

    // Simulate processing completion after a delay
    setTimeout(() => {
      onProcessingComplete?.({
        filename: mockFile.name,
        size: mockFile.size,
        type: mockFile.type,
        processedAt: new Date().toISOString(),
        extractedContent: "Mock extracted content from " + mockFile.name
      });
    }, 1500); // Simulate 1.5 seconds of processing
  }, [onFileSelect, onProcessingComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [disabled, handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    
    // Reset input
    e.target.value = '';
  }, [disabled, handleFiles]);

  return (
    <div className={cn('space-y-4', className)}>
      <Card className="bg-github-darkSecondary border-github-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="w-5 h-5 mr-2 text-toss-blue" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              isDragOver && !disabled
                ? 'border-toss-blue bg-toss-blue/10'
                : 'border-github-border',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept={accept}
              multiple={multiple}
              onChange={handleFileSelect}
              disabled={disabled}
            />
            
            <label 
              htmlFor="file-upload" 
              className={cn(
                'cursor-pointer block',
                disabled && 'cursor-not-allowed'
              )}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-toss-blue/20 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-toss-blue" />
                </div>
                <div>
                  <p className="text-lg font-medium text-white">{title}</p>
                  <p className="text-sm text-gray-400">{description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    지원 형식: {accept} | 최대 크기: {maxSize}MB
                  </p>
                </div>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
