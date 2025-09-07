'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// 윈도우 이벤트 타입 확장
declare global {
  interface WindowEventMap {
    refreshSiteSettings: CustomEvent;
  }
}

interface SiteSettings {
  site_logo: string;
  site_favicon: string;
  site_title: string;
  site_description: string;
  logo_size: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({
    site_logo: '',
    site_favicon: '/images/default-favicon.ico',
    site_title: 'Hana-Tour',
    site_description: '프리미엄 여행 예약 플랫폼',
    logo_size: '40'
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      // 캐시 무효화를 위한 타임스탬프 추가
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/site-settings?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('사이트 설정 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };



  useEffect(() => {
    fetchSettings();

    // 전역 사이트 설정 새로고침 이벤트 리스너 추가
    const handleRefreshSettings = () => {
      fetchSettings();
    };

    window.addEventListener('refreshSiteSettings', handleRefreshSettings);

    return () => {
      window.removeEventListener('refreshSiteSettings', handleRefreshSettings);
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
