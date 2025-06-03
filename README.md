Model Context Protocol (MCP) 서버 및 CLI 도구 개발 프로젝트

프로젝트 요구사항 문서 (PRD)

최종 확정본

이 문서는 Node.js, TypeScript, FastMCP를 사용하여 개발될 MCP 서버와 Commander.js를 사용한 CLI 도구 프로젝트의 최종 요구사항을 명시합니다.

---

### 1. 프로젝트 개요

#### 1.1 목적

이 PRD는 Node.js, TypeScript 및 FastMCP를 사용하여 구축될 Model Context Protocol (MCP) 서버의 설정 및 구조를 설명합니다. 이 서버는 거대 언어 모델(LLMs)이 외부 시스템과 상호작용하기 위한 도구(tools), 자원(resources) 및 프롬프트(prompts)를 노출합니다. `Commander.js`로 구축될 CLI 도구는 MCP 서버의 도구 기능을 복제하여 서버와 CLI 인터페이스 간의 일관성을 보장합니다.

#### 1.2 목표

- `Node.js` 및 `TypeScript`에서 `FastMCP`를 사용하여 확장 가능한 MCP 서버를 개발합니다.
- LLM 통합을 위한 MCP 도구 (예: `add`, `fetchWeather`) 및 자원을 노출합니다.
- MCP 서버 도구를 미러링하는 `Commander.js` 기반 CLI를 구현합니다.
- `TypeScript`를 통한 타입 안전성 및 `Zod`를 통한 스키마 유효성 검사를 보장합니다.
- MCP Inspector를 사용한 로컬 테스트 및 MCP 클라이언트 (예: Claude Desktop)와의 통합을 지원합니다.
- `ESLint`, `Prettier`를 통한 코드 품질 유지 및 `Vitest`와 `Playwright`를 통한 테스트를 수행합니다.

### 2. 기술 스택

프로젝트는 다음과 같은 핵심 기술 스택을 사용합니다.

- 프레임워크: `Node.js` with `FastMCP`
- 언어: `TypeScript`
- 패키지 관리자: `pnpm`
- MCP 프레임워크: `FastMCP` (`TypeScript`)
- 유효성 검사: `Zod` (도구 매개변수 스키마용)
- CLI 도구: `Commander.js` (CLI 명령 구축용)
- 린팅 & 포맷팅: `ESLint`, `Prettier`
- 테스팅: `Vitest` (단위/통합), `Playwright` (E2E)
- 전송 방식 (Transports): `Stdio` (로컬), `HTTP SSE` (원격)
- 주요 의존성:
  - `@modelcontextprotocol/sdk` (공식 MCP SDK)
  - `fastmcp` (MCP용 TypeScript 프레임워크)
  - `zod` (스키마 유효성 검사)
  - `commander` (CLI 프레임워크)
- 개발 의존성:
  - `typescript`
  - `@types/node`
  - `vitest`
  - `@playwright/test`
  - `eslint`
  - `prettier`

### 3. 프로젝트 패키지 구조

본 프로젝트의 패키지 구조는 다음과 같습니다. 각 디렉토리와 파일은 프로젝트의 특정 기능 및 설정을 담당합니다.

```
hello-model-context-protocol/
├── mcp-server/                  # 🆕 실제 MCP 서버 (FastMCP 기반)
│   ├── src/                     # MCP 서버 소스 코드
│   │   ├── tools/               # 도구 정의
│   │   │   ├── add.js           # 예시 도구: 숫자 더하기
│   │   │   ├── fetchWeather.js  # 예시 도구: 날씨 가져오기
│   │   │   ├── init.js          # 예시 도구: 프로젝트 초기화
│   │   │   └── index.js         # 모든 도구 등록
│   │   ├── index.js             # MCP 서버 메인 클래스
│   │   └── logger.js            # 로깅 유틸리티
│   └── server.js                # MCP 서버 진입점
├── src/                         # 공유 소스 코드
│   ├── schemas/                 # 🆕 도구별 스키마 정의
│   │   ├── add.ts               # Add 도구 스키마
│   │   ├── fetchWeather.ts      # FetchWeather 도구 스키마
│   │   ├── init.ts              # Init 도구 스키마
│   │   └── index.ts             # 모든 스키마 export
│   ├── core/                    # 🆕 공유 유틸리티 및 비즈니스 로직
│   │   ├── tools/               # 공통 비즈니스 로직
│   │   │   ├── add.ts           # Add 도구 로직
│   │   │   ├── fetchWeather.ts  # FetchWeather 도구 로직
│   │   │   ├── init.ts          # Init 도구 로직
│   │   │   └── index.ts         # 모든 도구 로직 export
│   │   └── fetch.ts             # 공통 유틸리티 (Logger 등)
│   ├── cli/                     # CLI 로직
│   │   ├── commands/            # CLI 명령 핸들러
│   │   │   ├── add.ts           # add 도구용 CLI 명령
│   │   │   └── fetchWeather.ts  # fetchWeather 도구용 CLI 명령
│   │   └── index.ts             # CLI 진입점
│   └── types/                   # 공통 TypeScript 타입 정의
├── tests/                       # 테스트 코드
│   ├── unit/                    # Vitest 단위 테스트
│   └── e2e/                     # Playwright E2E 테스트
├── .eslintrc.json               # ESLint 설정 파일
├── .prettierrc                  # Prettier 설정 파일
├── tsconfig.json                # TypeScript 설정 파일
├── package.json                 # npm/pnpm 패키지 설정 파일
├── vitest.config.ts             # Vitest 설정 파일
├── playwright.config.ts         # Playwright 설정 파일
└── README.md                    # 프로젝트 설명 파일
```

### 4. 기능 요구사항

#### 4.1 핵심 기능

- MCP 서버:
  - LLMs가 작업을 수행하기 위한 도구 (예: `add`, `fetchWeather`)를 노출합니다.
  - LLM 컨텍스트를 위한 자원 (예: 파일 내용, API 데이터)을 노출합니다.
  - 재사용 가능한 상호작용 템플릿을 위한 프롬프트를 지원합니다.
  - `stdio` (로컬) 및 `HTTP SSE` (원격) 전송 방식 모두를 지원합니다.
  - Claude Desktop 또는 Cursor와 같은 MCP 클라이언트와 통합됩니다.
- CLI 도구:
  - MCP 서버 도구를 미러링하는 명령 (예: `mcp-tool add`, `mcp-tool fetch-weather`)을 제공합니다.
  - 일관성을 보장하기 위해 MCP 서버 도구와 동일한 로직을 공유합니다.
  - `Commander.js`를 통해 명령줄 인수 및 옵션을 지원합니다.
- 인증: 원격 MCP 서버 액세스를 위한 OAuth 프록시를 지원합니다 (선택 사항).
- 테스팅: `Vitest`를 사용한 도구 및 CLI 명령 단위 테스트, `Playwright`를 사용한 서버 및 CLI E2E 테스트를 포함합니다.

#### 4.2 비기능 요구사항

- 성능: 낮은 지연 시간의 도구 실행 및 자원 검색을 위해 최적화합니다.
- 확장성: 상태 저장 상호작용을 위한 세션 관리를 지원합니다.
- 타입 안전성: 엄격한 타입 검사 및 스키마 유효성 검사를 위해 `TypeScript`와 `Zod`를 사용합니다.
- 보안: 입력을 살균(sanitize)하고 자원에 대한 접근 제어를 구현합니다.
- 코드 품질: `ESLint` 및 `Prettier` 규칙을 강제합니다.
- 문서화: 서버 설정, CLI 사용법, 도구 정의에 대한 명확한 문서를 제공합니다.

## 🔄 공통 비즈니스 로직 아키텍처

이 프로젝트는 **DRY(Don't Repeat Yourself) 원칙**을 따라 CLI와 MCP 서버에서 동일한 비즈니스 로직을 공유합니다.

### 구조

```
src/lib/tools/
├── add.ts              # Add 도구 핵심 비즈니스 로직
├── weather.ts          # Weather 도구 핵심 비즈니스 로직
└── index.ts            # 모든 도구 로직 export
```

### 장점

- **🚫 중복 제거**: CLI와 MCP 서버에서 동일한 로직을 재사용
- **🔧 유지보수성**: 비즈니스 로직 변경 시 한 곳만 수정
- **🧪 테스트 용이성**: 핵심 로직을 독립적으로 테스트 가능
- **📏 일관성**: CLI와 MCP 서버의 동작이 항상 일치
- **🔌 인터페이스 분리**: 비즈니스 로직과 인터페이스 로직 분리

### 사용 예시

```typescript
// CLI에서 사용
import { addNumbers } from '@/lib/tools';
const result = addNumbers(5, 3);

// MCP 서버에서 사용
import { executeAddTool } from '@/lib/tools';
const result = executeAddTool({ a: 5, b: 3 });
```

## 🔍 MCP Inspector 사용법

MCP Inspector는 MCP 서버를 웹 UI로 테스트하고 디버깅할 수 있는 공식 도구입니다.

### MCP Inspector 실행

#### 방법 1: npm 스크립트 사용 (권장)

```bash
# TypeScript 소스 파일로 직접 실행
npm run inspect

# 빌드된 JavaScript 파일로 실행
npm run build
npm run inspect:built
```

#### 방법 2: 편리한 스크립트 사용

```bash
# 실행 권한 부여 (최초 1회)
chmod +x scripts/inspect.sh

# TypeScript 파일로 실행
./scripts/inspect.sh

# 빌드된 JavaScript 파일로 실행
./scripts/inspect.sh --built

# 도움말 보기
./scripts/inspect.sh --help
```

#### 방법 3: FastMCP 직접 사용

```bash
# TypeScript 파일로 실행
npx fastmcp inspect src/server/index.ts

# JavaScript 파일로 실행 (빌드 후)
npx fastmcp inspect dist/server/index.js
```

### MCP Inspector 사용 방법

1. **서버 시작**: 위 명령어 중 하나를 실행하면 웹 브라우저가 자동으로 열립니다
2. **도구 테스트**: 웹 UI에서 `add`, `fetchWeather` 도구를 직접 테스트할 수 있습니다
3. **리소스 확인**: `logs://application` 리소스를 확인할 수 있습니다
4. **실시간 디버깅**: 서버 로그와 요청/응답을 실시간으로 확인할 수 있습니다

### MCP Inspector 기능

- **🛠️ 도구 테스트**: 각 MCP 도구를 웹 UI에서 직접 실행
- **📊 리소스 탐색**: 서버에서 제공하는 리소스 확인
- **🔍 실시간 로그**: 서버 동작 상태 모니터링
- **📝 스키마 확인**: 도구 매개변수 스키마 검증
- **🚀 빠른 프로토타이핑**: 새로운 도구 개발 시 즉시 테스트

### 예시 테스트 시나리오

#### Add 도구 테스트

1. MCP Inspector 실행
2. "Tools" 탭에서 "add" 도구 선택
3. 매개변수 입력: `{"a": 5, "b": 3}`
4. "Execute" 버튼 클릭
5. 결과 확인: `{"result": 8, "calculation": "5 + 3 = 8"}`

#### FetchWeather 도구 테스트

1. "Tools" 탭에서 "fetchWeather" 도구 선택
2. 매개변수 입력: `{"location": "Seoul", "units": "celsius"}`
3. "Execute" 버튼 클릭
4. 결과 확인: 날씨 정보 JSON

#### 로그 리소스 확인

1. "Resources" 탭에서 "logs://application" 선택
2. 애플리케이션 로그 데이터 확인

## 🖥️ CLI 사용법

### 직접 `mcp-tool` 명령 사용하기

#### 방법 1: npm 스크립트 사용 (권장)

```bash
npm run mcp-tool -- add 5 3
npm run mcp-tool -- fetch-weather Seoul --verbose
npm run mcp-tool -- examples
npm run mcp-tool -- --help
```

#### 방법 2: bash 스크립트 사용

```bash
# 실행 권한 부여 (최초 1회)
chmod +x mcp-tool.sh

# 사용
./mcp-tool.sh add 5 3
./mcp-tool.sh fetch-weather Seoul --verbose
./mcp-tool.sh examples
./mcp-tool.sh --help
```

#### 방법 3: 직접 실행

```bash
npx tsx src/cli/index.ts add 5 3
npx tsx src/cli/index.ts fetch-weather Seoul --verbose
npx tsx src/cli/index.ts examples
npx tsx src/cli/index.ts --help
```

#### 방법 4: 전역 설치 (선택사항)

```bash
# 프로젝트를 전역으로 링크
npm link

# 이후 어디서든 사용 가능
mcp-tool add 5 3
mcp-tool fetch-weather Seoul --verbose
mcp-tool examples
mcp-tool --help
```

### CLI 명령 예시

#### Add 명령

```bash
# 기본 사용법
npm run mcp-tool -- add 10 5
# 결과: 15

# 상세 출력
npm run mcp-tool -- add 10.5 2.3 --verbose
# 결과:
# ✅ 계산 완료:
#    입력: 10.5, 2.3
#    결과: 12.8
#    계산식: 10.5 + 2.3 = 12.8
```

#### FetchWeather 명령

```bash
# 기본 사용법
npm run mcp-tool -- fetch-weather Seoul
# 결과: Seoul: 22°C, 맑음

# 화씨 단위로 조회
npm run mcp-tool -- fetch-weather "New York" --units fahrenheit
# 결과: New York: 72°F, 맑음

# 상세 출력
npm run mcp-tool -- fetch-weather Tokyo --verbose
# 결과:
# 🌤️ 날씨 정보 조회 완료:
#    위치: Tokyo
#    온도: 22°C
#    상태: 맑음
#    습도: 65%
#    단위: celsius
```

#### Examples 명령

```bash
# 모든 예시 보기
npm run mcp-tool -- examples

# 특정 명령 예시만 보기
npm run mcp-tool -- examples --command add
npm run mcp-tool -- examples --command fetch-weather
```
