#!/bin/bash

cd /var/www/hana

# 프로덕션 빌드가 없으면 빌드
if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
    echo "프로덕션 빌드를 시작합니다..."
    npm run build
fi

# 서버 시작
echo "서버를 시작합니다..."
npm start
