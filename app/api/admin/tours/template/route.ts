import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    // 템플릿 데이터 구성 - 계층적 구조로 변경
    const templateData = [
      {
        '제목': '예시: 일본 도쿄 3박4일 자유여행',
        '설명': '도쿄의 핫플레이스를 자유롭게 탐방하는 여행입니다. 신주쿠, 시부야, 하라주쿠 등 주요 관광지를 방문하며 일본의 전통과 현대를 모두 경험할 수 있습니다.',
        '대표이미지': 'https://example.com/tokyo-main.jpg',
        '추가이미지': 'https://example.com/tokyo-1.jpg|https://example.com/tokyo-2.jpg',
        '출발일': '2024-03-15',
        '최대인원': 20,
        '가격': 890000,
        '포함사항': '왕복항공료|숙박(3박)|조식|가이드서비스',
        '불포함사항': '개인경비|선택관광|여행자보험',
        '대륙': 'asia',
        '국가': 'japan',
        '지역': 'tokyo',
        '상태': 'unpublished'
      },
      {
        '제목': '일본 오사카 3박4일 벚꽃여행',
        '설명': '오사카성과 교토의 아름다운 벚꽃을 만끽하는 봄 시즌 특별 여행. 일본의 전통 정원과 사찰을 방문하며 벚꽃의 아름다움을 느낄 수 있습니다.',
        '대표이미지': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
        '추가이미지': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9|https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
        '출발일': '2024-04-15',
        '최대인원': 20,
        '가격': 890000,
        '포함사항': '왕복항공료|3박 호텔|조식 3회|전용차량|가이드',
        '불포함사항': '중식/석식|개인경비|여행자보험',
        '대륙': 'asia',
        '국가': 'japan',
        '지역': 'osaka',
        '상태': 'published'
      },
      {
        '제목': '파리 & 런던 7일 자유여행',
        '설명': '유럽의 낭만 도시 파리와 런던을 자유롭게 탐방하는 일정. 에펠탑, 루브르 박물관, 빅벤, 타워브릿지 등 유명 관광지를 둘러봅니다.',
        '대표이미지': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
        '추가이미지': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad|https://images.unsplash.com/photo-1486299267070-83823f5448dd',
        '출발일': '2024-05-20',
        '최대인원': 15,
        '가격': 2290000,
        '포함사항': '왕복항공료|6박 호텔|유로스타 티켓|공항 픽업',
        '불포함사항': '식사|입장료|개인경비',
        '대륙': 'europe',
        '국가': 'france',
        '지역': 'paris',
        '상태': 'published'
      },
      {
        '제목': '제주도 2박3일 힐링여행',
        '설명': '제주의 아름다운 자연과 맛집을 즐기는 국내 힐링 여행. 성산일출봉, 천지연폭포, 우도 등 제주의 대표 관광지를 방문합니다.',
        '대표이미지': 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0',
        '추가이미지': 'https://images.unsplash.com/photo-1615400014497-55bbc6b635c1|https://images.unsplash.com/photo-1551632811-561732d1e306',
        '출발일': '2024-03-25',
        '최대인원': 30,
        '가격': 299000,
        '포함사항': '왕복항공료|2박 호텔|렌터카|조식 2회',
        '불포함사항': '중식/석식|입장료|개인경비',
        '대륙': 'domestic',
        '국가': 'korea',
        '지역': 'jeju',
        '상태': 'published'
      },
      {
        '제목': '베트남 다낭 4박5일 리조트',
        '설명': '다낭의 아름다운 해변과 리조트에서 즐기는 휴양 여행. 바나힐, 호이안 고도시, 미케비치 등을 방문하며 베트남의 매력을 만끽합니다.',
        '대표이미지': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
        '추가이미지': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b|https://images.unsplash.com/photo-1528127269322-539801943592',
        '출발일': '2024-04-10',
        '최대인원': 25,
        '가격': 690000,
        '포함사항': '왕복항공료|4박 리조트|조식|공항 픽업',
        '불포함사항': '중식/석식|액티비티|팁',
        '대륙': 'asia',
        '국가': 'vietnam',
        '지역': 'danang',
        '상태': 'published'
      },
      {
        '제목': '태국 방콕 & 파타야 5박6일',
        '설명': '태국의 수도 방콕과 해변 도시 파타야를 모두 경험하는 여행. 왓 포 사원, 수상시장, 파타야 비치 등을 방문합니다.',
        '대표이미지': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        '추가이미지': 'https://images.unsplash.com/photo-1528181304800-259b08848526|https://images.unsplash.com/photo-1552465011-b4e21bf6e79a',
        '출발일': '2024-04-25',
        '최대인원': 22,
        '가격': 750000,
        '포함사항': '왕복항공료|5박 호텔|조식|시티투어|쇼 관람',
        '불포함사항': '중식/석식|마사지|개인경비',
        '대륙': 'asia',
        '국가': 'thailand',
        '지역': 'bangkok',
        '상태': 'published'
      },
      {
        '제목': '중국 베이징 4박5일 역사탐방',
        '설명': '중국의 수도 베이징에서 만나는 유구한 역사. 만리장성, 천안문 광장, 자금성, 이화원 등 중국의 대표 유적지를 방문합니다.',
        '대표이미지': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d',
        '추가이미지': 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2|https://images.unsplash.com/photo-1545558014-8692077e9b5c',
        '출발일': '2024-05-10',
        '최대인원': 18,
        '가격': 890000,
        '포함사항': '왕복항공료|4박 호텔|전 식사|전용차량|한국어 가이드',
        '불포함사항': '개인경비|선택관광|팁',
        '대륙': 'asia',
        '국가': 'china',
        '지역': 'beijing',
        '상태': 'published'
      },
      {
        '제목': '뉴욕 5박6일 도시탐방',
        '설명': '미국 동부의 중심 뉴욕을 완벽하게 경험하는 여행. 자유의 여신상, 엠파이어 스테이트 빌딩, 센트럴파크, 타임스퀘어 등을 방문합니다.',
        '대표이미지': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
        '추가이미지': 'https://images.unsplash.com/photo-1534430480872-3498386e7856|https://images.unsplash.com/photo-1522083165195-3424ed129620',
        '출발일': '2024-06-15',
        '최대인원': 18,
        '가격': 1890000,
        '포함사항': '왕복항공료|5박 호텔|시티투어버스|뮤지컬 티켓',
        '불포함사항': '식사|쇼핑|개인경비',
        '대륙': 'americas',
        '국가': 'usa',
        '지역': 'new-york',
        '상태': 'unpublished'
      },
      {
        '제목': '스페인 바르셀로나 & 마드리드 6일',
        '설명': '스페인의 대표 도시들을 탐방하는 여행. 가우디의 건축물, 프라도 미술관, 플라멩코 쇼 등 스페인 문화를 체험합니다.',
        '대표이미지': 'https://images.unsplash.com/photo-1509845350455-fb0c36048db1',
        '추가이미지': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b|https://images.unsplash.com/photo-1555881400-69c7c3d8e4a5',
        '출발일': '2024-05-15',
        '최대인원': 20,
        '가격': 2290000,
        '포함사항': '왕복항공료|5박 호텔|전용버스|한국어 가이드|입장료',
        '불포함사항': '식사|개인경비|선택관광',
        '대륙': 'europe',
        '국가': 'spain',
        '지역': 'barcelona',
        '상태': 'published'
      },
      {
        '제목': '호주 시드니 & 멜버른 6박7일',
        '설명': '호주의 대표 도시 시드니와 멜버른을 모두 경험하는 여행. 오페라하우스, 하버브릿지, 그레이트 오션로드 등을 방문합니다.',
        '대표이미지': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
        '추가이미지': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9|https://images.unsplash.com/photo-1514395462725-fb4566210144',
        '출발일': '2024-06-01',
        '최대인원': 20,
        '가격': 2390000,
        '포함사항': '왕복항공료|6박 호텔|국내선|시티투어|블루마운틴투어',
        '불포함사항': '식사|선택관광|개인경비',
        '대륙': 'oceania',
        '국가': 'australia',
        '지역': 'sydney',
        '상태': 'published'
      }
    ];

    // 워크북 생성
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // 컬럼 너비 설정
    const columnWidths = [
      { wch: 30 }, // 제목
      { wch: 50 }, // 설명
      { wch: 30 }, // 대표이미지
      { wch: 40 }, // 추가이미지
      { wch: 12 }, // 출발일
      { wch: 10 }, // 최대인원
      { wch: 12 }, // 가격
      { wch: 40 }, // 포함사항
      { wch: 40 }, // 불포함사항
      { wch: 12 }, // 대륙
      { wch: 12 }, // 국가
      { wch: 12 }, // 지역
      { wch: 15 }  // 상태
    ];
    worksheet['!cols'] = columnWidths;

    // 워크시트를 워크북에 추가
    XLSX.utils.book_append_sheet(workbook, worksheet, '투어상품');

    // 설명 시트 추가 - 계층적 구조 설명 포함
    const instructionData = [
      { '항목': '제목', '설명': '여행상품명 (필수)', '예시': '일본 도쿄 3박4일 자유여행' },
      { '항목': '설명', '설명': '상품 상세 설명 (필수)', '예시': '도쿄의 핫플레이스를 자유롭게...' },
      { '항목': '대표이미지', '설명': '대표 이미지 URL (필수)', '예시': 'https://example.com/image.jpg' },
      { '항목': '추가이미지', '설명': '추가 이미지 URL들 (| 구분)', '예시': 'url1|url2|url3' },
      { '항목': '출발일', '설명': '출발일 (YYYY-MM-DD 형식, 필수)', '예시': '2024-03-15' },
      { '항목': '최대인원', '설명': '최대 참가 인원 (숫자, 필수)', '예시': '20' },
      { '항목': '가격', '설명': '가격 (원, 필수)', '예시': '890000' },
      { '항목': '포함사항', '설명': '포함사항들 (| 구분)', '예시': '항공료|숙박|조식' },
      { '항목': '불포함사항', '설명': '불포함사항들 (| 구분)', '예시': '개인경비|여행자보험' },
      { '항목': '대륙', '설명': '대륙 (필수)', '예시': 'asia, europe, americas, oceania, africa, domestic' },
      { '항목': '국가', '설명': '국가 (필수)', '예시': 'japan, china, usa, france, australia, korea 등' },
      { '항목': '지역', '설명': '도시/지역 (선택)', '예시': 'tokyo, osaka, paris, london, sydney 등' },
      { '항목': '상태', '설명': '게시 상태', '예시': 'published, unpublished, draft (기본값: unpublished)' }
    ];

    const instructionSheet = XLSX.utils.json_to_sheet(instructionData);
    instructionSheet['!cols'] = [
      { wch: 15 }, // 항목
      { wch: 40 }, // 설명
      { wch: 50 }  // 예시
    ];
    XLSX.utils.book_append_sheet(workbook, instructionSheet, '작성가이드');

    // 지역 참고 데이터 시트 추가
    const regionData = [
      { '대륙': 'asia', '국가': 'japan', '도시/지역': 'tokyo, osaka, kyoto, fukuoka' },
      { '대륙': 'asia', '국가': 'china', '도시/지역': 'beijing, shanghai, guangzhou, xian' },
      { '대륙': 'asia', '국가': 'thailand', '도시/지역': 'bangkok, phuket, pattaya, chiang-mai' },
      { '대륙': 'asia', '국가': 'vietnam', '도시/지역': 'hanoi, ho-chi-minh, danang, nha-trang' },
      { '대륙': 'asia', '국가': 'singapore', '도시/지역': 'singapore' },
      { '대륙': 'europe', '국가': 'france', '도시/지역': 'paris, nice, lyon, marseille' },
      { '대륙': 'europe', '국가': 'italy', '도시/지역': 'rome, milan, florence, venice' },
      { '대륙': 'europe', '국가': 'spain', '도시/지역': 'madrid, barcelona, seville, valencia' },
      { '대륙': 'europe', '국가': 'germany', '도시/지역': 'berlin, munich, frankfurt, hamburg' },
      { '대륙': 'americas', '국가': 'usa', '도시/지역': 'new-york, los-angeles, chicago, miami' },
      { '대륙': 'americas', '국가': 'canada', '도시/지역': 'toronto, vancouver, montreal, ottawa' },
      { '대륙': 'oceania', '국가': 'australia', '도시/지역': 'sydney, melbourne, brisbane, perth' },
      { '대륙': 'domestic', '국가': 'korea', '도시/지역': 'seoul, busan, jeju, gangwon' }
    ];

    const regionSheet = XLSX.utils.json_to_sheet(regionData);
    regionSheet['!cols'] = [
      { wch: 15 }, // 대륙
      { wch: 15 }, // 국가
      { wch: 60 }  // 도시/지역
    ];
    XLSX.utils.book_append_sheet(workbook, regionSheet, '지역참고');

    // 파일을 buffer로 변환
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Response 헤더 설정
    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    headers.set('Content-Disposition', 'attachment; filename="tour_template.xlsx"');

    return new Response(buffer, { headers });

  } catch (error) {
    console.error('Template generation error:', error);
    return NextResponse.json(
      { success: false, error: '템플릿 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 