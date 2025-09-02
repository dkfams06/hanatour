import { Metadata } from 'next';

export const metadata: Metadata = {
  // 카카오톡 캐시 무효화를 위한 추가 설정
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
    'pragma': 'no-cache',
    'expires': '0',
  },
};
