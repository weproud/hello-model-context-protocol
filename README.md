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
├── src/                         # 소스 코드 루트 디렉토리
│   ├── server/                  # MCP 서버 로직
│   │   ├── tools/               # 도구 정의 (레거시)
│   │   │   ├── add.ts           # 예시 도구: 숫자 더하기
│   │   │   └── fetchWeather.ts  # 예시 도구: 날씨 가져오기
│   │   ├── resources/           # 자원 핸들러
│   │   │   └── logs.ts          # 예시 자원: 로그 파일
│   │   ├── prompts/             # 프롬프트 템플릿
│   │   └── index.ts             # FastMCP 서버 초기화
│   ├── schemas/                 # 🆕 도구별 스키마 정의
│   │   ├── add.ts               # Add 도구 스키마
│   │   ├── fetchWeather.ts      # FetchWeather 도구 스키마
│   │   └── index.ts             # 모든 스키마 export
│   ├── cli/                     # CLI 로직
│   │   ├── commands/            # CLI 명령 핸들러
│   │   │   ├── add.ts           # add 도구용 CLI 명령
│   │   │   └── fetchWeather.ts  # fetchWeather 도구용 CLI 명령
│   │   └── index.ts             # CLI 진입점
│   ├── lib/                     # 공유 유틸리티
│   │   └── fetch.ts             # API 호출용 fetch 유틸리티
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

## 🚀 FastMCP 구현 완료

이 프로젝트는 **FastMCP**를 사용하여 MCP 서버를 구현했습니다. FastMCP는 기존 MCP SDK보다 더 간단하고 직관적인 API를 제공합니다.

### 주요 특징

- ✅ **FastMCP 기반 서버**: 간단하고 효율적인 MCP 서버 구현
- ✅ **도구 지원**: `add` (숫자 더하기), `fetchWeather` (날씨 조회) 도구 제공
- ✅ **리소스 지원**: 애플리케이션 로그 리소스 제공
- ✅ **TypeScript 타입 안전성**: Zod 스키마를 통한 강력한 타입 검증
- ✅ **모듈화된 스키마**: 도구별로 분리된 스키마 관리
- ✅ **로깅 시스템**: 구조화된 로깅으로 디버깅 지원

### 🏗️ 스키마 아키텍처

이 프로젝트는 **도구별 스키마 분리** 아키텍처를 채택하여 다음과 같은 장점을 제공합니다:

#### 스키마 구조

```
src/schemas/
├── add.ts              # Add 도구 전용 스키마
├── fetchWeather.ts     # FetchWeather 도구 전용 스키마
└── index.ts            # 중앙 집중식 export
```

#### 장점

- **🔧 유지보수성**: 각 도구의 스키마가 독립적으로 관리됨
- **📦 모듈화**: 새로운 도구 추가 시 해당 스키마만 생성하면 됨
- **🔍 가독성**: 도구별로 스키마가 분리되어 코드 이해가 쉬움
- **🚀 확장성**: 대규모 프로젝트에서도 스키마 관리가 용이함
- **♻️ 재사용성**: 다른 프로젝트에서 특정 도구 스키마만 가져와 사용 가능

### 빠른 시작

#### 1. 의존성 설치

```bash
npm install
# 또는
pnpm install
```

#### 2. 개발 서버 실행

```bash
npm run dev
```

#### 3. 서버 빌드 및 실행

```bash
npm run build
npm start
```

### 사용 가능한 도구

#### Add 도구

두 숫자를 더하는 간단한 계산 도구입니다.

**매개변수:**

- `a` (number): 첫 번째 숫자
- `b` (number): 두 번째 숫자

**예시 응답:**

```json
{
  "result": 15,
  "calculation": "10 + 5 = 15"
}
```

#### FetchWeather 도구

지정된 위치의 날씨 정보를 조회합니다 (현재는 모의 데이터 반환).

**매개변수:**

- `location` (string): 날씨를 조회할 위치
- `units` (string, 선택사항): 온도 단위 ('celsius' 또는 'fahrenheit', 기본값: 'celsius')

**예시 응답:**

```json
{
  "location": "서울",
  "temperature": 22,
  "description": "맑음",
  "humidity": 65,
  "units": "celsius"
}
```

### 사용 가능한 리소스

#### Application Logs

애플리케이션의 로그 데이터에 접근할 수 있습니다.

**URI:** `logs://application`
**형식:** JSON

### MCP 클라이언트와 연결

이 서버는 Claude Desktop, Cursor 등의 MCP 클라이언트와 연결할 수 있습니다.

#### Claude Desktop 설정 예시

`claude_desktop_config.json` 파일에 다음과 같이 추가:

```json
{
  "mcpServers": {
    "hello-mcp": {
      "command": "node",
      "args": ["dist/server/index.js"],
      "cwd": "/path/to/hello-model-context-protocol"
    }
  }
}
```

### 개발 스크립트

- `npm run dev`: 개발 서버 실행 (tsx 사용)
- `npm run build`: TypeScript 빌드
- `npm start`: 빌드된 서버 실행
- `npm test`: 단위 테스트 실행
- `npm run test:e2e`: E2E 테스트 실행
- `npm run lint`: ESLint 검사
- `npm run format`: Prettier 포맷팅

### 🛠️ 새로운 도구 추가하기

스키마 분리 아키텍처 덕분에 새로운 도구를 쉽게 추가할 수 있습니다:

#### 1. 스키마 정의

`src/schemas/myTool.ts` 파일 생성:

```typescript
import { z } from 'zod';

export const MyToolSchema = z.object({
  input: z.string().describe('입력 매개변수'),
  // 추가 매개변수들...
});

export type MyToolInput = z.infer<typeof MyToolSchema>;

export interface MyToolResponse {
  result: string;
  // 응답 필드들...
}
```

#### 2. 스키마 export 추가

`src/schemas/index.ts`에 추가:

```typescript
export { MyToolSchema, type MyToolInput, type MyToolResponse } from './myTool';
```

#### 3. 서버에 도구 등록

`src/server/index.ts`에 추가:

```typescript
import { MyToolSchema } from '@/schemas';

// FastMCP 서버에 도구 추가
server.addTool({
  name: 'myTool',
  description: '새로운 도구 설명',
  parameters: MyToolSchema,
  execute: async args => {
    // 도구 로직 구현
    return JSON.stringify({ result: 'success' });
  },
});
```

이렇게 3단계만으로 새로운 도구를 추가할 수 있습니다! 🎉
