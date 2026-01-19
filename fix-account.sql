-- jasonheoai@gmail.com 계정의 잘못된 데이터 정리
-- TablePlus나 pgAdmin에서 실행하세요

-- 1. 해당 계정의 User ID 확인
SELECT id, name, email, storage_limit 
FROM users 
WHERE email = 'jasonheoai@gmail.com';

-- 2. 해당 계정의 Tag 데이터 확인
SELECT t.* 
FROM tags t
JOIN users u ON t.user_id = u.id
WHERE u.email = 'jasonheoai@gmail.com';

-- 3. 해당 계정의 thread_tags에서 orphan 레코드 찾기
SELECT tt.* 
FROM thread_tags tt
LEFT JOIN tags t ON tt.tag_id = t.id
WHERE t.id IS NULL;

-- 4. (문제가 있다면) orphan thread_tags 삭제
-- DELETE FROM thread_tags WHERE tag_id NOT IN (SELECT id FROM tags);
