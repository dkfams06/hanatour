// 여행 상품 관련 타입
export interface Tour {
  id: string;
  title: string; // 상품명 (필수)
  description: string; // 상세 설명 (에디터 사용)
  images: string[]; // 이미지 업로드 (최대 5장)
  mainImage: string; // 대표 이미지
  departureDate: string; // 출발일
  maxParticipants: number; // 최대 인원 수
  currentParticipants: number; // 현재 예약 인원
  price: number; // 가격
  included: string[]; // 포함사항
  excluded: string[]; // 불포함사항
  region: Region; // 지역 카테고리
  status: TourStatus; // 게시 상태
  rating: number; // 평균 별점
  reviewCount: number; // 후기 수
  createdAt: string;
  updatedAt: string;
  continent?: string; // 추가
  country?: string;   // 추가
}

// 지역 카테고리
export type Region = 
  | 'seoul' // 서울/수도권
  | 'gangwon' // 강원도
  | 'chungcheong' // 충청도
  | 'jeolla' // 전라도
  | 'gyeongsang' // 경상도
  | 'jeju' // 제주도
  | 'overseas' // 해외
  | 'usa-east' // 미국 동부
  | 'usa-west' // 미국 서부
  | 'hawaii' // 하와이
  | 'alaska' // 알래스카
  | 'canada' // 캐나다
  | 'mexico' // 멕시코
  | 'cuba' // 쿠바
  | 'brazil' // 브라질
  | 'europe-west' // 서유럽
  | 'europe-east' // 동유럽
  | 'europe-north' // 북유럽
  | 'europe-south' // 남유럽
  | 'africa' // 아프리카
  | 'japan' // 일본
  | 'china' // 중국
  | 'taiwan' // 대만
  | 'hongkong-macau' // 홍콩/마카오
  | 'thailand' // 태국
  | 'vietnam' // 베트남
  | 'singapore' // 싱가포르
  | 'hotels' // 호텔
  | 'resorts' // 리조트
  | 'pool-villas' // 풀빌라
  | 'early-bird' // 얼리버드
  | 'last-minute' // 막차
  | 'exclusive'; // 단독특가

// 상품 게시 상태
export type TourStatus = 'published' | 'unpublished' | 'closed';

// 예약 관련 타입
export interface Booking {
  id: string; // 예약번호
  tourId: string;
  tourTitle: string;
  customerName: string; // 이름 (필수)
  phone: string; // 연락처 (필수)
  email: string; // 이메일 (필수)
  participants: number; // 인원 수 (필수)
  specialRequests?: string; // 요청사항 (선택)
  status: BookingStatus; // 예약 상태
  departureDate: string;
  totalAmount: number;
  paymentDueDate?: string; // 입금기한
  createdAt: string;
  updatedAt: string;
}

// 예약 상태
export type BookingStatus = 
  | 'pending' // 대기 (기존)
  | 'payment_pending' // 결제대기 - 예약신청완료, 입금전
  | 'payment_completed' // 결제완료 - 입금확인후 확정
  | 'payment_expired' // 입금기한만료
  | 'confirmed' // 확정 (기존)
  | 'cancel_requested' // 취소 요청
  | 'cancelled' // 취소 완료
  | 'refund_completed'; // 환불 완료

// 후기 관련 타입
export interface Review {
  id: string;
  tourId: string;
  customerName: string;
  phone: string;
  rating: number; // 별점 (1-5)
  content: string; // 텍스트
  images: string[]; // 이미지 (최대 5장)
  status: ReviewStatus; // 승인 상태
  createdAt: string;
  updatedAt: string;
}

// 후기 승인 상태
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

// 회원 관련 타입
export interface User {
  id: string;
  username?: string;
  nickname?: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  role: UserRole;
  status?: UserStatus; // 승인 상태
  avatar?: string;
  mileage?: number; // 마일리지
  createdAt?: string;
  lastLogin?: string;
}

// 사용자 역할
export type UserRole = 
  | 'user' // 일반 사용자
  | 'customer' // 일반 고객
  | 'staff' // 직원 관리자
  | 'admin'; // 대표 관리자

// 사용자 상태
export type UserStatus = 'pending' | 'approved' | 'suspended' | 'banned';

// 찜하기 (로컬스토리지용)
export interface WishlistItem {
  tourId: string;
  title: string;
  mainImage: string;
  price: number;
  addedAt: string;
}

// 장바구니 아이템 (데이터베이스 연동)
export interface CartItem {
  id?: string; // 장바구니 아이템 ID (DB 기본키)
  tourId: string;
  title: string;
  mainImage?: string;
  price: number;
  departureDate: string;
  participants: number; // 인원수
  customerName?: string; // 예약자명 (선택사항 - 장바구니에서 입력)
  customerPhone?: string; // 연락처 (선택사항 - 장바구니에서 입력)
  customerEmail?: string; // 이메일 (선택사항 - 장바구니에서 입력)
  specialRequests?: string; // 요청사항
  addedAt: string;
  totalAmount: number; // 총 금액 (price * participants)
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 예약 조회 요청
export interface BookingLookupRequest {
  bookingId: string;
  customerName: string;
  phone?: string;
}

// 예약 취소 요청
export interface BookingCancelRequest {
  bookingId: string;
  reason?: string;
}

// 후기 작성 요청
export interface ReviewCreateRequest {
  customerName: string;
  phone: string;
  rating: number;
  content: string;
  images?: string[];
}

// 관리자 권한 설정
export interface AdminPermissions {
  userId: string;
  permissions: {
    tourManagement: boolean; // 여행상품 관리
    bookingManagement: boolean; // 예약 관리
    userManagement: boolean; // 사용자 관리
    reviewManagement: boolean; // 후기 관리
    financialManagement: boolean; // 재정 관리
    systemSettings: boolean; // 시스템 설정
  };
}

// 필터 옵션
export interface TourFilters {
  region?: Region;
  minPrice?: number;
  maxPrice?: number;
  departureMonth?: string;
  status?: TourStatus;
  search?: string;
}

// 페이지네이션
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 공지사항 관련 타입
export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  isImportant: boolean;
  viewCount: number;
  status: NoticeStatus;
  createdAt: string;
  updatedAt: string;
}

// 공지사항 상태
export type NoticeStatus = 'published' | 'draft' | 'archived';

// 공지사항 목록 응답
export interface NoticeListResponse {
  notices: Notice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 

// 1:1 문의 관련 타입
export interface Inquiry {
  id: string;
  inquiryNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  category: InquiryCategory;
  subject: string;
  content: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  assignedTo?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  responseCount?: number;
  lastResponseAt?: string;
}

export interface InquiryResponse {
  id: string;
  inquiryId: string;
  responseType: 'admin_response' | 'customer_followup';
  content: string;
  adminName?: string;
  isInternal: boolean;
  createdAt: string;
}

export interface InquiryAttachment {
  id: string;
  inquiryId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

export type InquiryCategory = 'general' | 'booking' | 'payment' | 'refund' | 'tour' | 'technical' | 'other';
export type InquiryStatus = 'pending' | 'in_progress' | 'completed' | 'closed';
export type InquiryPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CreateInquiryRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  category: InquiryCategory;
  subject: string;
  content: string;
}

export interface UpdateInquiryRequest {
  status?: InquiryStatus;
  priority?: InquiryPriority;
  assignedTo?: string;
  adminNotes?: string;
}

export interface CreateInquiryResponseRequest {
  inquiryId: string;
  content: string;
  adminName?: string;
  isInternal?: boolean;
} 