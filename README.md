# 출석체크 (attendance-check)

무인 매장용 QR 출석체크 서비스. 매장에 고정된 QR을 로그인한 상태에서 스캔하면 본인 닉네임으로 공용 캘린더에 출석이 기록된다. 오전/오후 각각 선착순 1명만 체크인할 수 있다. 로그인은 Google OAuth를 사용하며, 첫 로그인 시 캘린더에 표시할 닉네임을 한 번 입력한다.

## 구조

- `backend/` — Express + Prisma(PostgreSQL) API 서버
- `frontend/` — React(Vite) SPA

## Google OAuth 클라이언트 ID 발급

1. [Google Cloud Console](https://console.cloud.google.com/) → 프로젝트 생성(또는 기존 프로젝트 사용)
2. "API 및 서비스 → OAuth 동의 화면"에서 외부(External) 유형으로 설정, 앱 이름 등 기본 정보 입력
3. "사용자 인증 정보 → 사용자 인증 정보 만들기 → OAuth 클라이언트 ID" → 애플리케이션 유형: **웹 애플리케이션**
4. **승인된 자바스크립트 원본**에 다음을 추가:
   - `http://localhost:5173` (로컬 개발용)
   - `https://<github-username>.github.io` (배포용, 예: `https://ilo-k.github.io`)
5. 생성된 **클라이언트 ID**(`xxxxx.apps.googleusercontent.com` 형태, Client Secret은 불필요)를 프론트엔드의 `VITE_GOOGLE_CLIENT_ID`와 백엔드의 `GOOGLE_CLIENT_ID`에 동일하게 설정

## 로컬 실행

### 백엔드

```bash
cd backend
cp .env.example .env   # DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID 채우기
npm install
npx prisma migrate dev
npm run dev
```

### 프론트엔드

```bash
cd frontend
cp .env.example .env   # VITE_API_URL, VITE_GOOGLE_CLIENT_ID 채우기
npm install
npm run dev
```

## 배포

- **프론트엔드**: GitHub Pages. `.github/workflows/deploy-frontend.yml`이 `main` 브랜치 push 시 자동 빌드/배포한다. 레포 이름이 `attendance-check`가 아니라면 `frontend/vite.config.js`의 `base` 경로와 워크플로의 `VITE_BASE_PATH`를 레포 이름에 맞게 수정할 것. 저장소 Settings → Secrets and variables → Actions → Variables에서 `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`를 설정해야 한다.
- **백엔드**: Render 같은 Node 호스팅에 배포. Render에서 GitHub 레포를 연결하면 push마다 자동 배포된다. 환경변수(`DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `CORS_ORIGIN`)를 Render 대시보드에 설정.
- **DB**: Supabase(PostgreSQL) 프로젝트를 만들고 연결 문자열을 `DATABASE_URL`에 사용.

## QR 코드

매장에 비치할 QR은 프론트엔드의 `/checkin` 경로(배포된 도메인 기준)를 가리키면 된다. 로그인 상태면 즉시 체크인이 시도되고, 로그인 전이면 로그인 후 자동으로 체크인 페이지로 돌아온다.
