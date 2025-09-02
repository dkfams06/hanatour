'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart,
  Shield,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  UserCheck,
  Loader2
} from 'lucide-react';

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

// 아이콘 컴포넌트 매핑 함수
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Shield,
    Award,
    Globe,
    Users,
    FileText,
    UserCheck,
    Building2,
    Target,
    Heart,
    Star,
    Phone,
    Mail,
    MapPin,
    Calendar
  };
  return iconMap[iconName] || Shield; // 기본값으로 Shield 사용
};



export default function CompanyPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      // 캐시 방지를 위한 타임스탬프 추가
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/company-info?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCompanyInfo(data);
      } else {
        console.error('회사 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('회사 정보 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!companyInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">회사 정보를 불러올 수 없습니다.</p>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">회사소개</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            고객의 꿈을 현실로 만들어주는 신뢰할 수 있는 여행 파트너
          </p>
        </div>

        {/* 회사 개요 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-6 h-6 mr-2" />
              회사 개요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">기업 정보</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">회사명</span>
                    <span className="font-medium">{companyInfo.company_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">대표이사</span>
                    <span className="font-medium">{companyInfo.ceo_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">설립일</span>
                    <span className="font-medium">{companyInfo.established_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">사업자등록번호</span>
                    <span className="font-medium">{companyInfo.business_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">통신판매업신고번호</span>
                    <span className="font-medium">{companyInfo.online_business_number}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">연락처</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">주소</span>
                    <span className="font-medium">{companyInfo.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">전화번호</span>
                    <span className="font-medium">{companyInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">이메일</span>
                    <span className="font-medium">{companyInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">개인정보관리책임자</span>
                    <span className="font-medium">{companyInfo.privacy_officer}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 공정거래위원회 등록 정보 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-6 h-6 mr-2" />
              공정거래위원회 등록 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center relative">
                  {/* 외부 링 */}
                  <div className="absolute inset-2 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="text-white text-xs text-center leading-tight">
                      <div>FAIR TRADE</div>
                      <div className="text-[8px]">COMMISSION</div>
                      <div className="text-[6px] mt-1">REPUBLIC OF KOREA</div>
                    </div>
                  </div>
                  {/* 내부 아이콘 */}
                  <div className="absolute inset-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-8 h-6 bg-blue-400 rounded-sm mb-1"></div>
                      <div className="text-[8px] font-bold">공정거래위원회</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">공정거래위원회 등록 여행사</h3>
                <p className="text-sm text-gray-600 mb-3">
                  (주)하나투어는 공정거래위원회의 엄격한 심사를 통과하여 등록된 신뢰할 수 있는 여행사입니다.
                </p>
                <div className="text-sm text-gray-700">
                  <div className="font-semibold">
                    {companyInfo.company_name} | 대표이사 : {companyInfo.ceo_name}
                  </div>
                  <div>주소 : {companyInfo.address}</div>
                  <div>사업자등록번호 : {companyInfo.business_number}</div>
                  <div>통신판매업신고번호 : {companyInfo.online_business_number}</div>
                  <div>개인정보관리책임자 : {companyInfo.privacy_officer}</div>
                  <div>연락처 : {companyInfo.phone}</div>
                  <div>이메일 : {companyInfo.email}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 회사 소개 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              회사 소개
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {companyInfo.introduction}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비전 & 미션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 mr-2" />
                비전
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">
                  "{companyInfo.vision_title}"
                </h3>
                <p className="text-gray-600">
                  {companyInfo.vision_content}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                미션
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600 mb-4">
                  "{companyInfo.mission_title}"
                </h3>
                <p className="text-gray-600">
                  {companyInfo.mission_content}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 핵심 가치 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-6 h-6 mr-2" />
              핵심 가치
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companyInfo.core_values.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100'];
                const textColors = ['text-blue-600', 'text-green-600', 'text-purple-600'];
                
                return (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 ${bgColors[index % bgColors.length]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`w-8 h-8 ${textColors[index % textColors.length]}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 사업 영역 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-6 h-6 mr-2" />
              사업 영역
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companyInfo.business_areas.map((area, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{area.title}</h3>
                  <p className="text-sm text-gray-600">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 연혁 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>회사 연혁</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {companyInfo.company_history.map((history, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <Badge variant="outline" className="flex-shrink-0">{history.year}</Badge>
                  <div>
                    <h4 className="font-semibold">{history.title}</h4>
                    <p className="text-sm text-gray-600">{history.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 면책조항 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="w-6 h-6 mr-2" />
              면책조항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              {companyInfo.disclaimers.map((disclaimer, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">{disclaimer.title}</p>
                  <p>{disclaimer.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
} 