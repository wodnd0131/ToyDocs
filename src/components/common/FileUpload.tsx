import { useState, useCallback } from 'react';
import { Upload, FileText, Mic, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  result?: any;
  error?: string;
}

const generateMockExtraction = (file: File) => {
  const isAudio = file.type.startsWith('audio/');
  
  if (isAudio) {
    return {
      transcription: `${file.name}에서 추출된 음성 텍스트입니다. 실제 구현에서는 Web Speech API나 외부 STT 서비스를 사용합니다.`,
      duration: '5:30',
      confidence: 0.92
    };
  } else {
    return {
      text: `${file.name}에서 추출된 텍스트 내용입니다.`,
      pages: Math.floor(Math.random() * 10) + 1,
      wordCount: Math.floor(Math.random() * 1000) + 100
    };
  }
};

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
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
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
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "파일 크기 초과",
          description: `${file.name}은(는) ${maxSize}MB를 초과합니다.`,
          variant: "destructive"
        });
        return false;
      }

      // Check file type
      if (accept && !accept.includes(file.type) && !accept.split(',').some(ext => file.name.endsWith(ext.trim()))) {
        toast({
          title: "지원하지 않는 파일 형식",
          description: `${file.name}은(는) 지원하지 않는 형식입니다.`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Initialize progress tracking
    const newProgress: UploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadProgress(prev => [...prev, ...newProgress]);
    onFileSelect(validFiles);

    // Simulate upload and processing
    validFiles.forEach((file, index) => {
      simulateFileProcessing(file, index);
    });
  }, [maxSize, accept, onFileSelect, toast, uploadProgress.length, simulateFileProcessing]);

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

  const simulateFileProcessing = useCallback(async (file: File, index: number) => {
    const progressIndex = uploadProgress.length + index;
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(prev => 
        prev.map((item, i) => 
          i === progressIndex ? { ...item, progress } : item
        )
      );
    }

    // Simulate processing
    setUploadProgress(prev => 
      prev.map((item, i) => 
        i === progressIndex ? { ...item, status: 'processing', progress: 0 } : item
      )
    );

    // Simulate processing progress
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress(prev => 
        prev.map((item, i) => 
          i === progressIndex ? { ...item, progress } : item
        )
      );
    }

    // Complete processing
    const result = {
      filename: file.name,
      size: file.size,
      type: file.type,
      processedAt: new Date().toISOString(),
      extractedContent: generateMockExtraction(file)
    };

    setUploadProgress(prev => 
      prev.map((item, i) => 
        i === progressIndex ? { 
          ...item, 
          status: 'completed', 
          progress: 100,
          result 
        } : item
      )
    );

    onProcessingComplete?.(result);

    toast({
      title: "파일 처리 완료",
      description: `${file.name}이(가) 성공적으로 처리되었습니다.`,
    });
  }, [onProcessingComplete, toast, uploadProgress.length]);

  const removeFile = (index: number) => {
    setUploadProgress(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('audio/')) {
      return <Mic className="w-6 h-6 text-purple-500" />;
    }
    return <FileText className="w-6 h-6 text-blue-500" />;
  };

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

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

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card className="bg-github-darkSecondary border-github-border">
          <CardHeader>
            <CardTitle className="text-white text-sm">처리 현황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploadProgress.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(item.file)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(item.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="text-xs text-gray-400 capitalize">
                      {item.status === 'uploading' && '업로드 중'}
                      {item.status === 'processing' && '처리 중'}
                      {item.status === 'completed' && '완료'}
                      {item.status === 'error' && '오류'}
                    </span>
                    {item.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {(item.status === 'uploading' || item.status === 'processing') && (
                  <Progress value={item.progress} className="h-2" />
                )}
                
                {item.status === 'completed' && item.result && (
                  <div className="text-xs text-gray-400 bg-github-dark p-2 rounded">
                    {item.result.transcription && (
                      <p>음성 변환 완료 (신뢰도: {(item.result.confidence * 100).toFixed(0)}%)</p>
                    )}
                    {item.result.text && (
                      <p>{item.result.pages}페이지, {item.result.wordCount}단어 추출됨</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};