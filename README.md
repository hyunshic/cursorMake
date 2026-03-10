# React + TypeScript + Spring Boot 프로젝트

이 프로젝트는 React + TypeScript를 프론트엔드로, Spring Boot를 백엔드로 사용하는 풀스택 애플리케이션입니다.

## 프로젝트 구조

```
cursorMake/
├── frontend/          # React + TypeScript 프론트엔드
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── backend/           # Spring Boot 백엔드
    ├── src/
    ├── build.gradle
    └── gradlew
```

## 사전 요구사항

- **Node.js** (v18 이상) - 프론트엔드 실행용
- **Java** (JDK 17 이상) - 백엔드 실행용
- **npm** 또는 **yarn** - 패키지 관리용

## 설치 및 실행

### 1. 프론트엔드 설정 및 실행

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 2. 백엔드 설정 및 실행

```bash
cd backend
./gradlew bootRun
```

또는 Windows의 경우:
```bash
gradlew.bat bootRun
```

백엔드는 `http://localhost:8080`에서 실행됩니다.

## 주요 기능

- **프론트엔드**: React 18 + TypeScript + Vite
- **백엔드**: Spring Boot 3.2.0 + Java 17
- **Spring Security**: 인증 및 권한 관리
- **중복 로그인 방지**: 동일 사용자의 중복 로그인 시 기존 세션 자동 종료
- **CORS 설정**: 프론트엔드와 백엔드 간 통신을 위한 CORS 설정 완료
- **API 프록시**: Vite 개발 서버에서 `/api` 요청을 백엔드로 프록시
- **세션 관리**: HttpSession 기반 인증

## API 엔드포인트

### 인증 관련
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보 조회

### 일반 API
- `GET /api/hello` - Hello 메시지 반환 (인증 필요)

## 개발 팁

- 프론트엔드와 백엔드를 동시에 실행해야 정상적으로 작동합니다.
- 백엔드가 먼저 실행된 후 프론트엔드를 실행하는 것을 권장합니다.
- 프론트엔드의 API 호출은 `/api` 경로를 통해 자동으로 백엔드로 프록시됩니다.

- localtest login 정보 root / test123