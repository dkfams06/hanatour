const mysql = require('mysql2/promise');

// 데이터베이스 연결 설정
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hanatour'
};

async function setupFooterSettings() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('데이터베이스 연결 성공');

    // 1. footer_settings 테이블 생성
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS footer_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_type ENUM('text', 'textarea', 'link', 'email', 'phone') DEFAULT 'text',
        display_name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createTableQuery);
    console.log('footer_settings 테이블 생성 완료');

    // 2. 기본 설정 데이터 삽입
    const defaultSettings = [
      // 회사 정보
      { key: 'company_name', value: '(주)하나투어', type: 'text', name: '회사명', desc: '회사 이름을 입력하세요', order: 1 },
      { key: 'ceo_name', value: '김대표', type: 'text', name: '대표이사', desc: '대표이사 이름을 입력하세요', order: 2 },
      { key: 'company_address', value: '서울특별시 강남구 테헤란로 123', type: 'text', name: '회사 주소', desc: '회사 주소를 입력하세요', order: 3 },
      { key: 'business_number', value: '123-45-67890', type: 'text', name: '사업자등록번호', desc: '사업자등록번호를 입력하세요', order: 4 },
      { key: 'travel_agency_number', value: '제2023-서울강남-0123호', type: 'text', name: '통신판매업신고번호', desc: '통신판매업신고번호를 입력하세요', order: 5 },
      { key: 'privacy_officer', value: '김개인정보', type: 'text', name: '개인정보관리책임자', desc: '개인정보관리책임자를 입력하세요', order: 6 },
      { key: 'contact_email', value: 'info@hanatour.com', type: 'email', name: '대표 이메일', desc: '대표 이메일을 입력하세요', order: 7 },
      { key: 'contact_phone', value: '02-1234-5678', type: 'phone', name: '대표 전화번호', desc: '대표 전화번호를 입력하세요', order: 8 },
      
      // 링크
      { key: 'link_terms', value: '/terms', type: 'link', name: '이용약관', desc: '이용약관 페이지 URL', order: 10 },
      { key: 'link_privacy', value: '/privacy', type: 'link', name: '개인정보처리방침', desc: '개인정보처리방침 페이지 URL', order: 11 },
      { key: 'link_travel_terms', value: '/overseas-travel-terms', type: 'link', name: '해외여행약관', desc: '해외여행약관 페이지 URL', order: 12 },
      { key: 'link_company', value: '/company', type: 'link', name: '회사소개', desc: '회사소개 페이지 URL', order: 13 },
      
      // 면책조항
      { key: 'disclaimer_1', value: '하나투어는 개별 항공권, 호텔, 현지투어 상품에 대하여 통신판매중개자의 지위를 가지며, 해당상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있습니다.', type: 'textarea', name: '면책조항 1', desc: '첫 번째 면책조항', order: 20 },
      { key: 'disclaimer_2', value: '하나투어는 상품정보, 상품가격, 예약가능 여부 등에 대하여 실시간으로 업데이트하고 있으나, 경우에 따라 실제 정보와 차이가 발생할 수 있습니다.', type: 'textarea', name: '면책조항 2', desc: '두 번째 면책조항', order: 21 },
      
      // 저작권
      { key: 'copyright_text', value: 'Copyright © 2024 하나투어. All rights reserved.', type: 'text', name: '저작권 텍스트', desc: '저작권 정보를 입력하세요', order: 30 },
      
      // 소셜 미디어
      { key: 'social_facebook', value: 'https://www.facebook.com/hanatour', type: 'link', name: '페이스북', desc: '페이스북 페이지 URL', order: 40 },
      { key: 'social_instagram', value: 'https://www.instagram.com/hanatour', type: 'link', name: '인스타그램', desc: '인스타그램 페이지 URL', order: 41 },
      { key: 'social_youtube', value: 'https://www.youtube.com/hanatour', type: 'link', name: '유튜브', desc: '유튜브 채널 URL', order: 42 },
    ];

    // 기존 데이터 확인
    const [existingRows] = await connection.execute('SELECT COUNT(*) as count FROM footer_settings');
    const existingCount = existingRows[0].count;

    if (existingCount === 0) {
      // 데이터가 없으면 삽입
      for (const setting of defaultSettings) {
        await connection.execute(
          'INSERT INTO footer_settings (setting_key, setting_value, setting_type, display_name, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
          [setting.key, setting.value, setting.type, setting.name, setting.desc, setting.order]
        );
      }
      console.log(`${defaultSettings.length}개의 기본 설정이 추가되었습니다.`);
    } else {
      console.log(`이미 ${existingCount}개의 설정이 존재합니다.`);
    }

    // 3. 데이터 확인
    const [allSettings] = await connection.execute('SELECT * FROM footer_settings ORDER BY sort_order');
    console.log('\n현재 푸터 설정:');
    allSettings.forEach(setting => {
      console.log(`- ${setting.display_name}: ${setting.setting_value}`);
    });

  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n데이터베이스 연결 종료');
    }
  }
}

// 스크립트 실행
setupFooterSettings();
