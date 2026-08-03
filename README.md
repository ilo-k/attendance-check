# 출석체크 (attendance-check)

무인 매장용 QR 출석체크 서비스. 매장에 고정된 QR을 로그인한 상태에서 스캔하면 본인 이름으로 공용 캘린더에 출석이 기록된다. 오전/오후 각각 선착순 1명만 체크인할 수 있다.

## 구조

- `backend/` — Express + Prisma(PostgreSQL) API 서버
- `frontend/` — React(Vite) SPA

## 로컬 실행

### 백엔드

```bash
cd backend
cp .env.example .env   # DATABASE_URL, JWT_SECRET 채우기
npm install
npx prisma migrate dev
npm run dev
```

### 프론트엔드

```bash
cd frontend
cp .env.example .env   # VITE_API_URL을 백엔드 주소로 설정
npm install
npm run dev
```

## 배포

- **프론트엔드**: GitHub Pages. `.github/workflows/deploy-frontend.yml`이 `main` 브랜치 push 시 자동 빌드/배포한다. 레포 이름이 `attendance-check`가 아니라면 `frontend/vite.config.js`의 `base` 경로와 워크플로의 `VITE_BASE_PATH`를 레포 이름에 맞게 수정할 것.
- **백엔드**: Render 같은 Node 호스팅에 배포. Render에서 GitHub 레포를 연결하면 push마다 자동 배포된다. 환경변수(`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`)를 Render 대시보드에 설정.
- **DB**: Supabase(PostgreSQL) 프로젝트를 만들고 연결 문자열을 `DATABASE_URL`에 사용.

## QR 코드

매장에 비치할 QR은 프론트엔드의 `/checkin` 경로(배포된 도메인 기준)를 가리키면 된다. 로그인 상태면 즉시 체크인이 시도되고, 로그인 전이면 로그인 후 자동으로 체크인 페이지로 돌아온다.
