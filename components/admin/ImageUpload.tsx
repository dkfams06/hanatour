'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  required?: boolean;
  placeholder?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  label, 
  required = false, 
  placeholder = "이미지를 업로드하거나 URL을 입력하세요" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.data.url);
      } else {
        alert(result.error || '이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    } else {
      alert('이미지 파일만 업로드 가능합니다.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={`image-${label}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {/* 이미지 미리보기 */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="미리보기"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 드래그 앤 드롭 업로드 영역 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : value
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isUploading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>업로드 중...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                이미지를 드래그하여 업로드하거나
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                파일 선택
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              JPEG, PNG, WebP (최대 5MB)
            </p>
          </div>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* URL 직접 입력 옵션 */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">또는 이미지 URL 직접 입력</Label>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isUploading}

        />
      </div>
    </div>
  );
} 