'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface FooterData {
  company_name?: string;
  ceo_name?: string;
  company_address?: string;
  business_number?: string;
  travel_agency_number?: string;
  privacy_officer?: string;
  contact_email?: string;
  contact_phone?: string;
  link_company?: string;
  link_privacy?: string;
  link_terms?: string;
  link_overseas_terms?: string;
  disclaimer_1?: string;
  disclaimer_2?: string;
  copyright_text?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_youtube?: string;
  social_blog?: string;
}

export default function Footer() {
  const { settings, isLoading } = useSiteSettings();
  const [footerData, setFooterData] = useState<FooterData>({});
  const [loading, setLoading] = useState(true);

  // 푸터 설정 가져오기
  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const response = await fetch('/api/footer-settings');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setFooterData(result.data);
          }
        }
      } catch (error) {
        console.error('푸터 설정 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterSettings();
  }, []);

  // 기본값 설정
  const data = {
    company_name: footerData.company_name || '(주)하나투어',
    ceo_name: footerData.ceo_name || '홍승준',
    company_address: footerData.company_address || '서울특별시 양천구 목동',
    business_number: footerData.business_number || '892-86-02037',
    travel_agency_number: footerData.travel_agency_number || '2020-서울구로-1996',
    privacy_officer: footerData.privacy_officer || '홍승준',
    contact_email: footerData.contact_email || 'dkfams06@naver.com',
    contact_phone: footerData.contact_phone || '1588-1234',
    link_company: footerData.link_company || '/company',
    link_privacy: footerData.link_privacy || '/privacy',
    link_terms: footerData.link_terms || '/terms',
    link_overseas_terms: footerData.link_overseas_terms || '/overseas-travel-terms',
    disclaimer_1: footerData.disclaimer_1 || '※ 부득이한 사정에 의해 확정된 여행일정이 변경되는 경우 여행자의 사전 동의를 받습니다.',
    disclaimer_2: footerData.disclaimer_2 || '※ (주)하나투어는 항공사가 제공하는 개별 항공권 및 여행사가 제공하는 일부 여행상품에 대하여 통신판매중개자의 지위를 가지며, 해당 상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있습니다.',
    copyright_text: footerData.copyright_text || 'COPYRIGHT © (주)하나투어 INC. ALL RIGHTS RESERVED.',
  };

  if (loading) {
    return (
      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">로딩 중...</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-100">
      {/* 상단 네비게이션 바 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 py-4">
            <Link href={data.link_company} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              회사소개
            </Link>
            <Link href={data.link_privacy} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              개인정보취급방침
            </Link>
            <Link href={data.link_terms} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              서비스 이용약관
            </Link>
            <Link href={data.link_overseas_terms} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              해외여행약관
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 푸터 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
          {/* 회사 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {!isLoading && (
                <img 
                  src={settings.site_logo || '/images/default-logo.svg'} 
                  alt={settings.site_title || 'Hana-Tour'} 
                  style={{ height: `${parseInt(settings.logo_size || '40')}px` }}
                  className="w-auto object-contain"
                />
              )}
            </Link>
          </div>



          {/* 회사 정보 */}
          <div className="flex-1">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="font-semibold">
                {data.company_name} | 대표이사 : {data.ceo_name}
              </div>
              <div>
                주소 : {data.company_address}
              </div>
              <div>
                사업자등록번호 : {data.business_number}
              </div>
              <div>
                통신판매업신고번호 : {data.travel_agency_number}
              </div>
              <div>
                개인정보관리책임자 : {data.privacy_officer}
              </div>
              <div>
                이메일 : {data.contact_email}
              </div>
              {data.contact_phone && (
                <div>
                  전화번호 : {data.contact_phone}
                </div>
              )}
            </div>

            {/* 면책조항 */}
            <div className="mt-6 space-y-3 text-xs text-gray-600">
              <div>
                {data.disclaimer_1}
              </div>
              <div>
                {data.disclaimer_2}
              </div>
            </div>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500">
            {data.copyright_text}
          </div>
        </div>
      </div>
    </footer>
  );
}