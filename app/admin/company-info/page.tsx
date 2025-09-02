'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Save, 
  Loader2, 
  Plus, 
  Trash2,
  Shield,
  Award,
  Globe,
  Users,
  FileText,
  UserCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompanyInfo {
  id?: number;
  company_name: string;
  ceo_name: string;
  established_date: string;
  business_number: string;
  online_business_number: string;
  address: string;
  phone: string;
  email: string;
  privacy_officer: string;
  introduction: string;
  vision_title: string;
  vision_content: string;
  mission_title: string;
  mission_content: string;
  core_values: CoreValue[];
  business_areas: BusinessArea[];
  company_history: CompanyHistory[];
  disclaimers: Disclaimer[];
}

interface CoreValue {
  icon: string;
  title: string;
  description: string;
}

interface BusinessArea {
  title: string;
  description: string;
}

interface CompanyHistory {
  year: string;
  title: string;
  description: string;
}

interface Disclaimer {
  title: string;
  content: string;
}

export default function CompanyInfoPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    company_name: '',
    ceo_name: '',
    established_date: '',
    business_number: '',
    online_business_number: '',
    address: '',
    phone: '',
    email: '',
    privacy_officer: '',
    introduction: '',
    vision_title: '',
    vision_content: '',
    mission_title: '',
    mission_content: '',
    core_values: [
      { icon: 'Shield', title: '신뢰성', description: '투명하고 정직한 비즈니스로 고객의 신뢰를 얻습니다.' },
      { icon: 'Award', title: '품질', description: '최고의 서비스 품질로 고객 만족을 실현합니다.' },
      { icon: 'Globe', title: '혁신', description: '지속적인 혁신으로 여행의 새로운 경험을 제공합니다.' }
    ],
    business_areas: [
      { title: '패키지 여행', description: '다양한 테마의 패키지 여행 상품 제공' },
      { title: '자유여행', description: '맞춤형 자유여행 플랜 설계 및 지원' },
      { title: '단체 여행', description: '기업 연수, 워크샵 등 단체 여행 전문' },
      { title: '여행 상담', description: '전문 여행 상담사가 제공하는 맞춤 상담' }
    ],
    company_history: [
      { year: '2024', title: '서비스 확장', description: '온라인 예약 시스템 구축 및 모바일 앱 런칭' },
      { year: '2023', title: '성장기', description: '연간 고객 수 10,000명 달성, 해외 지사 설립' },
      { year: '2022', title: '안정화', description: '여행업 등록 및 통신판매업 신고 완료' },
      { year: '2020', title: '창립', description: '(주)하나투어 설립, 서울 양천구 목동에 본사 설립' }
    ],
    disclaimers: [
      { title: '여행 일정 변경 관련', content: '부득이한 사정에 의해 확정된 여행일정이 변경되는 경우 여행자의 사전 동의를 받습니다.' },
      { title: '통신판매중개 서비스', content: '(주)하나투어는 항공사가 제공하는 개별 항공권 및 여행사가 제공하는 일부 여행상품에 대하여 통신판매중개자의 지위를 가지며, 해당 상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있습니다.' }
    ]
  });

  // 회사 정보 로드
  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/company-info', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCompanyInfo({
          ...data,
          core_values: data.core_values ? JSON.parse(data.core_values) : companyInfo.core_values,
          business_areas: data.business_areas ? JSON.parse(data.business_areas) : companyInfo.business_areas,
          company_history: data.company_history ? JSON.parse(data.company_history) : companyInfo.company_history,
          disclaimers: data.disclaimers ? JSON.parse(data.disclaimers) : companyInfo.disclaimers
        });
      } else {
        throw new Error('회사 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('회사 정보 로드 오류:', error);
      toast({
        title: "오류",
        description: "회사 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/company-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(companyInfo),
      });

      if (response.ok) {
        toast({
          title: "성공",
          description: "회사 정보가 성공적으로 저장되었습니다.",
        });
      } else {
        throw new Error('저장 실패');
      }
    } catch (error) {
      console.error('회사 정보 저장 오류:', error);
      toast({
        title: "오류",
        description: "회사 정보 저장에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCoreValue = () => {
    setCompanyInfo(prev => ({
      ...prev,
      core_values: [...prev.core_values, { icon: 'Shield', title: '', description: '' }]
    }));
  };

  const removeCoreValue = (index: number) => {
    setCompanyInfo(prev => ({
      ...prev,
      core_values: prev.core_values.filter((_, i) => i !== index)
    }));
  };

  const updateCoreValue = (index: number, field: keyof CoreValue, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      core_values: prev.core_values.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addBusinessArea = () => {
    setCompanyInfo(prev => ({
      ...prev,
      business_areas: [...prev.business_areas, { title: '', description: '' }]
    }));
  };

  const removeBusinessArea = (index: number) => {
    setCompanyInfo(prev => ({
      ...prev,
      business_areas: prev.business_areas.filter((_, i) => i !== index)
    }));
  };

  const updateBusinessArea = (index: number, field: keyof BusinessArea, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      business_areas: prev.business_areas.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addCompanyHistory = () => {
    setCompanyInfo(prev => ({
      ...prev,
      company_history: [...prev.company_history, { year: '', title: '', description: '' }]
    }));
  };

  const removeCompanyHistory = (index: number) => {
    setCompanyInfo(prev => ({
      ...prev,
      company_history: prev.company_history.filter((_, i) => i !== index)
    }));
  };

  const updateCompanyHistory = (index: number, field: keyof CompanyHistory, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      company_history: prev.company_history.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addDisclaimer = () => {
    setCompanyInfo(prev => ({
      ...prev,
      disclaimers: [...prev.disclaimers, { title: '', content: '' }]
    }));
  };

  const removeDisclaimer = (index: number) => {
    setCompanyInfo(prev => ({
      ...prev,
      disclaimers: prev.disclaimers.filter((_, i) => i !== index)
    }));
  };

  const updateDisclaimer = (index: number, field: keyof Disclaimer, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      disclaimers: prev.disclaimers.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">회사정보 관리</h1>
            <p className="text-muted-foreground">
              회사 소개 페이지에 표시되는 정보를 관리합니다.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                저장
              </>
            )}
          </Button>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company_name">회사명</Label>
              <Input
                id="company_name"
                value={companyInfo.company_name}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, company_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="ceo_name">대표이사</Label>
              <Input
                id="ceo_name"
                value={companyInfo.ceo_name}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, ceo_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="established_date">설립일</Label>
              <Input
                id="established_date"
                value={companyInfo.established_date}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, established_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="business_number">사업자등록번호</Label>
              <Input
                id="business_number"
                value={companyInfo.business_number}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, business_number: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="online_business_number">통신판매업신고번호</Label>
              <Input
                id="online_business_number"
                value={companyInfo.online_business_number}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, online_business_number: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* 연락처 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              연락처 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">주소</Label>
              <Input
                id="address"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="privacy_officer">개인정보관리책임자</Label>
              <Input
                id="privacy_officer"
                value={companyInfo.privacy_officer}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, privacy_officer: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 회사 소개 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            회사 소개
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="introduction">소개 내용</Label>
            <Textarea
              id="introduction"
              value={companyInfo.introduction}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, introduction: e.target.value }))}
              rows={6}
              placeholder="회사 소개 내용을 입력하세요..."
            />
          </div>
        </CardContent>
      </Card>

      {/* 비전 & 미션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              비전
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vision_title">비전 제목</Label>
              <Input
                id="vision_title"
                value={companyInfo.vision_title}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, vision_title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="vision_content">비전 내용</Label>
              <Textarea
                id="vision_content"
                value={companyInfo.vision_content}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, vision_content: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              미션
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mission_title">미션 제목</Label>
              <Input
                id="mission_title"
                value={companyInfo.mission_title}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, mission_title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="mission_content">미션 내용</Label>
              <Textarea
                id="mission_content"
                value={companyInfo.mission_content}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, mission_content: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 핵심 가치 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              핵심 가치
            </div>
            <Button onClick={addCoreValue} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companyInfo.core_values.map((value, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">핵심 가치 {index + 1}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCoreValue(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>아이콘</Label>
                    <Input
                      value={value.icon}
                      onChange={(e) => updateCoreValue(index, 'icon', e.target.value)}
                      placeholder="Shield, Award, Globe 등"
                    />
                  </div>
                  <div>
                    <Label>제목</Label>
                    <Input
                      value={value.title}
                      onChange={(e) => updateCoreValue(index, 'title', e.target.value)}
                      placeholder="신뢰성"
                    />
                  </div>
                  <div>
                    <Label>설명</Label>
                    <Input
                      value={value.description}
                      onChange={(e) => updateCoreValue(index, 'description', e.target.value)}
                      placeholder="투명하고 정직한 비즈니스..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 사업 영역 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              사업 영역
            </div>
            <Button onClick={addBusinessArea} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companyInfo.business_areas.map((area, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">사업 영역 {index + 1}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeBusinessArea(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>제목</Label>
                    <Input
                      value={area.title}
                      onChange={(e) => updateBusinessArea(index, 'title', e.target.value)}
                      placeholder="패키지 여행"
                    />
                  </div>
                  <div>
                    <Label>설명</Label>
                    <Input
                      value={area.description}
                      onChange={(e) => updateBusinessArea(index, 'description', e.target.value)}
                      placeholder="다양한 테마의 패키지 여행 상품 제공"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 회사 연혁 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              회사 연혁
            </div>
            <Button onClick={addCompanyHistory} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companyInfo.company_history.map((history, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">연혁 {index + 1}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCompanyHistory(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>연도</Label>
                    <Input
                      value={history.year}
                      onChange={(e) => updateCompanyHistory(index, 'year', e.target.value)}
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <Label>제목</Label>
                    <Input
                      value={history.title}
                      onChange={(e) => updateCompanyHistory(index, 'title', e.target.value)}
                      placeholder="서비스 확장"
                    />
                  </div>
                  <div>
                    <Label>설명</Label>
                    <Input
                      value={history.description}
                      onChange={(e) => updateCompanyHistory(index, 'description', e.target.value)}
                      placeholder="온라인 예약 시스템 구축..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 면책조항 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              면책조항
            </div>
            <Button onClick={addDisclaimer} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companyInfo.disclaimers.map((disclaimer, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">면책조항 {index + 1}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeDisclaimer(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>제목</Label>
                    <Input
                      value={disclaimer.title}
                      onChange={(e) => updateDisclaimer(index, 'title', e.target.value)}
                      placeholder="여행 일정 변경 관련"
                    />
                  </div>
                  <div>
                    <Label>내용</Label>
                    <Textarea
                      value={disclaimer.content}
                      onChange={(e) => updateDisclaimer(index, 'content', e.target.value)}
                      rows={3}
                      placeholder="부득이한 사정에 의해..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
}
