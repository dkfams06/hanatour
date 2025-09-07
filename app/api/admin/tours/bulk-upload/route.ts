import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: '파일이 없습니다.' }, { status: 400 });
    }

    // 파일을 buffer로 읽기
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Excel 파일 파싱
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // 각 행을 처리
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any;
      const rowNumber = i + 2; // Excel에서 1행은 헤더, 2행부터 데이터

      try {
        // 필수 필드 검증 - 계층적 구조 적용
        if (!row['제목'] || !row['설명'] || !row['대표이미지'] || !row['출발일'] || 
            !row['최대인원'] || !row['가격'] || !row['대륙'] || !row['국가']) {
          errors.push(`${rowNumber}행: 필수 입력값이 누락되었습니다. (제목, 설명, 대표이미지, 출발일, 최대인원, 가격, 대륙, 국가 필수)`);
          failedCount++;
          continue;
        }

        // 이미지 처리
        const mainImage = row['대표이미지'];
        const additionalImages = row['추가이미지'] ? row['추가이미지'].split('|').filter(Boolean) : [];
        const images = [mainImage, ...additionalImages];

        if (images.length > 5) {
          errors.push(`${rowNumber}행: 이미지는 최대 5장까지 업로드 가능합니다.`);
          failedCount++;
          continue;
        }

        // 포함/불포함 사항 처리
        const included = row['포함사항'] ? row['포함사항'].split('|').filter(Boolean) : [];
        const excluded = row['불포함사항'] ? row['불포함사항'].split('|').filter(Boolean) : [];

        // 날짜 포맷 검증 및 변환
        let departureDate: string;
        if (row['출발일'] instanceof Date) {
          departureDate = row['출발일'].toISOString().split('T')[0];
        } else if (typeof row['출발일'] === 'string') {
          // YYYY-MM-DD 형식 검증
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(row['출발일'])) {
            errors.push(`${rowNumber}행: 출발일은 YYYY-MM-DD 형식이어야 합니다.`);
            failedCount++;
            continue;
          }
          departureDate = row['출발일'];
        } else {
          errors.push(`${rowNumber}행: 출발일 형식이 올바르지 않습니다.`);
          failedCount++;
          continue;
        }

        // 숫자 필드 검증
        const maxParticipants = parseInt(row['최대인원']);
        const price = parseInt(row['가격']);

        if (isNaN(maxParticipants) || maxParticipants <= 0) {
          errors.push(`${rowNumber}행: 최대인원은 양수여야 합니다.`);
          failedCount++;
          continue;
        }

        if (isNaN(price) || price <= 0) {
          errors.push(`${rowNumber}행: 가격은 양수여야 합니다.`);
          failedCount++;
          continue;
        }

        // 계층적 지역 정보 처리
        const continent = row['대륙'];
        const country = row['국가'];
        const region = row['지역'] || null; // 지역은 선택사항

        // 대륙 검증
        const validContinents = ['asia', 'europe', 'americas', 'oceania', 'africa', 'domestic'];
        if (!validContinents.includes(continent)) {
          errors.push(`${rowNumber}행: 대륙은 ${validContinents.join(', ')} 중 하나여야 합니다.`);
          failedCount++;
          continue;
        }

        // 국가 검증 (기본적인 검증)
        if (!country || country.trim() === '') {
          errors.push(`${rowNumber}행: 국가는 필수 입력값입니다.`);
          failedCount++;
          continue;
        }

        // 상태 설정 (기본값: unpublished)
        const status = row['상태'] || 'unpublished';
        if (!['published', 'unpublished', 'draft'].includes(status)) {
          errors.push(`${rowNumber}행: 상태는 published, unpublished, draft 중 하나여야 합니다.`);
          failedCount++;
          continue;
        }

        console.log(`${rowNumber}행 처리:`, {
          title: row['제목'],
          continent,
          country,
          region,
          departureDate
        });

        // 데이터베이스에 저장 - 새로운 필드 구조로 저장
        const id = uuidv4();
        await pool.query(
          `INSERT INTO tours (id, title, description, images, mainImage, departureDate, maxParticipants, currentParticipants, price, included, excluded, continent, country, region, status, rating, reviewCount) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, 0, 0)`,
          [
            id,
            row['제목'],
            row['설명'],
            JSON.stringify(images),
            mainImage,
            departureDate,
            maxParticipants,
            price,
            JSON.stringify(included),
            JSON.stringify(excluded),
            continent,
            country,
            region,
            status
          ]
        );

        successCount++;
      } catch (error) {
        console.error(`Row ${rowNumber} error:`, error);
        errors.push(`${rowNumber}행: 데이터베이스 저장 중 오류가 발생했습니다. ${error instanceof Error ? error.message : ''}`);
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        success: successCount,
        failed: failedCount,
        errors: errors.slice(0, 10), // 최대 10개의 오류만 표시
        message: `총 ${data.length}개 행 처리 완료: 성공 ${successCount}개, 실패 ${failedCount}개`
      }
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { success: false, error: '파일 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 