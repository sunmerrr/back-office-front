# Back Office V2 - CLAUDE.md

## 프로젝트 개요
포커룰루 백오피스 관리자 프론트엔드. React + Vite + TypeScript 기반.

## 기술 스택
- **Framework**: React 18.2 + Vite 5.2
- **Language**: TypeScript 5.2
- **Routing**: TanStack Router 1.77
- **Server State**: React Query 5.62
- **Client State**: Zustand 4.5
- **HTTP**: ky 1.7
- **UI**: Tailwind CSS 3.4 + shadcn/ui + Radix UI
- **Form**: TanStack Form 1.27 + Zod 4.3
- **Table**: TanStack Table 8.20

## 로컬 환경

### .env
```
VITE_API_URL=https://pokerlulu.io/api   # 프로덕션 API (로컬 개발 시 http://localhost:3000/api 로 변경)
VITE_SERVICE_URL=http://localhost:4400
VITE_APP_MODE=development
```

### 개발 서버 실행
```bash
npm run dev        # http://localhost:4400
npm run build      # 프로덕션 빌드
```

## 프로젝트 구조
```
src/
├── app/
│   ├── providers.tsx     # QueryClient + RouterProvider
│   └── router.tsx        # 라우트 정의 + auth guard
├── features/
│   ├── auth/             # 로그인, 토큰 관리
│   ├── users/            # 유저 목록/상세, 역할/상태 관리
│   ├── tickets/          # 티켓 CRUD + 지급
│   ├── messages/         # 메시지 CRUD
│   └── tournaments/      # 토너먼트 CRUD
└── shared/
    ├── api/              # ky 클라이언트 + 인터셉터
    ├── components/       # 공통 UI 컴포넌트
    ├── constants/        # config, date presets
    ├── stores/           # Zustand auth store
    ├── hooks/            # 공통 훅
    ├── types/            # 공유 타입
    └── utils/            # format, cn 유틸
```

## 라우트 구조
```
/auth/login          # 공개 - 로그인
/                    # 보호 - /users 리다이렉트
/users               # 유저 목록
/users/$userId       # 유저 상세
/tickets             # 티켓 관리
/messages            # 메시지 관리
/tournaments         # 토너먼트 관리
```

Auth guard: `beforeLoad`에서 `useAuthStore.getState().accessToken` 확인

## API 클라이언트
- `apiClient`: 공개용 ky 인스턴스 (타임아웃 30s, 재시도 2회)
- `authenticatedApiClient`: Bearer 토큰 자동 첨부, 401 시 토큰 갱신 or 로그인 리다이렉트

## 인증 흐름
1. 로그인 → accessToken + refreshToken 발급
2. Zustand store + localStorage에 저장
3. 모든 API 요청에 `Authorization: Bearer` 자동 첨부
4. 401 응답 → 토큰 갱신 시도 → 실패 시 로그인 페이지로
