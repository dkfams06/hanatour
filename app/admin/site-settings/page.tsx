'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, RefreshCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SiteSettings {
  site_logo: string;
  site_favicon: string;
  site_title: string;
  site_description: string;
  logo_size: string;
}

export default function SiteSettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [settings, setSettings] = useState<SiteSettings>({
    site_logo: '/images/default-logo.png',
    site_favicon: '/images/default-favicon.ico',
    site_title: 'Hana-Tour',
    site_description: '프리미엄 여행 예약 플랫폼',
    logo_size: '40'
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/site-settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('설정 로드 오류:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        toast({
          title: "파일 크기 오류",
          description: "로고 파일은 5MB 이하여야 합니다.",
          variant: "destructive",
        });
        return;
      }
      setLogoFile(file);
    }
  };

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB 제한
        toast({
          title: "파일 크기 오류",
          description: "파비콘 파일은 1MB 이하여야 합니다.",
          variant: "destructive",
        });
        return;
      }
      setFaviconFile(file);
    }
  };

  const uploadFile = async (file: File, type: 'logo' | 'favicon'): Promise<string> => {
    try {
      console.log('업로드 함수 시작:', { type, fileName: file.name, fileSize: file.size });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const token = localStorage.getItem('token');
      console.log('토큰 확인:', token ? '토큰 존재' : '토큰 없음');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('업로드 응답 상태:', response.status);
      const data = await response.json();
      console.log('업로드 응답 데이터:', data);
      
      if (!data.success) {
        throw new Error(data.message || '파일 업로드 실패');
      }

      return data.filePath;
    } catch (error) {
      console.error('업로드 함수 오류:', error);
      throw error;
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      console.log('설정 저장 시작:', { settings, logoFile, faviconFile });
      
      let logoPath = settings.site_logo;
      let faviconPath = settings.site_favicon;

      // 로고 업로드
      if (logoFile) {
        console.log('로고 파일 업로드 시작:', logoFile.name);
        logoPath = await uploadFile(logoFile, 'logo');
        console.log('로고 업로드 완료:', logoPath);
      }

      // 파비콘 업로드
      if (faviconFile) {
        console.log('파비콘 파일 업로드 시작:', faviconFile.name);
        faviconPath = await uploadFile(faviconFile, 'favicon');
        console.log('파비콘 업로드 완료:', faviconPath);
      }

      console.log('사이트 설정 업데이트 시작:', { logoPath, faviconPath });
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...settings,
          site_logo: logoPath,
          site_favicon: faviconPath,
        }),
      });

      console.log('설정 업데이트 응답 상태:', response.status);
      const data = await response.json();
      console.log('설정 업데이트 응답 데이터:', data);
      
      if (data.success) {
        setSettings({
          ...settings,
          site_logo: logoPath,
          site_favicon: faviconPath,
        });
        setLogoFile(null);
        setFaviconFile(null);
        toast({
          title: "설정 저장 완료",
          description: "사이트 설정이 성공적으로 저장되었습니다.",
        });
        
        // 설정을 다시 불러와서 Context 업데이트
        await fetchSettings();
        
        // 전역 사이트 설정 새로고침 이벤트 발생 - 즉시 반영을 위해
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refreshSiteSettings'));
        }
      } else {
        throw new Error(data.message || '설정 저장 실패');
      }
    } catch (error) {
      console.error('설정 저장 오류:', error);
      toast({
        title: "설정 저장 실패",
        description: error instanceof Error ? error.message : '설정 저장 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isLoadingSettings) {
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">사이트 설정</h1>
          <Button onClick={fetchSettings} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
        </div>

        <div className="grid gap-6">
          {/* 로고 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>로고 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-32 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {settings.site_logo ? (
                    <img 
                      src={settings.site_logo} 
                      alt="현재 로고" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">로고 없음</span>
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="logo-upload">새 로고 업로드</Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    권장 크기: 200x80px, 최대 5MB (PNG, JPG, SVG)
                  </p>
                </div>
              </div>
              
              {/* 로고 크기 조절 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Label htmlFor="logo-size">로고 크기 조절</Label>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 w-12">작게</span>
                    <div className="flex-1">
                      <Slider
                        value={[parseInt(settings.logo_size)]}
                        onValueChange={(value) => setSettings({ ...settings, logo_size: value[0].toString() })}
                        max={80}
                        min={20}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">크게</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>현재 크기: {settings.logo_size}px</span>
                    <div className="flex items-center space-x-2">
                      <span>미리보기:</span>
                      {settings.site_logo && (
                        <img 
                          src={settings.site_logo} 
                          alt="로고 미리보기" 
                          style={{ height: `${parseInt(settings.logo_size)}px` }}
                          className="object-contain border border-gray-200 rounded"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 파비콘 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>파비콘 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                  {settings.site_favicon ? (
                    <img 
                      src={settings.site_favicon} 
                      alt="현재 파비콘" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs">파비콘 없음</span>
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="favicon-upload">새 파비콘 업로드</Label>
                  <Input
                    id="favicon-upload"
                    type="file"
                    accept="image/*,.ico"
                    onChange={handleFaviconUpload}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    권장 크기: 32x32px, 최대 1MB (ICO, PNG)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 기본 정보 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site-title">사이트 제목</Label>
                <Input
                  id="site-title"
                  value={settings.site_title}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                  placeholder="사이트 제목을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="site-description">사이트 설명</Label>
                <Textarea
                  id="site-description"
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  placeholder="사이트 설명을 입력하세요"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? '저장 중...' : '설정 저장'}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
