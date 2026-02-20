# Back Office V2

백오피스 관리자 시스템 (React + Vite)

## 기술 스택

- **프레임워크**: React 18 + Vite
- **라우팅**: TanStack Router
- **상태 관리**: Zustand
- **데이터 페칭**: TanStack React Query + ky
- **폼 핸들링**: @tanstack/react-form + zod
- **스타일링**: Tailwind CSS + shadcn/ui + Radix UI
- **타입**: TypeScript (with Git Submodules)
- **패키지 매니저**: Yarn Classic

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- Yarn Classic 1.x

### 설치 및 초기화

```bash
git clone <repository-url>
cd back-office-v2

yarn install

git submodule update --init --recursive
```

## Git 서브모듈 (공통 타입)

본 프로젝트는 여러 서비스 간의 공통 타입(Enums, Packets 등)을 공유하기 위해 Git Submodule을 사용합니다.

- **경로**: `src/shared/types/common`
- **관리**: 해당 디렉토리는 별도의 저장소와 연결되어 있으므로, 타입 변경 시 서브모듈 저장소의 업데이트가 필요할 수 있습니다.
- **빌드 주의**: `tsconfig.json`에서 외부 빌드 에러 방지를 위해 해당 경로가 일부 제외되어 있을 수 있습니다.

## 개발 서버 실행

```bash
yarn dev
```

### 빌드

```bash
yarn build

yarn preview
```

## 프로젝트 구조

```
src/
├── app/                    # 앱 설정 (router, providers)
├── features/              # Feature-based 구조
│   ├── auth/             # 인증
│   ├── tickets/          # 티켓 관리
│   ├── messages/         # 메시지 관리
│   ├── tournaments/       # 토너먼트 관리
│   └── users/            # 회원 관리
├── shared/                # 공통 모듈
│   ├── components/       # 공통 컴포넌트
│   ├── api/              # API 클라이언트 (Interceptor 포함)
│   ├── stores/           # 전역 상태 관리
│   ├── hooks/            # 공통 훅
│   ├── utils/            # 유틸리티 함수
│   └── types/            # 공통 타입
└── styles/               # 전역 스타일
```

## 주요 기능

### 🔐 인증 및 권한 관리
- JWT 기반 인증 (Access/Refresh Token)
- Role-based 접근 제어 (superadmin, admin, user)
- Interceptor를 통한 자동 토큰 갱신 및 만료 처리

### 🎫 티켓 관리
- 티켓 생성, 수정, 삭제
- 특정 유저 또는 그룹에게 티켓 발송 (Grant)
- 티켓 발송 이력 및 상태 조회

### 💬 메시지(공지사항) 관리
- 전체, 그룹, 특정 개인 대상 메시지 발송
- **이미지 첨부 기능** (S3 업로드 연동)
- **예약 발송** 시스템
- 발송 완료된 메시지 **재작성(복제)** 기능 지원
- 다국어(KO, EN, JA) 데이터 구조 지원 (현재 UI는 KO 입력 시 자동 동기화)

### 👥 회원 관리
- 회원 목록 검색 및 필터링
- 상세 정보 조회 (프로필, 자산 등)
- 권한(Role) 변경 및 계정 차단(Ban) 관리
- **결제/구독 히스토리 조회**
- 개인 메시지 및 티켓 개별 발송 기능

### 🏆 토너먼트 관리
- 토너먼트 목록 및 상태 조회

## UI/UX 특징

- **App-like Layout**: `body` 스크롤을 막고 내부 컨텐츠 영역만 스크롤되도록 처리하여 데스크탑 앱과 같은 사용성 제공.
- **Smart Forms**: 복잡한 입력 폼(2개 이상의 필드)에는 `@tanstack/react-form`과 `zod`를 적용하여 강력한 유효성 검사 수행.
- **Date Presets**: 날짜/시간 선택 시 '1시간 후', '내일 9시' 등 직관적인 프리셋 제공 (초 단위 00 초기화 보장).

## 환경 변수

`.env.example` 을 참고하여 환경변수를 작성하세요

## 스크립트

- `yarn dev` - 개발 서버 실행 (포트 4400)
- `yarn build` - 프로덕션 빌드
- `yarn preview` - 빌드 결과 프리뷰 (포트 3300)
- `yarn lint" - ESLint 실행
- `yarn lint:fix` - ESLint 자동 수정
- `yarn format` - Prettier 포맷팅
- `yarn type-check` - TypeScript 타입 체크
- `yarn setup:structure` - 폴더 구조 생성

## 개발 가이드

### 폴더 구조 생성

프로젝트 초기 설정 시 폴더 구조를 자동으로 생성합니다:

```bash
yarn setup:structure
```

### Feature 추가 방법

새로운 기능을 추가할 때는 `src/features/` 폴더에 다음 구조로 생성합니다:

```
features/
└── feature-name/
    ├── components/    # 컴포넌트
    ├── hooks/         # 커스텀 훅
    ├── api/           # API 함수
    ├── stores/        # Zustand store
    ├── schemas/       # Zod Validation Schema
    ├── types/         # 타입 정의
    └── pages/         # 페이지 컴포넌트
```

### 코딩 컨벤션

#### 폼 핸들링 (Form Handling)
- 입력 필드가 **2개를 초과**하는 경우, 반드시 `@tanstack/react-form`과 `zod`를 사용하여 구현합니다.
- 스키마는 `features/<feature>/schemas/` 디렉토리에서 관리합니다.

#### UI 컴포넌트 패턴 (shadcn/ui)
- **Compound Component Pattern**: shadcn/ui 라이브러리의 표준적인 컴포넌트 구성 방식을 따릅니다.
- 이는 사용 시 `<Card><CardHeader>...</CardHeader></Card>`와 같이 직관적이고 유연한 조립을 가능하게 합니다.

## 라이선스

Private

---

| **작성자** | @김여름(구) |
| --- | --- |
| **리뷰어** | @김여름(구) |
| **기여자** | @보라 박, @김여름(구) |
| **프로덕트 스펙** | [Back Office V2 스펙 문서](#) |

### 🔎 기술 스펙

- **프로젝트 기본**

| 카테고리 | 기술 | 버전 | 용도 |
| --- | --- | --- | --- |
| 프레임워크 | Vite | 5.2.0 | 빠르고 경량화된 빌드 도구 |
| UI 라이브러리 | React | 18.2.0 | 사용자 인터페이스 개발 |
| 라우팅 | TanStack Router | 1.77.0 | 타입 안전한 클라이언트 사이드 라우팅 |
| 언어 | TypeScript | 5.2.2 | 정적 타입을 통한 안정성 확보 |
| 스타일링 | Tailwind CSS | 3.4.1 | 유틸리티 퍼스트 CSS 프레임워크 |

- **상태 관리**

| 카테고리 | 기술 | 버전 | 용도 |
| --- | --- | --- | --- |
| 전역 상태 | Zustand | 4.5.0 | 심플하고 가벼운 전역 상태 관리 |
| 서버 상태 | React Query | 5.62.7 | 서버 데이터 페칭 및 캐싱 |

- **UI/UX 관련**

| 카테고리 | 기술 | 버전 | 용도 |
| --- | --- | --- | --- |
| 컴포넌트 | Radix UI | 1.x | 접근성 기반 UI 원시 컴포넌트 |
| 스타일링 | shadcn/ui | - | Radix UI 기반 고품질 컴포넌트 라이브러리 |
| 아이콘 | Lucide React | 0.446.0 | 일관된 디자인의 벡터 아이콘 |
| 폼 관리 | TanStack Form | 1.27.7 | 복잡한 폼 상태 및 유효성 관리 |
| 유효성 검사 | Zod | 4.3.5 | 스키마 기반 데이터 검증 |

- **빌드 및 도구**

| 카테고리 | 기술 | 버전 | 용도 |
| --- | --- | --- | --- |
| 패키지 매니저 | Yarn Classic | 1.22.x | 의존성 관리 도구 |
| 린터 | ESLint | 8.57.0 | 코드 품질 검사 |
| 포맷터 | Prettier | 3.2.5 | 자동 코드 스타일 교정 |

- **인증 및 통신**

| 카테고리 | 기술 | 버전 | 용도 |
| --- | --- | --- | --- |
| HTTP 클라이언트 | ky | 1.7.2 | 간결하고 강력한 Fetch API 래퍼 |
| 토큰 관리 | JWT | - | 브라우저 기반 인증 토큰 관리 |

- **유틸리티**

| 카테고리 | 기술 | 버전 | 용도 |
| --- | --- | --- | --- |
| 날짜 처리 | date-fns | 4.1.0 | 날짜 포맷팅 및 처리 |
| 날짜 조작 | dayjs | 1.11.13 | 경량 날짜 라이브러리 |
| 테이블 관리 | TanStack Table | 8.20.5 | 고도화된 데이터 테이블 핸들링 |
| 클래스 병합 | tailwind-merge | 2.5.2 | Tailwind 클래스 충돌 방지 및 병합 |

# 구조

### 파일 트리 구조

```
src/
├── app/                          # 앱 전역 설정 및 라우팅
│   ├── providers.tsx            # 전역 프로바이더 (Query, Router 등)
│   └── router.tsx               # 라우팅 정의 및 보호 로직
│
├── features/                     # 도메인 기반 기능 모듈 (Feature-based)
│   ├── auth/                    # 인증 관련 (로그인, 토큰 관리)
│   ├── tickets/                 # 티켓 관리 (생성, 발송, 이력)
│   ├── messages/                # 메시지/공지사항 관리 (이미지 업로드, 예약)
│   ├── tournaments/             # 토너먼트 관리
│   └── users/                   # 회원 관리 (프로필, 자산, 결제 내역)
│
├── shared/                       # 공통 재사용 모듈
│   ├── api/                     # API 클라이언트 및 인터셉터
│   ├── components/              # 공통 UI 컴포넌트 (Layout, UI Kit)
│   ├── constants/               # 공통 상수 (Config, Presets)
│   ├── hooks/                   # 공통 커스텀 훅
│   ├── types/                   # 공통 타입 및 Git Submodule (common)
│   └── utils/                   # 유틸리티 함수 (Format, Tailwind merge)
│
├── styles/                       # 전역 스타일 (CSS Variables, Tailwind base)
│
└── assets/                       # 정적 자원 (이미지, SVG 등)
```