'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { ArrowLeft, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function BulkUploadPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // 드래그 앤 드롭 핸들러
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          droppedFile.type === 'application/vnd.ms-excel') {
        setFile(droppedFile);
      } else {
        alert('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/tours/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setUploadResult({
          success: result.data.success,
          failed: result.data.failed,
          errors: result.data.errors || []
        });
      } else {
        alert(result.error || '업로드에 실패했습니다.');
      }
    } catch (error) {
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // 템플릿 다운로드 로직
    const link = document.createElement('a');
    link.href = '/api/admin/tours/template';
    link.download = 'tour_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">엑셀 일괄 업로드</h1>
            <p className="text-gray-600">엑셀 파일을 통해 여러 여행상품을 한번에 등록할 수 있습니다.</p>
          </div>
        </div>

        {/* 템플릿 다운로드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              1단계: 템플릿 다운로드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">
                  먼저 엑셀 템플릿을 다운로드하여 상품 정보를 입력해주세요.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• 필수 항목: 제목, 설명, 대표이미지, 출발일, 최대인원, 가격, 지역</li>
                  <li>• 이미지는 URL 형태로 입력해주세요</li>
                  <li>• 포함/불포함 사항은 |(파이프) 문자로 구분해주세요</li>
                </ul>
              </div>
              <Button onClick={downloadTemplate} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                템플릿 다운로드
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 파일 업로드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              2단계: 파일 업로드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <FileSpreadsheet className="w-12 h-12 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setFile(null)} variant="outline">
                      파일 제거
                    </Button>
                    <Button onClick={handleUpload} disabled={isUploading}>
                      {isUploading ? '업로드 중...' : '업로드 시작'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      엑셀 파일을 드래그하거나 클릭하여 선택하세요
                    </p>
                    <p className="text-gray-500">지원 형식: .xlsx, .xls</p>
                  </div>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      파일 선택
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 업로드 결과 */}
        {uploadResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                업로드 결과
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Badge className="bg-green-100 text-green-800">
                  성공: {uploadResult.success}개
                </Badge>
                <Badge className="bg-red-100 text-red-800">
                  실패: {uploadResult.failed}개
                </Badge>
              </div>
              
              {uploadResult.errors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">오류 목록:</p>
                      <ul className="text-sm space-y-1">
                        {uploadResult.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-2">
                <Button onClick={() => router.push('/admin/tours')}>
                  상품 목록으로 이동
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFile(null);
                    setUploadResult(null);
                  }}
                >
                  새 파일 업로드
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
} 