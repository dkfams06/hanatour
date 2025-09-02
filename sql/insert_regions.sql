-- 기본 지역 데이터 삽입
-- 계층 구조: 대륙 -> 국가 -> 도시

-- 1. 대륙 데이터
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('asia', '아시아', NULL, 'continent', 1, TRUE),
('europe', '유럽', NULL, 'continent', 2, TRUE),
('americas', '미주', NULL, 'continent', 3, TRUE),
('oceania', '오세아니아', NULL, 'continent', 4, TRUE),
('africa', '아프리카', NULL, 'continent', 5, TRUE),
('domestic', '국내', NULL, 'continent', 6, TRUE);

-- 2. 아시아 국가
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('japan', '일본', 'asia', 'country', 1, TRUE),
('china', '중국', 'asia', 'country', 2, TRUE),
('thailand', '태국', 'asia', 'country', 3, TRUE),
('vietnam', '베트남', 'asia', 'country', 4, TRUE),
('singapore', '싱가포르', 'asia', 'country', 5, TRUE),
('taiwan', '대만', 'asia', 'country', 6, TRUE),
('hongkong-macau', '홍콩/마카오', 'asia', 'country', 7, TRUE),
('philippines', '필리핀', 'asia', 'country', 8, TRUE),
('malaysia', '말레이시아', 'asia', 'country', 9, TRUE),
('indonesia', '인도네시아', 'asia', 'country', 10, TRUE);

-- 3. 유럽 국가
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('france', '프랑스', 'europe', 'country', 1, TRUE),
('italy', '이탈리아', 'europe', 'country', 2, TRUE),
('spain', '스페인', 'europe', 'country', 3, TRUE),
('germany', '독일', 'europe', 'country', 4, TRUE),
('uk', '영국', 'europe', 'country', 5, TRUE),
('switzerland', '스위스', 'europe', 'country', 6, TRUE),
('austria', '오스트리아', 'europe', 'country', 7, TRUE),
('netherlands', '네덜란드', 'europe', 'country', 8, TRUE),
('belgium', '벨기에', 'europe', 'country', 9, TRUE),
('greece', '그리스', 'europe', 'country', 10, TRUE),
('portugal', '포르투갈', 'europe', 'country', 11, TRUE),
('czech', '체코', 'europe', 'country', 12, TRUE),
('hungary', '헝가리', 'europe', 'country', 13, TRUE),
('poland', '폴란드', 'europe', 'country', 14, TRUE),
('croatia', '크로아티아', 'europe', 'country', 15, TRUE),
('turkey', '터키', 'europe', 'country', 16, TRUE),
('russia', '러시아', 'europe', 'country', 17, TRUE),
('norway', '노르웨이', 'europe', 'country', 18, TRUE),
('sweden', '스웨덴', 'europe', 'country', 19, TRUE),
('finland', '핀란드', 'europe', 'country', 20, TRUE),
('denmark', '덴마크', 'europe', 'country', 21, TRUE),
('iceland', '아이슬란드', 'europe', 'country', 22, TRUE);

-- 4. 미주 국가
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('usa', '미국', 'americas', 'country', 1, TRUE),
('canada', '캐나다', 'americas', 'country', 2, TRUE),
('mexico', '멕시코', 'americas', 'country', 3, TRUE),
('brazil', '브라질', 'americas', 'country', 4, TRUE),
('argentina', '아르헨티나', 'americas', 'country', 5, TRUE),
('chile', '칠레', 'americas', 'country', 6, TRUE),
('peru', '페루', 'americas', 'country', 7, TRUE),
('cuba', '쿠바', 'americas', 'country', 8, TRUE);

-- 5. 오세아니아 국가
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('australia', '호주', 'oceania', 'country', 1, TRUE),
('new-zealand', '뉴질랜드', 'oceania', 'country', 2, TRUE),
('fiji', '피지', 'oceania', 'country', 3, TRUE),
('tahiti', '타히티', 'oceania', 'country', 4, TRUE);

-- 6. 아프리카 국가
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('south-africa', '남아프리카공화국', 'africa', 'country', 1, TRUE),
('egypt', '이집트', 'africa', 'country', 2, TRUE),
('morocco', '모로코', 'africa', 'country', 3, TRUE),
('kenya', '케냐', 'africa', 'country', 4, TRUE),
('tanzania', '탄자니아', 'africa', 'country', 5, TRUE);

-- 7. 국내 지역
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('korea', '대한민국', 'domestic', 'country', 1, TRUE);

-- 8. 일본 도시
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('tokyo', '도쿄', 'japan', 'city', 1, TRUE),
('osaka', '오사카', 'japan', 'city', 2, TRUE),
('kyoto', '교토', 'japan', 'city', 3, TRUE),
('fukuoka', '후쿠오카', 'japan', 'city', 4, TRUE),
('nagoya', '나고야', 'japan', 'city', 5, TRUE),
('hiroshima', '히로시마', 'japan', 'city', 6, TRUE),
('sapporo', '삿포로', 'japan', 'city', 7, TRUE),
('okinawa', '오키나와', 'japan', 'city', 8, TRUE);

-- 9. 중국 도시
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('beijing', '베이징', 'china', 'city', 1, TRUE),
('shanghai', '상하이', 'china', 'city', 2, TRUE),
('guangzhou', '광저우', 'china', 'city', 3, TRUE),
('xian', '시안', 'china', 'city', 4, TRUE),
('chengdu', '청두', 'china', 'city', 5, TRUE),
('hangzhou', '항저우', 'china', 'city', 6, TRUE);

-- 10. 태국 도시
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('bangkok', '방콕', 'thailand', 'city', 1, TRUE),
('phuket', '푸켓', 'thailand', 'city', 2, TRUE),
('pattaya', '파타야', 'thailand', 'city', 3, TRUE),
('chiang-mai', '치앙마이', 'thailand', 'city', 4, TRUE),
('koh-samui', '코사무이', 'thailand', 'city', 5, TRUE);

-- 11. 베트남 도시
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('hanoi', '하노이', 'vietnam', 'city', 1, TRUE),
('ho-chi-minh', '호치민', 'vietnam', 'city', 2, TRUE),
('danang', '다낭', 'vietnam', 'city', 3, TRUE),
('nha-trang', '나트랑', 'vietnam', 'city', 4, TRUE),
('hoi-an', '호이안', 'vietnam', 'city', 5, TRUE);

-- 12. 프랑스 도시
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('paris', '파리', 'france', 'city', 1, TRUE),
('nice', '니스', 'france', 'city', 2, TRUE),
('lyon', '리옹', 'france', 'city', 3, TRUE),
('marseille', '마르세유', 'france', 'city', 4, TRUE),
('strasbourg', '스트라스부르', 'france', 'city', 5, TRUE);

-- 13. 이탈리아 도시
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('rome', '로마', 'italy', 'city', 1, TRUE),
('milan', '밀라노', 'italy', 'city', 2, TRUE),
('florence', '피렌체', 'italy', 'city', 3, TRUE),
('venice', '베네치아', 'italy', 'city', 4, TRUE),
('naples', '나폴리', 'italy', 'city', 5, TRUE);

-- 14. 스페인 도시
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('madrid', '마드리드', 'spain', 'city', 1, TRUE),
('barcelona', '바르셀로나', 'spain', 'city', 2, TRUE),
('seville', '세비야', 'spain', 'city', 3, TRUE),
('valencia', '발렌시아', 'spain', 'city', 4, TRUE),
('granada', '그라나다', 'spain', 'city', 5, TRUE);

-- 15. 미국 도시
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('new-york', '뉴욕', 'usa', 'city', 1, TRUE),
('los-angeles', '로스앤젤레스', 'usa', 'city', 2, TRUE),
('las-vegas', '라스베이거스', 'usa', 'city', 3, TRUE),
('san-francisco', '샌프란시스코', 'usa', 'city', 4, TRUE),
('chicago', '시카고', 'usa', 'city', 5, TRUE),
('miami', '마이애미', 'usa', 'city', 6, TRUE),
('seattle', '시애틀', 'usa', 'city', 7, TRUE),
('boston', '보스턴', 'usa', 'city', 8, TRUE),
('washington-dc', '워싱턴DC', 'usa', 'city', 9, TRUE),
('hawaii', '하와이', 'usa', 'city', 10, TRUE);

-- 16. 호주 도시
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('sydney', '시드니', 'australia', 'city', 1, TRUE),
('melbourne', '멜버른', 'australia', 'city', 2, TRUE),
('brisbane', '브리즈번', 'australia', 'city', 3, TRUE),
('perth', '퍼스', 'australia', 'city', 4, TRUE),
('gold-coast', '골드코스트', 'australia', 'city', 5, TRUE);

-- 17. 국내 도시
INSERT INTO regions (id, name, parent_id, level, display_order, is_active) VALUES
('seoul', '서울', 'korea', 'city', 1, TRUE),
('busan', '부산', 'korea', 'city', 2, TRUE),
('jeju', '제주', 'korea', 'city', 3, TRUE),
('gangwon', '강원', 'korea', 'city', 4, TRUE),
('gyeongju', '경주', 'korea', 'city', 5, TRUE),
('jeonju', '전주', 'korea', 'city', 6, TRUE);

-- 인덱스 확인을 위한 쿼리 (실행 후 확인용)
-- SELECT COUNT(*) as total_regions FROM regions;
-- SELECT level, COUNT(*) as count FROM regions GROUP BY level;
-- SELECT * FROM regions WHERE level = 'continent' ORDER BY display_order; 