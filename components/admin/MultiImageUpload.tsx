'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label: string;
  maxImages?: number;
  required?: boolean;
}

export default function MultiImageUpload({ 
  value, 
  onChange, 
  label, 
  maxImages = 5, 
  required = false 
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const addImage = () => {
    if (value.length < maxImages) {
      onChange([...value, '']);
    }
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...value];
    newImages[index] = url;
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleMultipleFileUpload = async (files: FileList) => {
    const remainingSlots = maxImages - value.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (filesToUpload.length === 0) {
      alert(`이미지는 최대 ${maxImages}장까지 업로드 가능합니다.`);
      return;
    }

    setIsUploading(true);
    const uploadPromises = filesToUpload.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      return result.success ? result.data.url : null;
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null);
      onChange([...value, ...validUrls]);
    } catch (error) {
      console.error('Multiple upload error:', error);
      alert('일부 이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleMultipleFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleMultipleFileUpload(files);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
          <span className="text-sm text-gray-500 ml-2">
            ({value.length}/{maxImages})
          </span>
        </Label>
        
        {value.length < maxImages && (
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addImage}
              disabled={isUploading}
            >
              <Plus className="w-4 h-4 mr-2" />
              이미지 추가
            </Button>
            
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="multi-file-input"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('multi-file-input')?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              다중 업로드
            </Button>
          </div>
        )}
      </div>

      {/* 다중 파일 드롭 영역 */}
      {value.length < maxImages && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {isUploading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>업로드 중...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="w-6 h-6 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">
                여러 이미지를 드래그하여 한번에 업로드
              </p>
            </div>
          )}
        </div>
      )}

      {/* 이미지 목록 */}
      <div className="space-y-4">
        {value.map((image, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
            <div className="flex-shrink-0">
              <span className="text-sm font-medium text-gray-500">
                이미지 {index + 1}
              </span>
            </div>
            
            <div className="flex-1">
              <ImageUpload
                value={image}
                onChange={(url) => updateImage(index, url)}
                label=""
                placeholder={`이미지 ${index + 1} URL`}
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeImage(index)}
              className="flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          아직 추가된 이미지가 없습니다.
          <br />
          <span className="text-sm">위의 "이미지 추가" 버튼을 클릭하여 이미지를 업로드하세요.</span>
        </div>
      )}
    </div>
  );
} 