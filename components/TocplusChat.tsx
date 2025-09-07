'use client';

import { useState, useEffect } from 'react';

export default function TocplusChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 모바일 체크
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 이미 로드된 경우 중복 로드 방지
    if ((window as any).tocplusLoaded) {
      return () => window.removeEventListener('resize', checkMobile);
    }

    try {
      // 모바일과 데스크톱에 따른 다른 설정
      const chatWidth = window.innerWidth <= 768 ? 200 : 250;
      const chatHeight = window.innerWidth <= 768 ? 250 : 300;
      
      // Tocplus 상담창 설정
      (window as any).tocplusTop = 20;
      (window as any).tocplusLeft = 20;
      (window as any).tocplusMinimizedImage = 'http://kr07.tocplus007.com/img/minimized_ko.gif';
      (window as any).tocplusHAlign = 'right';
      (window as any).tocplusWidth = chatWidth;
      (window as any).tocplusHeight = chatHeight;
      (window as any).tocplusUserName = '손님';
      (window as any).tocplusFrameColor = '#458fff';
      (window as any).tocplusFloatingWindow = true;

      // Tocplus 스크립트 로드
      const tocplusHost = (window.location.protocol === "https:") ? "https://" : "http://";
      const script = document.createElement('script');
      script.src = `${tocplusHost}kr07.tocplus007.com/chatLoader.do?userId=angeltour`;
      script.type = 'text/javascript';
      script.async = true;
      
      script.onload = () => {
        console.log('Tocplus 상담창이 성공적으로 로드되었습니다.');
        setIsLoaded(true);
        
        // 상담창이 로드된 후 스타일 적용
        setTimeout(() => {
          const tocplusElements = document.querySelectorAll('iframe[src*="tocplus007"], div[id*="tocplus"], div[class*="tocplus"]');
          tocplusElements.forEach((element) => {
            const el = element as HTMLElement;
            const isMobile = window.innerWidth <= 768;
            const chatWidth = isMobile ? '200px' : '250px';
            const chatHeight = isMobile ? '250px' : '300px';
            
            el.style.zIndex = '1000';
            el.style.position = 'fixed';
            el.style.bottom = isMobile ? '60px' : '20px'; // 모바일에서는 버튼 위로 위치
            el.style.right = isMobile ? '10px' : '20px';
            el.style.borderRadius = '8px';
            el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
            el.style.border = '1px solid #e0e0e0';
            el.style.maxWidth = chatWidth;
            el.style.maxHeight = chatHeight;
            el.style.width = chatWidth;
            el.style.height = chatHeight;
            
            // 초기에는 숨김
            el.style.display = 'none';
          });
          console.log('상담창 스타일이 적용되었습니다.');
        }, 2000);
      };
      
      script.onerror = () => {
        console.error('Tocplus 상담창 로드에 실패했습니다.');
      };
      
      document.head.appendChild(script);
      
      (window as any).tocplusLoaded = true;

      // 컴포넌트 언마운트 시 정리
      return () => {
        window.removeEventListener('resize', checkMobile);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        (window as any).tocplusLoaded = false;
      };
    } catch (error) {
      console.error('Tocplus 상담창 초기화 중 오류가 발생했습니다:', error);
    }
  }, []);

  const toggleChat = () => {
    const tocplusElements = document.querySelectorAll('iframe[src*="tocplus007"], div[id*="tocplus"], div[class*="tocplus"]');
    
    if (isChatOpen) {
      // 상담창 닫기
      tocplusElements.forEach((element) => {
        (element as HTMLElement).style.display = 'none';
      });
      setIsChatOpen(false);
      console.log('상담창이 닫혔습니다.');
    } else {
      // 상담창 열기
      tocplusElements.forEach((element) => {
        const el = element as HTMLElement;
        el.style.display = 'block';
        
        // 모바일에서는 크기와 위치 재조정
        if (isMobile) {
          el.style.width = '200px';
          el.style.height = '250px';
          el.style.maxWidth = '200px';
          el.style.maxHeight = '250px';
          el.style.bottom = '60px';
          el.style.right = '10px';
        }
      });
      setIsChatOpen(true);
      console.log('상담창이 열렸습니다.');
    }
  };

  // 플로팅 버튼 렌더링
  return (
    <>
      {isLoaded && (
        <button
          onClick={toggleChat}
          style={{
            position: 'fixed',
            bottom: isMobile ? '10px' : '20px',
            right: isMobile ? '10px' : '20px',
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            background: '#458fff',
            borderRadius: '50%',
            boxShadow: '0 4px 16px rgba(69, 143, 255, 0.3)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            color: 'white',
            fontSize: isMobile ? '20px' : '24px',
          }}
        >
          💬
        </button>
      )}
    </>
  );
}
