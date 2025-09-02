// ====================================================================
// 설정 및 상수 정보 (UI 표시용)
// 실제 데이터는 데이터베이스에서 가져옴
// ====================================================================

// 지역 정보 (UI 표시용)
export const regionInfo = {
  // 국내
  seoul: { name: '서울/수도권', color: '#3B82F6' },
  gangwon: { name: '강원도', color: '#10B981' },
  chungcheong: { name: '충청도', color: '#F59E0B' },
  jeolla: { name: '전라도', color: '#EF4444' },
  gyeongsang: { name: '경상도', color: '#8B5CF6' },
  jeju: { name: '제주도', color: '#06B6D4' },
  
  // 해외 - 아메리카
  'usa-east': { name: '미국 동부', color: '#DC2626' },
  'usa-west': { name: '미국 서부', color: '#2563EB' },
  hawaii: { name: '하와이', color: '#059669' },
  alaska: { name: '알래스카', color: '#7C3AED' },
  canada: { name: '캐나다', color: '#DB2777' },
  mexico: { name: '멕시코', color: '#EA580C' },
  cuba: { name: '쿠바', color: '#0891B2' },
  brazil: { name: '브라질', color: '#65A30D' },
  
  // 해외 - 유럽
  'europe-west': { name: '서유럽', color: '#7C2D12' },
  'europe-east': { name: '동유럽', color: '#92400E' },
  'europe-north': { name: '북유럽', color: '#1E40AF' },
  'europe-south': { name: '남유럽', color: '#BE185D' },
  
  // 해외 - 기타
  africa: { name: '아프리카', color: '#A16207' },
  japan: { name: '일본', color: '#DC2626' },
  china: { name: '중국', color: '#EF4444' },
  taiwan: { name: '대만', color: '#F97316' },
  'hongkong-macau': { name: '홍콩/마카오', color: '#8B5CF6' },
  thailand: { name: '태국', color: '#059669' },
  vietnam: { name: '베트남', color: '#0891B2' },
  singapore: { name: '싱가포르', color: '#7C3AED' },
  
  // 숙박
  hotels: { name: '호텔', color: '#6366F1' },
  resorts: { name: '리조트', color: '#10B981' },
  'pool-villas': { name: '풀빌라', color: '#06B6D4' },
  
  // 특가
  'early-bird': { name: '얼리버드', color: '#F59E0B' },
  'last-minute': { name: '막차', color: '#EF4444' },
  exclusive: { name: '단독특가', color: '#EC4899' },
  
  // 기타
  overseas: { name: '해외', color: '#EC4899' },
};

// 예약 상태 정보
export const bookingStatusInfo = {
  pending: { name: '대기', color: '#F59E0B' },
  payment_pending: { name: '결제대기', color: '#F59E0B' },
  payment_completed: { name: '결제완료', color: '#10B981' },
  payment_expired: { name: '입금만료', color: '#EF4444' },
  confirmed: { name: '확정', color: '#10B981' },
  cancel_requested: { name: '취소요청', color: '#EF4444' },
  cancelled: { name: '취소완료', color: '#6B7280' },
  refund_completed: { name: '환불완료', color: '#8B5CF6' }
};

// 투어 상태 정보
export const tourStatusInfo = {
  published: { name: '게시', color: '#10B981' },
  unpublished: { name: '비게시', color: '#6B7280' },
  closed: { name: '마감', color: '#EF4444' }
};

// 후기 상태 정보
export const reviewStatusInfo = {
  pending: { name: '대기', color: '#F59E0B' },
  approved: { name: '승인', color: '#10B981' },
  rejected: { name: '거부', color: '#EF4444' }
};

// 사용자 역할 정보
export const userRoleInfo = {
  user: { name: '일반사용자', color: '#6B7280' },
  customer: { name: '고객', color: '#3B82F6' },
  staff: { name: '직원', color: '#8B5CF6' },
  admin: { name: '관리자', color: '#EF4444' }
};

// 결제 방식 정보
export const paymentMethodInfo = {
  bank_transfer: { name: '계좌이체', color: '#10B981' },
  card: { name: '카드결제', color: '#3B82F6' },
  cash: { name: '현금결제', color: '#F59E0B' }
};

// 기본 설정값들
export const DEFAULT_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },
  UPLOAD: {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_IMAGES_PER_TOUR: 5
  },
  BOOKING: {
    DEFAULT_PAYMENT_DUE_HOURS: 24,
    MIN_BOOKING_ADVANCE_DAYS: 1,
    MAX_PARTICIPANTS_PER_BOOKING: 20
  },
  CART: {
    MAX_ITEMS: 10,
    LOCAL_STORAGE_KEY: 'hanatour_cart'
  },
  WISHLIST: {
    MAX_ITEMS: 30,
    LOCAL_STORAGE_KEY: 'hanatour_wishlist'
  }
};

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  COMMON: {
    NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
    UNAUTHORIZED: '권한이 없습니다.',
    FORBIDDEN: '접근이 거부되었습니다.'
  },
  VALIDATION: {
    REQUIRED_FIELD: '필수 입력 항목입니다.',
    INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
    INVALID_PHONE: '올바른 전화번호 형식이 아닙니다.',
    MIN_PARTICIPANTS: '최소 1명 이상 선택해주세요.',
    MAX_PARTICIPANTS: '최대 인원을 초과했습니다.'
  },
  BOOKING: {
    TOUR_NOT_FOUND: '존재하지 않는 여행상품입니다.',
    SOLD_OUT: '예약 가능 인원을 초과했습니다.',
    PAST_DEPARTURE: '이미 지난 여행상품은 예약할 수 없습니다.',
    BOOKING_NOT_FOUND: '예약 정보를 찾을 수 없습니다.'
  },
  CART: {
    ITEM_EXISTS: '이미 장바구니에 있는 상품입니다.',
    CART_FULL: '장바구니가 가득찼습니다.',
    EMPTY_CART: '장바구니가 비어있습니다.'
  }
};

// 성공 메시지 상수
export const SUCCESS_MESSAGES = {
  BOOKING: {
    CREATED: '예약이 성공적으로 완료되었습니다.',
    UPDATED: '예약 정보가 수정되었습니다.',
    CANCELLED: '예약이 취소되었습니다.',
    PAYMENT_CONFIRMED: '결제가 확인되었습니다.'
  },
  CART: {
    ITEM_ADDED: '장바구니에 추가되었습니다.',
    ITEM_REMOVED: '장바구니에서 제거되었습니다.',
    CLEARED: '장바구니가 비워졌습니다.'
  },
  ADMIN: {
    STATUS_UPDATED: '상태가 변경되었습니다.',
    ITEM_CREATED: '성공적으로 생성되었습니다.',
    ITEM_UPDATED: '성공적으로 수정되었습니다.',
    ITEM_DELETED: '성공적으로 삭제되었습니다.'
  }
};