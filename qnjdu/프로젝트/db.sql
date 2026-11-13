
CREATE DATABASE topicpick
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE topicpick;
CREATE TABLE topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(50) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    interest VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    research_direction TEXT NOT NULL
);

INSERT INTO topics
(subject, task_type, interest, difficulty, title, description, research_direction)
VALUES
('정보', '발표', '보안', '보통',
 '피싱 사이트는 어떻게 사람을 속일까?',
 '피싱 사이트의 특징과 개인정보 유출 위험을 알아보는 주제',
 '피싱 사례를 조사하고 안전한 웹사이트 구별 방법과 예방법을 정리한다.'),
('정보', '보고서', '보안', '쉬움',
 '안전한 비밀번호는 어떻게 만들까?',
 '비밀번호 보안과 안전한 계정 관리 방법을 알아보는 주제',
 '비밀번호 길이와 복잡성, 다중 인증의 효과를 비교한다.'),
('정보', '탐구', '인공지능', '보통',
 '인공지능은 어떻게 이미지를 인식할까?',
 '이미지 인식 기술의 기본 원리를 탐구하는 주제',
 '이미지 분류의 원리를 조사하고 활용 사례와 한계를 정리한다.');

 USE topicpick;

INSERT INTO topics
(subject, task_type, interest, difficulty, title, description, research_direction)
SELECT '정보', '발표', '보안', '보통',
       '피싱 사이트는 어떻게 사람을 속일까?',
       '피싱 사이트의 특징과 개인정보 유출 위험을 알아보는 주제',
       '피싱 사례를 조사하고 안전한 웹사이트 구별 방법과 예방법을 정리한다.'
WHERE NOT EXISTS (
    SELECT 1 FROM topics
    WHERE title = '피싱 사이트는 어떻게 사람을 속일까?'
);

INSERT INTO topics
(subject, task_type, interest, difficulty, title, description, research_direction)
SELECT '정보', '보고서', '보안', '쉬움',
       '안전한 비밀번호는 어떻게 만들까?',
       '비밀번호 보안과 안전한 계정 관리 방법을 알아보는 주제',
       '비밀번호 길이와 복잡성, 다중 인증의 효과를 비교한다.'
WHERE NOT EXISTS (
    SELECT 1 FROM topics
    WHERE title = '안전한 비밀번호는 어떻게 만들까?'
);

INSERT INTO topics
(subject, task_type, interest, difficulty, title, description, research_direction)
SELECT '정보', '탐구', '인공지능', '보통',
       '인공지능은 어떻게 이미지를 인식할까?',
       '이미지 인식 기술의 기본 원리를 탐구하는 주제',
       '이미지 분류의 원리를 조사하고 활용 사례와 한계를 정리한다.'
WHERE NOT EXISTS (
    SELECT 1 FROM topics
    WHERE title = '인공지능은 어떻게 이미지를 인식할까?'
);

INSERT INTO topics
(subject, task_type, interest, difficulty, title, description, research_direction)
SELECT '정보', '발표', '웹 개발', '보통',
       '웹사이트에서 개인정보는 어떻게 보호할까?',
       '웹사이트의 개인정보 보호 기술과 보안 수칙을 알아보는 주제',
       'HTTPS, 개인정보 최소 수집, 접근 권한 관리 등의 역할을 조사한다.'
WHERE NOT EXISTS (
    SELECT 1 FROM topics
    WHERE title = '웹사이트에서 개인정보는 어떻게 보호할까?'
);

INSERT INTO topics
(subject, task_type, interest, difficulty, title, description, research_direction)
SELECT '정보', '보고서', '인공지능', '어려움',
       '생성형 인공지능은 가짜 정보를 만들 수 있을까?',
       '생성형 인공지능의 오류와 정보 검증 방법을 알아보는 주제',
       '인공지능이 만든 정보의 오류 사례를 조사하고 검증 방법을 비교한다.'
WHERE NOT EXISTS (
    SELECT 1 FROM topics
    WHERE title = '생성형 인공지능은 가짜 정보를 만들 수 있을까?'
);

INSERT INTO topics
(subject, task_type, interest, difficulty, title, description, research_direction)
SELECT '정보', '탐구', '네트워크', '보통',
       '공용 와이파이를 사용할 때 어떤 위험이 있을까?',
       '공용 네트워크의 보안 위험과 안전한 이용 방법을 알아보는 주제',
       '공용 와이파이에서 발생할 수 있는 보안 위협과 예방 방법을 조사한다.'
WHERE NOT EXISTS (
    SELECT 1 FROM topics
    WHERE title = '공용 와이파이를 사용할 때 어떤 위험이 있을까?'
);

INSERT INTO topics
(subject, task_type, interest, difficulty, title, description, research_direction)
SELECT '정보', '발표', '웹 개발', '쉬움',
       '쿠키와 캐시는 어떤 차이가 있을까?',
       '웹 브라우저가 사용하는 쿠키와 캐시의 기능을 알아보는 주제',
       '쿠키와 캐시의 목적, 저장 정보, 개인정보 보호와의 관계를 비교한다.'
WHERE NOT EXISTS (
    SELECT 1 FROM topics
    WHERE title = '쿠키와 캐시는 어떤 차이가 있을까?'
);

INSERT INTO topics
(subject, task_type, interest, difficulty, title, description, research_direction)
SELECT '정보', '보고서', '보안', '어려움',
       '랜섬웨어는 컴퓨터의 파일을 어떻게 공격할까?',
       '랜섬웨어의 공격 원리와 데이터 보호 방법을 알아보는 주제',
       '랜섬웨어 감염 경로와 백업, 보안 업데이트 등 예방 방법을 조사한다.'
WHERE NOT EXISTS (
    SELECT 1 FROM topics
    WHERE title = '랜섬웨어는 컴퓨터의 파일을 어떻게 공격할까?'
);
 
 
 
 
 
 
 
SELECT * FROM topics;


USE topicpick;
SHOW TABLES;

USE topicpick;

SELECT COUNT(*) FROM topics;

SELECT id, title FROM topics;

SELECT DATABASE();


drop database topicpick;
drop table topics;