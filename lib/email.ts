import nodemailer from 'nodemailer';
import { generateEmailContent } from './email-templates';

// 이메일 설정
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Gmail 계정
    pass: process.env.EMAIL_PASS, // Gmail 앱 비밀번호
  },
};

// 이메일 전송기 생성
const transporter = nodemailer.createTransport(emailConfig);

// 이메일 발송 함수
export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  try {
    const mailOptions = {
      from: `"하나투어" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('이메일 발송 성공:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// 템플릿 기반 이메일 발송 함수
export async function sendTemplateEmail(
  to: string, 
  templateType: string, 
  variables: Record<string, any>
) {
  try {
    const emailContent = await generateEmailContent(templateType, variables);
    
    if (!emailContent) {
      console.warn(`템플릿을 찾을 수 없습니다: ${templateType}`);
      return { success: false, error: '템플릿을 찾을 수 없습니다.' };
    }

    return await sendEmail(to, emailContent.subject, emailContent.html, emailContent.text);
  } catch (error) {
    console.error('템플릿 이메일 발송 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// 예약 확인 이메일 발송 (템플릿 기반)
export async function sendBookingConfirmationEmail(booking: any) {
  const variables = {
    bookingNumber: booking.bookingNumber,
    tourTitle: booking.tourTitle,
    customerName: booking.customerName,
    participants: booking.participants,
    totalAmount: booking.totalAmount.toLocaleString(),
    departureDate: new Date(booking.departureDate).toLocaleDateString('ko-KR'),
    paymentDueDate: new Date(booking.paymentDueDate).toLocaleString('ko-KR'),
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  };

  return sendTemplateEmail(booking.customerEmail, 'booking_confirmation', variables);
}

// 결제 완료 이메일 발송 (템플릿 기반)
export async function sendPaymentCompletedEmail(booking: any, paymentInfo: any) {
  const variables = {
    bookingNumber: booking.bookingNumber,
    tourTitle: booking.tourTitle,
    totalAmount: booking.totalAmount.toLocaleString(),
    paymentMethod: paymentInfo.method === 'bank_transfer' ? '계좌이체' : paymentInfo.method,
    paymentDate: new Date(paymentInfo.paidAt).toLocaleString('ko-KR'),
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  };

  return sendTemplateEmail(booking.customerEmail, 'payment_completed', variables);
}

// 입금 기한 만료 이메일 발송 (템플릿 기반)
export async function sendPaymentExpiredEmail(booking: any) {
  const variables = {
    bookingNumber: booking.bookingNumber,
    tourTitle: booking.tourTitle,
    customerName: booking.customerName,
    participants: booking.participants,
    totalAmount: booking.totalAmount.toLocaleString(),
    paymentDueDate: new Date(booking.paymentDueDate).toLocaleString('ko-KR')
  };

  return sendTemplateEmail(booking.customerEmail, 'payment_expired', variables);
}

// 입금 기한 알림 이메일 발송 (템플릿 기반)
export async function sendPaymentReminderEmail(booking: any) {
  // 남은 시간 계산
  const now = new Date();
  const dueDate = new Date(booking.paymentDueDate);
  const remainingMs = dueDate.getTime() - now.getTime();
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingDays = Math.floor(remainingHours / 24);
  
  let remainingTime = '';
  if (remainingDays > 0) {
    remainingTime = `${remainingDays}일 ${remainingHours % 24}시간`;
  } else {
    remainingTime = `${remainingHours}시간`;
  }

  const variables = {
    bookingNumber: booking.bookingNumber,
    tourTitle: booking.tourTitle,
    customerName: booking.customerName,
    participants: booking.participants,
    totalAmount: booking.totalAmount.toLocaleString(),
    departureDate: new Date(booking.departureDate).toLocaleDateString('ko-KR'),
    paymentDueDate: new Date(booking.paymentDueDate).toLocaleString('ko-KR'),
    remainingTime,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  };

  return sendTemplateEmail(booking.customerEmail, 'payment_reminder', variables);
} 