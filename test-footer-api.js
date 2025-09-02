// 푸터 API 테스트 스크립트
const fetch = require('node-fetch');

async function testFooterAPI() {
  try {
    console.log('푸터 API 테스트 시작...');
    
    // JWT 토큰이 필요하므로 실제 로그인한 상태에서 브라우저 콘솔에서 실행해야 합니다.
    const token = process.env.TEST_TOKEN || 'your-jwt-token-here';
    
    const response = await fetch('http://localhost:3000/api/admin/footer', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('응답 상태:', response.status);
    const result = await response.json();
    console.log('응답 데이터:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('테스트 오류:', error);
  }
}

// 브라우저 콘솔에서 실행할 수 있는 코드
console.log(`
브라우저 콘솔에서 다음 코드를 실행하세요:

fetch('/api/admin/footer', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(res => res.json())
.then(data => console.log('푸터 설정:', data))
.catch(err => console.error('오류:', err));
`);

testFooterAPI();
