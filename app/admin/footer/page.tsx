'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  RefreshCw, 
  Settings, 
  Building, 
  Link, 
  FileText,
  Copyright,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FooterSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: 'text' | 'textarea' | 'link' | 'email' | 'phone';
  display_name: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export default function FooterManagementPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<FooterSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewData, setPreviewData] = useState<{ [key: string]: string }>({});

  // 푸터 설정 조회
  const fetchFooterSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/footer', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('푸터 설정 조회 결과:', result); // 디버깅용 로그
        if (result.success) {
          setSettings(result.data || []);
          // 미리보기 데이터 생성
          const preview: { [key: string]: string } = {};
          if (result.data && Array.isArray(result.data)) {
            result.data.forEach((setting: FooterSetting) => {
              preview[setting.setting_key] = setting.setting_value || '';
            });
          }
          setPreviewData(preview);
        } else {
          console.error('푸터 설정 조회 실패:', result.error);
          toast({
            title: "오류",
            description: result.error || '푸터 설정 조회에 실패했습니다.',
            variant: "destructive",
          });
        }
      } else {
        const errorText = await response.text();
        console.error('API 응답 오류:', response.status, errorText);
        toast({
          title: "오류",
          description: `푸터 설정 조회에 실패했습니다. (${response.status})`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('푸터 설정 조회 오류:', error);
      toast({
        title: "오류",
        description: '푸터 설정 조회 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 설정 값 변경
  const handleSettingChange = (id: number, field: 'setting_value' | 'is_active', value: string | boolean) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, [field]: value } : setting
    ));

    // 미리보기 데이터도 업데이트
    if (field === 'setting_value') {
      const setting = settings.find(s => s.id === id);
      if (setting) {
        setPreviewData(prev => ({
          ...prev,
          [setting.setting_key]: value as string
        }));
      }
    }
  };

  // 설정 저장
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast({
            title: "성공",
            description: '푸터 설정이 저장되었습니다.',
          });
        } else {
          toast({
            title: "오류",
            description: result.error || '푸터 설정 저장에 실패했습니다.',
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "오류",
          description: '푸터 설정 저장에 실패했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('푸터 설정 저장 오류:', error);
      toast({
        title: "오류",
        description: '푸터 설정 저장 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // 설정 그룹별 분류
  const getSettingsByGroup = () => {
    if (!settings || settings.length === 0) {
      return {
        company: [],
        links: [],
        disclaimers: [],
        copyright: [],
        social: [],
      };
    }
    
    const groups = {
      company: settings.filter(s => 
        s.setting_key.startsWith('company_') || 
        s.setting_key.startsWith('ceo_') || 
        s.setting_key.startsWith('business_') || 
        s.setting_key.startsWith('travel_') || 
        s.setting_key.startsWith('privacy_') || 
        s.setting_key.startsWith('contact_')
      ),
      links: settings.filter(s => s.setting_key.startsWith('link_')),
      disclaimers: settings.filter(s => s.setting_key.startsWith('disclaimer_')),
      copyright: settings.filter(s => s.setting_key.startsWith('copyright_')),
      social: settings.filter(s => s.setting_key.startsWith('social_')),
    };
    return groups;
  };

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const groups = getSettingsByGroup();

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">푸터 관리</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={fetchFooterSettings}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving || loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 설정 편집 */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    푸터 설정 편집
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="company" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="company" className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        회사정보
                      </TabsTrigger>
                      <TabsTrigger value="links" className="flex items-center">
                        <Link className="w-4 h-4 mr-1" />
                        링크
                      </TabsTrigger>
                      <TabsTrigger value="disclaimers" className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        면책조항
                      </TabsTrigger>
                      <TabsTrigger value="copyright" className="flex items-center">
                        <Copyright className="w-4 h-4 mr-1" />
                        저작권
                      </TabsTrigger>
                      <TabsTrigger value="social" className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1" />
                        소셜
                      </TabsTrigger>
                    </TabsList>

                    {/* 회사 정보 */}
                    <TabsContent value="company" className="space-y-4">
                      {groups.company.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          회사 정보 설정이 없습니다.
                        </div>
                      ) : (
                        groups.company.map((setting) => (
                          <div key={setting.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`setting-${setting.id}`}>
                              {setting.display_name}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={setting.is_active}
                                onCheckedChange={(checked) => handleSettingChange(setting.id, 'is_active', checked)}
                              />
                              <Badge variant={setting.is_active ? "default" : "secondary"}>
                                {setting.is_active ? '활성' : '비활성'}
                              </Badge>
                            </div>
                          </div>
                          {setting.setting_type === 'textarea' ? (
                            <Textarea
                              id={`setting-${setting.id}`}
                              value={setting.setting_value}
                              onChange={(e) => handleSettingChange(setting.id, 'setting_value', e.target.value)}
                              placeholder={setting.description}
                              rows={3}
                            />
                          ) : (
                            <Input
                              id={`setting-${setting.id}`}
                              type={setting.setting_type === 'email' ? 'email' : 'text'}
                              value={setting.setting_value}
                              onChange={(e) => handleSettingChange(setting.id, 'setting_value', e.target.value)}
                              placeholder={setting.description}
                            />
                          )}
                        </div>
                      )))}
                    </TabsContent>

                    {/* 링크 */}
                    <TabsContent value="links" className="space-y-4">
                      {groups.links.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          링크 설정이 없습니다.
                        </div>
                      ) : (
                        groups.links.map((setting) => (
                        <div key={setting.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`setting-${setting.id}`}>
                              {setting.display_name}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={setting.is_active}
                                onCheckedChange={(checked) => handleSettingChange(setting.id, 'is_active', checked)}
                              />
                              <Badge variant={setting.is_active ? "default" : "secondary"}>
                                {setting.is_active ? '활성' : '비활성'}
                              </Badge>
                            </div>
                          </div>
                          <Input
                            id={`setting-${setting.id}`}
                            type="text"
                            value={setting.setting_value}
                            onChange={(e) => handleSettingChange(setting.id, 'setting_value', e.target.value)}
                            placeholder={setting.description}
                          />
                        </div>
                      )))}
                    </TabsContent>

                    {/* 면책조항 */}
                    <TabsContent value="disclaimers" className="space-y-4">
                      {groups.disclaimers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          면책조항 설정이 없습니다.
                        </div>
                      ) : (
                        groups.disclaimers.map((setting) => (
                        <div key={setting.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`setting-${setting.id}`}>
                              {setting.display_name}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={setting.is_active}
                                onCheckedChange={(checked) => handleSettingChange(setting.id, 'is_active', checked)}
                              />
                              <Badge variant={setting.is_active ? "default" : "secondary"}>
                                {setting.is_active ? '활성' : '비활성'}
                              </Badge>
                            </div>
                          </div>
                          <Textarea
                            id={`setting-${setting.id}`}
                            value={setting.setting_value}
                            onChange={(e) => handleSettingChange(setting.id, 'setting_value', e.target.value)}
                            placeholder={setting.description}
                            rows={3}
                          />
                        </div>
                      )))}
                    </TabsContent>

                    {/* 저작권 */}
                    <TabsContent value="copyright" className="space-y-4">
                      {groups.copyright.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          저작권 설정이 없습니다.
                        </div>
                      ) : (
                        groups.copyright.map((setting) => (
                        <div key={setting.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`setting-${setting.id}`}>
                              {setting.display_name}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={setting.is_active}
                                onCheckedChange={(checked) => handleSettingChange(setting.id, 'is_active', checked)}
                              />
                              <Badge variant={setting.is_active ? "default" : "secondary"}>
                                {setting.is_active ? '활성' : '비활성'}
                              </Badge>
                            </div>
                          </div>
                          <Input
                            id={`setting-${setting.id}`}
                            type="text"
                            value={setting.setting_value}
                            onChange={(e) => handleSettingChange(setting.id, 'setting_value', e.target.value)}
                            placeholder={setting.description}
                          />
                        </div>
                      )))}
                    </TabsContent>

                    {/* 소셜 미디어 */}
                    <TabsContent value="social" className="space-y-4">
                      {groups.social.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          소셜 미디어 설정이 없습니다.
                        </div>
                      ) : (
                        groups.social.map((setting) => (
                        <div key={setting.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`setting-${setting.id}`}>
                              {setting.display_name}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={setting.is_active}
                                onCheckedChange={(checked) => handleSettingChange(setting.id, 'is_active', checked)}
                              />
                              <Badge variant={setting.is_active ? "default" : "secondary"}>
                                {setting.is_active ? '활성' : '비활성'}
                              </Badge>
                            </div>
                          </div>
                          <Input
                            id={`setting-${setting.id}`}
                            type="url"
                            value={setting.setting_value}
                            onChange={(e) => handleSettingChange(setting.id, 'setting_value', e.target.value)}
                            placeholder={setting.description}
                          />
                        </div>
                      )))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* 미리보기 */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>푸터 미리보기</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    {/* 회사 정보 미리보기 */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-gray-700">회사 정보</h3>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{previewData.company_name} | 대표이사: {previewData.ceo_name}</div>
                        <div>주소: {previewData.company_address}</div>
                        <div>사업자등록번호: {previewData.business_number}</div>
                        <div>통신판매업신고번호: {previewData.travel_agency_number}</div>
                        <div>개인정보관리책임자: {previewData.privacy_officer}</div>
                        <div>이메일: {previewData.contact_email}</div>
                        <div>전화번호: {previewData.contact_phone}</div>
                      </div>
                    </div>

                    {/* 면책조항 미리보기 */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-gray-700">면책조항</h3>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{previewData.disclaimer_1}</div>
                        <div>{previewData.disclaimer_2}</div>
                      </div>
                    </div>

                    {/* 저작권 미리보기 */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-gray-700">저작권</h3>
                      <div className="text-xs text-gray-600">
                        {previewData.copyright_text}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
