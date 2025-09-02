-- 이메일 템플릿 관리 테이블 생성
CREATE TABLE IF NOT EXISTS email_templates (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '템플릿 이름',
  type VARCHAR(50) NOT NULL COMMENT '템플릿 타입 (booking_confirmation, payment_completed, payment_expired, payment_reminder)',
  subject VARCHAR(200) NOT NULL COMMENT '이메일 제목',
  html_content LONGTEXT NOT NULL COMMENT 'HTML 내용',
  text_content TEXT COMMENT '텍스트 내용 (선택사항)',
  variables JSON COMMENT '사용 가능한 변수 목록',
  is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_type (type),
  INDEX idx_type (type),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='이메일 템플릿 테이블';

-- 기본 이메일 템플릿 데이터 삽입
INSERT INTO email_templates (id, name, type, subject, html_content, variables) VALUES
(
  UUID(),
  '예약 확인 이메일',
  'booking_confirmation',
  '[하나투어] 예약 신청 완료 - {bookingNumber}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>예약 신청 완료</title>
  <style>
    body { font-family: ''Malgun Gothic'', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .booking-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .highlight { color: #667eea; font-weight: bold; }
    .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 예약 신청이 완료되었습니다!</h1>
      <p>하나투어를 이용해 주셔서 감사합니다.</p>
    </div>
    
    <div class="content">
      <h2>예약 정보</h2>
      <div class="booking-info">
        <p><strong>예약번호:</strong> <span class="highlight">{bookingNumber}</span></p>
        <p><strong>상품명:</strong> {tourTitle}</p>
        <p><strong>예약자:</strong> {customerName}</p>
        <p><strong>인원:</strong> {participants}명</p>
        <p><strong>총 금액:</strong> {totalAmount}원</p>
        <p><strong>출발일:</strong> {departureDate}</p>
      </div>
      
      <div class="warning">
        <h3>⚠️ 입금 안내</h3>
        <p><strong>입금 기한:</strong> {paymentDueDate}</p>
        <p>입금 기한 내에 입금을 완료해주시면 예약이 확정됩니다.</p>
        <p>입금이 확인되지 않으면 예약이 자동으로 취소될 수 있습니다.</p>
      </div>
      
      <h3>다음 단계</h3>
      <ol>
        <li>입금 기한 내에 지정된 계좌로 입금해주세요</li>
        <li>입금 완료 후 관리자 확인을 기다려주세요</li>
        <li>확정 이메일을 받으시면 예약이 완료됩니다</li>
      </ol>
      
      <p style="text-align: center;">
        <a href="{baseUrl}/booking-lookup" class="button">예약 확인하기</a>
      </p>
    </div>
    
    <div class="footer">
      <p>본 이메일은 자동으로 발송되었습니다.</p>
      <p>문의사항: <a href="mailto:support@hanatour.com">support@hanatour.com</a></p>
      <p>© 2024 하나투어. All rights reserved.</p>
    </div>
  </div>
</body>
</html>',
  '["bookingNumber", "tourTitle", "customerName", "participants", "totalAmount", "departureDate", "paymentDueDate", "baseUrl"]'
),
(
  UUID(),
  '결제 완료 이메일',
  'payment_completed',
  '[하나투어] 결제 완료 - {bookingNumber}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>결제 완료</title>
  <style>
    body { font-family: ''Malgun Gothic'', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .success-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
    .highlight { color: #28a745; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ 결제가 완료되었습니다!</h1>
      <p>예약이 확정되었습니다.</p>
    </div>
    
    <div class="content">
      <h2>결제 정보</h2>
      <div class="success-info">
        <p><strong>예약번호:</strong> <span class="highlight">{bookingNumber}</span></p>
        <p><strong>상품명:</strong> {tourTitle}</p>
        <p><strong>결제 금액:</strong> {totalAmount}원</p>
        <p><strong>결제 방법:</strong> {paymentMethod}</p>
        <p><strong>결제 일시:</strong> {paymentDate}</p>
      </div>
      
      <h3>여행 준비사항</h3>
      <ul>
        <li>출발 3일 전까지 여행 준비사항을 안내드립니다</li>
        <li>여행 당일 집합 장소와 시간을 확인해주세요</li>
        <li>필요한 서류와 준비물을 미리 준비해주세요</li>
      </ul>
      
      <p style="text-align: center;">
        <a href="{baseUrl}/booking-lookup" class="button">예약 확인하기</a>
      </p>
    </div>
    
    <div class="footer">
      <p>본 이메일은 자동으로 발송되었습니다.</p>
      <p>문의사항: <a href="mailto:support@hanatour.com">support@hanatour.com</a></p>
      <p>© 2024 하나투어. All rights reserved.</p>
    </div>
  </div>
</body>
</html>',
  '["bookingNumber", "tourTitle", "totalAmount", "paymentMethod", "paymentDate", "baseUrl"]'
),
(
  UUID(),
  '입금 기한 만료 이메일',
  'payment_expired',
  '[하나투어] 입금 기한 만료 - {bookingNumber}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>입금 기한 만료</title>
  <style>
    body { font-family: ''Malgun Gothic'', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .expired-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545; }
    .highlight { color: #dc3545; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ 입금 기한이 만료되었습니다</h1>
      <p>예약이 자동으로 취소되었습니다.</p>
    </div>
    
    <div class="content">
      <h2>취소된 예약 정보</h2>
      <div class="expired-info">
        <p><strong>예약번호:</strong> <span class="highlight">{bookingNumber}</span></p>
        <p><strong>상품명:</strong> {tourTitle}</p>
        <p><strong>예약자:</strong> {customerName}</p>
        <p><strong>인원:</strong> {participants}명</p>
        <p><strong>총 금액:</strong> {totalAmount}원</p>
        <p><strong>입금 기한:</strong> {paymentDueDate}</p>
      </div>
      
      <h3>안내사항</h3>
      <ul>
        <li>입금 기한이 지나 예약이 자동으로 취소되었습니다</li>
        <li>다시 예약을 원하시면 새로운 예약을 진행해주세요</li>
        <li>문의사항이 있으시면 고객센터로 연락해주세요</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>본 이메일은 자동으로 발송되었습니다.</p>
      <p>문의사항: <a href="mailto:support@hanatour.com">support@hanatour.com</a></p>
      <p>© 2024 하나투어. All rights reserved.</p>
    </div>
  </div>
</body>
</html>',
  '["bookingNumber", "tourTitle", "customerName", "participants", "totalAmount", "paymentDueDate"]'
),
(
  UUID(),
  '입금 기한 알림 이메일',
  'payment_reminder',
  '[하나투어] 입금 기한 안내 - {bookingNumber}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>입금 기한 안내</title>
  <style>
    body { font-family: ''Malgun Gothic'', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .reminder-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
    .highlight { color: #ffc107; font-weight: bold; }
    .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .button { display: inline-block; background: #ffc107; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ 입금 기한이 임박했습니다</h1>
      <p>예약 확정을 위해 입금을 완료해주세요.</p>
    </div>
    
    <div class="content">
      <h2>예약 정보</h2>
      <div class="reminder-info">
        <p><strong>예약번호:</strong> <span class="highlight">{bookingNumber}</span></p>
        <p><strong>상품명:</strong> {tourTitle}</p>
        <p><strong>예약자:</strong> {customerName}</p>
        <p><strong>인원:</strong> {participants}명</p>
        <p><strong>총 금액:</strong> {totalAmount}원</p>
        <p><strong>출발일:</strong> {departureDate}</p>
      </div>
      
      <div class="warning">
        <h3>⚠️ 입금 기한 안내</h3>
        <p><strong>입금 기한:</strong> {paymentDueDate}</p>
        <p><strong>남은 시간:</strong> {remainingTime}</p>
        <p>입금 기한이 지나면 예약이 자동으로 취소됩니다.</p>
      </div>
      
      <h3>입금 계좌 정보</h3>
      <ul>
        <li>은행: 하나은행</li>
        <li>계좌번호: 123-456789-01234</li>
        <li>예금주: (주)하나투어</li>
      </ul>
      
      <p style="text-align: center;">
        <a href="{baseUrl}/booking-lookup" class="button">예약 확인하기</a>
      </p>
    </div>
    
    <div class="footer">
      <p>본 이메일은 자동으로 발송되었습니다.</p>
      <p>문의사항: <a href="mailto:support@hanatour.com">support@hanatour.com</a></p>
      <p>© 2024 하나투어. All rights reserved.</p>
    </div>
  </div>
</body>
</html>',
  '["bookingNumber", "tourTitle", "customerName", "participants", "totalAmount", "departureDate", "paymentDueDate", "remainingTime", "baseUrl"]'
),
(
  UUID(),
  '회원가입 완료 안내',
  'registration_completed',
  '[하나투어] 회원가입 신청이 완료되었습니다',
  '<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>회원가입 완료</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }
    .header h1 {
      color: #2563eb;
      margin: 0;
      font-size: 24px;
    }
    .content {
      margin-bottom: 30px;
    }
    .status-box {
      background-color: #dbeafe;
      border: 1px solid #3b82f6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .status-box h3 {
      color: #1e40af;
      margin: 0 0 10px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .info-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-box h3 {
      color: #475569;
      margin: 0 0 10px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .highlight {
      color: #2563eb;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 10px 0;
      text-align: center;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    .steps {
      background-color: #f0f9ff;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .steps h3 {
      color: #0369a1;
      margin: 0 0 15px 0;
    }
    .steps ol {
      margin: 0;
      padding-left: 20px;
    }
    .steps li {
      margin-bottom: 8px;
      color: #0c4a6e;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 회원가입 신청 완료!</h1>
      <p>하나투어에 가입해 주셔서 감사합니다.</p>
    </div>
    
    <div class="content">
      <div class="status-box">
        <h3>⏳ 승인대기중</h3>
        <p><strong>{customerName}</strong>님의 회원가입 신청이 완료되었습니다.</p>
        <p>관리자 승인 후 로그인하실 수 있습니다.</p>
      </div>

      <div class="info-box">
        <h3>📧 이메일 안내</h3>
        <p>승인 상태는 <strong>{email}</strong>로 안내드립니다.</p>
        <p>스팸메일함도 확인해주세요.</p>
      </div>

      <div class="steps">
        <h3>📋 다음 단계</h3>
        <ol>
          <li>관리자 승인을 기다려주세요 (1-2일 소요)</li>
          <li>승인 완료 이메일을 받으시면 로그인하실 수 있습니다</li>
          <li>로그인 후 다양한 여행상품을 이용하실 수 있습니다</li>
        </ol>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{baseUrl}" class="button">하나투어 홈페이지 방문</a>
      </div>
    </div>
    
    <div class="footer">
      <p>본 이메일은 자동으로 발송되었습니다.</p>
      <p>문의사항: <a href="mailto:support@hanatour.com">support@hanatour.com</a></p>
      <p>© 2024 하나투어. All rights reserved.</p>
    </div>
  </div>
</body>
</html>',
  '안녕하세요, {customerName}님!

하나투어에 가입해 주셔서 감사합니다.

🎉 회원가입 신청이 완료되었습니다.

⏳ 현재 상태: 승인대기중
관리자 승인 후 로그인하실 수 있습니다.

📧 이메일 안내
승인 상태는 {email}로 안내드립니다.
스팸메일함도 확인해주세요.

📋 다음 단계
1. 관리자 승인을 기다려주세요 (1-2일 소요)
2. 승인 완료 이메일을 받으시면 로그인하실 수 있습니다
3. 로그인 후 다양한 여행상품을 이용하실 수 있습니다

문의사항: support@hanatour.com

© 2024 하나투어. All rights reserved.',
  '["customerName", "email", "baseUrl"]'
); 