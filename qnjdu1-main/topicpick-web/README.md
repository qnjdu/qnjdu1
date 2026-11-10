# TopicPick Vercel 배포 가이드

구성: 정적 페이지(index.html) + Vercel 서버 함수(api/) + Supabase(로그인·DB만 사용).
Gemini·네이버 키와 Supabase service_role 키는 Vercel 환경변수에만 넣어요.

## 1. Supabase 준비 (로그인·DB)
1. https://supabase.com 가입 → New project (무료, 리전 Seoul 권장)
2. **Authentication → Sign In / Providers → Email**: `Confirm email` 을 **끄기** (아이디만으로 가입하므로 필수)
3. **SQL Editor**에 `supabase/schema.sql` 전체를 붙여 넣고 Run
4. **Project Settings → API**에서 아래 세 값을 메모
   - Project URL
   - anon public 키 → 브라우저용(공개돼도 됨)
   - service_role 키 → 서버용(절대 공개 금지)

## 2. config.js 채우기
`SUPABASE_URL`, `SUPABASE_ANON_KEY` 두 값만 넣어요. (service_role 키는 넣지 마세요)

## 3. GitHub에 올리고 Vercel 연결
1. 이 폴더를 GitHub 저장소로 올려요. (config.js의 anon 키는 공개돼도 괜찮아요)
2. https://vercel.com → Add New → Project → 저장소 선택 → Framework Preset은 **Other**, 빌드 설정은 그대로 → Deploy 전에 **Environment Variables** 입력

| 이름 | 값 |
|---|---|
| SUPABASE_URL | Project URL |
| SUPABASE_SERVICE_ROLE_KEY | service_role 키 |
| GEMINI_API_KEY | https://aistudio.google.com 에서 발급 |
| NAVER_CLIENT_ID / NAVER_CLIENT_SECRET | (선택) 네이버 개발자센터 검색 API |
| GEMINI_MODEL | (선택) 기본 gemini-2.5-flash-lite |

3. Deploy. 환경변수를 나중에 바꾸면 Deployments에서 Redeploy 해야 반영돼요.
네이버 키가 없으면 자료 화면에 검색 링크만 나와요.

## 알아 둘 점
- 아이디는 내부적으로 `아이디@topicpick.app` 형태의 이메일로 저장돼요. 가입이 "invalid email"로 거절되면 config.js의 AUTH_DOMAIN을 본인 도메인으로 바꿔요.
- 이메일이 없어서 비밀번호 찾기는 지원하지 않아요.
- 8초 간격 제한은 서버(ai_log 표)에서 확인해요.
- 네이버 결과 캐시는 서버 함수 메모리에 있어서 일정 시간 뒤 초기화될 수 있어요.
- Supabase 무료 플랜은 일주일간 접속이 없으면 일시 정지될 수 있어요(대시보드에서 다시 켜기).
