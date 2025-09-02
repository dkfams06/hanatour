-- 회사 정보 테이블 생성
CREATE TABLE IF NOT EXISTS company_info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- 기본 정보
  company_name VARCHAR(100) NOT NULL,
  ceo_name VARCHAR(50),
  established_date VARCHAR(50),
  business_number VARCHAR(50),
  online_business_number VARCHAR(50),
  
  -- 연락처 정보
  address VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(100),
  privacy_officer VARCHAR(50),
  
  -- 회사 소개 텍스트
  introduction TEXT,
  vision_title VARCHAR(255),
  vision_content TEXT,
  mission_title VARCHAR(255),
  mission_content TEXT,
  
  -- 핵심 가치 (JSON 형태로 저장)
  core_values JSON,
  
  -- 사업 영역 (JSON 형태로 저장)
  business_areas JSON,
  
  -- 연혁 (JSON 형태로 저장)
  company_history JSON,
  
  -- 면책조항 (JSON 형태로 저장)
  disclaimers JSON,
  
  -- 메타 정보
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 초기 데이터 삽입
INSERT INTO company_info (
  company_name,
  ceo_name,
  established_date,
  business_number,
  online_business_number,
  address,
  phone,
  email,
  privacy_officer,
  introduction,
  vision_title,
  vision_content,
  mission_title,
  mission_content,
  core_values,
  business_areas,
  company_history,
  disclaimers
) VALUES (
  '(주)하나투어',
  '홍승준',
  '2020년 3월',
  '892-86-02037',
  '2020-서울구로-1996',
  '서울특별시 양천구 목동',
  '010-7543-4259',
  'dkfams06@naver.com',
  '홍승준',
  '(주)하나투어는 2020년 3월 설립된 이래, 고객 중심의 여행 서비스를 제공하는 전문 여행사입니다. 우리는 단순한 여행 상품 판매를 넘어, 고객의 꿈과 추억을 현실로 만들어주는 신뢰할 수 있는 파트너가 되고자 합니다.\n\n공정거래위원회의 엄격한 심사를 통과하여 등록된 여행사로서, 투명하고 정직한 비즈니스를 통해 고객의 신뢰를 얻고 있습니다. 모든 여행 상품은 철저한 품질 관리와 안전 기준을 거쳐 제공되며, 고객의 만족도를 최우선으로 생각합니다.\n\n최신 기술을 활용한 온라인 예약 시스템과 전문 여행 상담사들의 맞춤형 서비스를 통해, 고객에게 편리하고 안전한 여행 경험을 제공합니다. 우리는 지속적인 혁신과 개선을 통해 여행업계의 새로운 표준을 제시하고 있습니다.',
  '세계를 연결하는 여행의 새로운 기준',
  '최고의 서비스와 혁신적인 기술로 고객에게 잊을 수 없는 여행 경험을 제공하여, 여행업계의 새로운 표준을 제시합니다.',
  '고객 중심의 여행 솔루션',
  '고객의 니즈를 최우선으로 생각하며, 안전하고 편리한 여행을 통해 고객의 꿈과 추억을 현실로 만들어드립니다.',
  JSON_ARRAY(
    JSON_OBJECT(
      'icon', 'Shield',
      'title', '신뢰성',
      'description', '투명하고 정직한 비즈니스로 고객의 신뢰를 얻습니다.'
    ),
    JSON_OBJECT(
      'icon', 'Award',
      'title', '품질',
      'description', '최고의 서비스 품질로 고객 만족을 실현합니다.'
    ),
    JSON_OBJECT(
      'icon', 'Globe',
      'title', '혁신',
      'description', '지속적인 혁신으로 여행의 새로운 경험을 제공합니다.'
    )
  ),
  JSON_ARRAY(
    JSON_OBJECT(
      'title', '패키지 여행',
      'description', '다양한 테마의 패키지 여행 상품 제공'
    ),
    JSON_OBJECT(
      'title', '자유여행',
      'description', '맞춤형 자유여행 플랜 설계 및 지원'
    ),
    JSON_OBJECT(
      'title', '단체 여행',
      'description', '기업 연수, 워크샵 등 단체 여행 전문'
    ),
    JSON_OBJECT(
      'title', '여행 상담',
      'description', '전문 여행 상담사가 제공하는 맞춤 상담'
    )
  ),
  JSON_ARRAY(
    JSON_OBJECT(
      'year', '2024',
      'title', '서비스 확장',
      'description', '온라인 예약 시스템 구축 및 모바일 앱 런칭'
    ),
    JSON_OBJECT(
      'year', '2023',
      'title', '성장기',
      'description', '연간 고객 수 10,000명 달성, 해외 지사 설립'
    ),
    JSON_OBJECT(
      'year', '2022',
      'title', '안정화',
      'description', '여행업 등록 및 통신판매업 신고 완료'
    ),
    JSON_OBJECT(
      'year', '2020',
      'title', '창립',
      'description', '(주)하나투어 설립, 서울 양천구 목동에 본사 설립'
    )
  ),
  JSON_ARRAY(
    JSON_OBJECT(
      'title', '여행 일정 변경 관련',
      'content', '부득이한 사정에 의해 확정된 여행일정이 변경되는 경우 여행자의 사전 동의를 받습니다.'
    ),
    JSON_OBJECT(
      'title', '통신판매중개 서비스',
      'content', '(주)하나투어는 항공사가 제공하는 개별 항공권 및 여행사가 제공하는 일부 여행상품에 대하여 통신판매중개자의 지위를 가지며, 해당 상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있습니다.'
    )
  )
);
