import pool from '@/lib/db';

// 이메일 템플릿 인터페이스
export interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 템플릿 변수 치환 함수
export function replaceTemplateVariables(template: string, variables: Record<string, any>): string {
  let result = template;
  
  // {변수명} 형태의 변수를 실제 값으로 치환
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, String(value));
  });
  
  return result;
}

// 활성화된 템플릿 조회
export async function getActiveTemplate(type: string): Promise<EmailTemplate | null> {
  try {
    const [templates] = await pool.query<any[]>(
      'SELECT * FROM email_templates WHERE type = ? AND is_active = TRUE',
      [type]
    );

    if (templates.length === 0) {
      return null;
    }

    const template = templates[0];
    
    // JSON 필드 파싱
    if (template.variables) {
      template.variables = JSON.parse(template.variables);
    }

    return template;
  } catch (error) {
    console.error('템플릿 조회 에러:', error);
    return null;
  }
}

// 템플릿으로 이메일 내용 생성
export async function generateEmailContent(
  type: string, 
  variables: Record<string, any>
): Promise<{ subject: string; html: string; text?: string } | null> {
  try {
    const template = await getActiveTemplate(type);
    
    if (!template) {
      console.warn(`활성화된 템플릿이 없습니다: ${type}`);
      return null;
    }

    // 변수 치환
    const subject = replaceTemplateVariables(template.subject, variables);
    const html = replaceTemplateVariables(template.html_content, variables);
    const text = template.text_content 
      ? replaceTemplateVariables(template.text_content, variables)
      : undefined;

    return { subject, html, text };
  } catch (error) {
    console.error('이메일 내용 생성 에러:', error);
    return null;
  }
}

// 사용 가능한 변수 목록
export const EMAIL_VARIABLES = {
  booking_confirmation: [
    'bookingNumber',
    'tourTitle', 
    'customerName',
    'participants',
    'totalAmount',
    'departureDate',
    'paymentDueDate',
    'baseUrl'
  ],
  payment_completed: [
    'bookingNumber',
    'tourTitle',
    'totalAmount',
    'paymentMethod',
    'paymentDate',
    'baseUrl'
  ],
  payment_expired: [
    'bookingNumber',
    'tourTitle',
    'customerName',
    'participants',
    'totalAmount',
    'paymentDueDate'
  ],
  payment_reminder: [
    'bookingNumber',
    'tourTitle',
    'customerName',
    'participants',
    'totalAmount',
    'departureDate',
    'paymentDueDate',
    'remainingTime',
    'baseUrl'
  ],
  registration_completed: [
    'customerName',
    'email',
    'baseUrl'
  ]
};

// 변수 설명
export const EMAIL_VARIABLE_DESCRIPTIONS = {
  bookingNumber: '예약번호',
  tourTitle: '투어 제목',
  customerName: '고객명',
  participants: '참가자 수',
  totalAmount: '총 금액',
  departureDate: '출발일',
  paymentDueDate: '입금 기한',
  paymentMethod: '결제 방법',
  paymentDate: '결제 일시',
  remainingTime: '남은 시간',
  baseUrl: '사이트 기본 URL'
}; 