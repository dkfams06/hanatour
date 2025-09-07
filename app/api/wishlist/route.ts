import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 지역 매핑 함수
function mapRegionToEnum(region: string): string {
  const regionMap: { [key: string]: string } = {
    // 아시아
    'japan': 'asia',
    'japanese': 'asia',
    'korea': 'asia',
    'china': 'asia',
    'chinese': 'asia',
    'thailand': 'asia',
    'thai': 'asia',
    'vietnam': 'asia',
    'vietnamese': 'asia',
    'singapore': 'asia',
    'malaysia': 'asia',
    'indonesia': 'asia',
    'philippines': 'asia',
    'taiwan': 'asia',
    'hongkong': 'asia',
    'macau': 'asia',
    'cambodia': 'asia',
    'laos': 'asia',
    'myanmar': 'asia',
    'mongolia': 'asia',
    'nepal': 'asia',
    'india': 'asia',
    'sri_lanka': 'asia',
    'maldives': 'asia',
    'bhutan': 'asia',
    'bangladesh': 'asia',
    'pakistan': 'asia',
    'afghanistan': 'asia',
    'kazakhstan': 'asia',
    'uzbekistan': 'asia',
    'kyrgyzstan': 'asia',
    'tajikistan': 'asia',
    'turkmenistan': 'asia',
    'azerbaijan': 'asia',
    'georgia': 'asia',
    'armenia': 'asia',
    'iran': 'asia',
    'iraq': 'asia',
    'kuwait': 'asia',
    'saudi_arabia': 'asia',
    'qatar': 'asia',
    'bahrain': 'asia',
    'oman': 'asia',
    'yemen': 'asia',
    'uae': 'asia',
    'emirates': 'asia',
    'israel': 'asia',
    'jordan': 'asia',
    'lebanon': 'asia',
    'syria': 'asia',
    'turkey': 'asia',
    'cyprus': 'asia',
    
    // 유럽
    'france': 'europe',
    'french': 'europe',
    'germany': 'europe',
    'german': 'europe',
    'italy': 'europe',
    'italian': 'europe',
    'spain': 'europe',
    'spanish': 'europe',
    'uk': 'europe',
    'united_kingdom': 'europe',
    'england': 'europe',
    'english': 'europe',
    'switzerland': 'europe',
    'swiss': 'europe',
    'austria': 'europe',
    'austrian': 'europe',
    'netherlands': 'europe',
    'dutch': 'europe',
    'belgium': 'europe',
    'belgian': 'europe',
    'luxembourg': 'europe',
    'denmark': 'europe',
    'danish': 'europe',
    'norway': 'europe',
    'norwegian': 'europe',
    'sweden': 'europe',
    'swedish': 'europe',
    'finland': 'europe',
    'finnish': 'europe',
    'iceland': 'europe',
    'icelandic': 'europe',
    'poland': 'europe',
    'polish': 'europe',
    'czech': 'europe',
    'czech_republic': 'europe',
    'slovakia': 'europe',
    'slovak': 'europe',
    'hungary': 'europe',
    'hungarian': 'europe',
    'romania': 'europe',
    'romanian': 'europe',
    'bulgaria': 'europe',
    'bulgarian': 'europe',
    'croatia': 'europe',
    'croatian': 'europe',
    'slovenia': 'europe',
    'slovenian': 'europe',
    'serbia': 'europe',
    'serbian': 'europe',
    'bosnia': 'europe',
    'montenegro': 'europe',
    'macedonia': 'europe',
    'albania': 'europe',
    'albanian': 'europe',
    'greece': 'europe',
    'greek': 'europe',
    'portugal': 'europe',
    'portuguese': 'europe',
    'ireland': 'europe',
    'irish': 'europe',
    'scotland': 'europe',
    'scottish': 'europe',
    'wales': 'europe',
    'welsh': 'europe',
    'russia': 'europe',
    'russian': 'europe',
    'ukraine': 'europe',
    'ukrainian': 'europe',
    'belarus': 'europe',
    'belarusian': 'europe',
    'moldova': 'europe',
    'moldovan': 'europe',
    'estonia': 'europe',
    'estonian': 'europe',
    'latvia': 'europe',
    'latvian': 'europe',
    'lithuania': 'europe',
    'lithuanian': 'europe',
    
    // 아메리카
    'usa': 'americas',
    'united_states': 'americas',
    'american': 'americas',
    'canada': 'americas',
    'canadian': 'americas',
    'mexico': 'americas',
    'mexican': 'americas',
    'brazil': 'americas',
    'brazilian': 'americas',
    'argentina': 'americas',
    'argentine': 'americas',
    'chile': 'americas',
    'chilean': 'americas',
    'peru': 'americas',
    'peruvian': 'americas',
    'colombia': 'americas',
    'colombian': 'americas',
    'venezuela': 'americas',
    'venezuelan': 'americas',
    'ecuador': 'americas',
    'ecuadorian': 'americas',
    'bolivia': 'americas',
    'bolivian': 'americas',
    'paraguay': 'americas',
    'paraguayan': 'americas',
    'uruguay': 'americas',
    'uruguayan': 'americas',
    'guyana': 'americas',
    'suriname': 'americas',
    'french_guiana': 'americas',
    'cuba': 'americas',
    'cuban': 'americas',
    'jamaica': 'americas',
    'jamaican': 'americas',
    'haiti': 'americas',
    'haitian': 'americas',
    'dominican_republic': 'americas',
    'dominican': 'americas',
    'puerto_rico': 'americas',
    'trinidad_tobago': 'americas',
    'barbados': 'americas',
    'bahamas': 'americas',
    'bahamian': 'americas',
    
    // 오세아니아
    'australia': 'oceania',
    'australian': 'oceania',
    'new_zealand': 'oceania',
    'zealand': 'oceania',
    'fiji': 'oceania',
    'fijian': 'oceania',
    'papua_new_guinea': 'oceania',
    'papua': 'oceania',
    'solomon_islands': 'oceania',
    'vanuatu': 'oceania',
    'new_caledonia': 'oceania',
    'caledonia': 'oceania',
    'samoa': 'oceania',
    'samoan': 'oceania',
    'tonga': 'oceania',
    'tongan': 'oceania',
    'micronesia': 'oceania',
    'palau': 'oceania',
    'marshall_islands': 'oceania',
    'kiribati': 'oceania',
    'tuvalu': 'oceania',
    'nauru': 'oceania',
    
    // 아프리카
    'south_africa': 'africa',
    'african': 'africa',
    'egypt': 'africa',
    'egyptian': 'africa',
    'morocco': 'africa',
    'moroccan': 'africa',
    'tunisia': 'africa',
    'tunisian': 'africa',
    'algeria': 'africa',
    'algerian': 'africa',
    'libya': 'africa',
    'libyan': 'africa',
    'sudan': 'africa',
    'sudanese': 'africa',
    'ethiopia': 'africa',
    'ethiopian': 'africa',
    'kenya': 'africa',
    'kenyan': 'africa',
    'tanzania': 'africa',
    'tanzanian': 'africa',
    'uganda': 'africa',
    'ugandan': 'africa',
    'ghana': 'africa',
    'ghanaian': 'africa',
    'nigeria': 'africa',
    'nigerian': 'africa',
    'cameroon': 'africa',
    'cameroonian': 'africa',
    'senegal': 'africa',
    'senegalese': 'africa',
    'mali': 'africa',
    'malian': 'africa',
    'niger': 'africa',
    'nigerien': 'africa',
    'chad': 'africa',
    'chadian': 'africa',
    'central_african_republic': 'africa',
    'congo': 'africa',
    'congolese': 'africa',
    'gabon': 'africa',
    'gabonese': 'africa',
    'equatorial_guinea': 'africa',
    'sao_tome_principe': 'africa',
    'angola': 'africa',
    'angolan': 'africa',
    'zambia': 'africa',
    'zambian': 'africa',
    'zimbabwe': 'africa',
    'zimbabwean': 'africa',
    'botswana': 'africa',
    'botswanan': 'africa',
    'namibia': 'africa',
    'namibian': 'africa',
    'lesotho': 'africa',
    'swaziland': 'africa',
    'madagascar': 'africa',
    'malagasy': 'africa',
    'mauritius': 'africa',
    'mauritian': 'africa',
    'seychelles': 'africa',
    'seychellois': 'africa',
    'comoros': 'africa',
    'comorian': 'africa',
    'djibouti': 'africa',
    'djiboutian': 'africa',
    'somalia': 'africa',
    'somali': 'africa',
    'eritrea': 'africa',
    'eritrean': 'africa',
    'burundi': 'africa',
    'burundian': 'africa',
    'rwanda': 'africa',
    'rwandan': 'africa',
    'burkina_faso': 'africa',
    'burkinabe': 'africa',
    'ivory_coast': 'africa',
    'ivorian': 'africa',
    'guinea': 'africa',
    'guinean': 'africa',
    'guinea_bissau': 'africa',
    'bissau_guinean': 'africa',
    'sierra_leone': 'africa',
    'sierra_leonean': 'africa',
    'liberia': 'africa',
    'liberian': 'africa',
    'togo': 'africa',
    'togolese': 'africa',
    'benin': 'africa',
    'beninese': 'africa',
    'cape_verde': 'africa',
    'cape_verdean': 'africa',
    'gambia': 'africa',
    'gambian': 'africa',
    'mauritania': 'africa',
    'mauritanian': 'africa',
    
    // 국내
    'korean': 'domestic',
    'seoul': 'domestic',
    'busan': 'domestic',
    'daegu': 'domestic',
    'incheon': 'domestic',
    'gwangju': 'domestic',
    'daejeon': 'domestic',
    'ulsan': 'domestic',
    'sejong': 'domestic',
    'gyeonggi': 'domestic',
    'gangwon': 'domestic',
    'chungbuk': 'domestic',
    'chungnam': 'domestic',
    'jeonbuk': 'domestic',
    'jeonnam': 'domestic',
    'gyeongbuk': 'domestic',
    'gyeongnam': 'domestic',
    'jeju': 'domestic',
    'jeju_island': 'domestic',
  };

  const normalizedRegion = region.toLowerCase().replace(/[^a-z]/g, '_');
  return regionMap[normalizedRegion] || 'asia'; // 기본값은 asia
}

// 찜하기 목록 조회
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    const [rows] = await pool.query(`
      SELECT 
        w.id,
        w.tourId,
        w.tourTitle,
        w.mainImage,
        w.price,
        w.departureDate,
        w.region,
        w.createdAt,
        t.status as tourStatus
      FROM wishlist w
      LEFT JOIN tours t ON w.tourId = t.id
      WHERE w.userId = ?
      ORDER BY w.createdAt DESC
    `, [userId]);

    return NextResponse.json({
      success: true,
      wishlist: rows
    });

  } catch (error) {
    console.error('Wishlist 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '찜하기 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 찜하기 추가
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    const { tourId } = await request.json();
    const userId = decoded.id;

    if (!tourId) {
      return NextResponse.json(
        { success: false, error: '여행상품 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 여행상품 존재 확인
    const [tourRows] = await pool.query(
      'SELECT id, title, mainImage, price, departureDate, region FROM tours WHERE id = ? AND status = "published"',
      [tourId]
    );

    if ((tourRows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 여행상품입니다.' },
        { status: 404 }
      );
    }

    const tour = (tourRows as any[])[0];

    // 이미 찜한 상품인지 확인
    const [existingRows] = await pool.query(
      'SELECT id FROM wishlist WHERE userId = ? AND tourId = ?',
      [userId, tourId]
    );

    if ((existingRows as any[]).length > 0) {
      return NextResponse.json(
        { success: false, error: '이미 찜한 상품입니다.' },
        { status: 400 }
      );
    }

    // 찜하기 추가
    const wishlistId = `wish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 지역 매핑 적용
    const mappedRegion = mapRegionToEnum(tour.region);
    
    await pool.query(`
      INSERT INTO wishlist (id, userId, tourId, tourTitle, mainImage, price, departureDate, region)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [wishlistId, userId, tourId, tour.title, tour.mainImage, tour.price, tour.departureDate, mappedRegion]);

    return NextResponse.json({
      success: true,
      message: '찜하기가 추가되었습니다.',
      wishlistId
    });

  } catch (error) {
    console.error('Wishlist 추가 오류:', error);
    return NextResponse.json(
      { success: false, error: '찜하기 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 찜하기 삭제
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');
    const userId = decoded.id;

    if (!tourId) {
      return NextResponse.json(
        { success: false, error: '여행상품 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 찜하기 삭제
    const [result] = await pool.query(
      'DELETE FROM wishlist WHERE userId = ? AND tourId = ?',
      [userId, tourId]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: '찜한 상품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '찜하기가 삭제되었습니다.'
    });

  } catch (error) {
    console.error('Wishlist 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '찜하기 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
