# Cursor MCP 서버 설정 가이드

## ⚠️ 중요: 현재 권장 방법

현재 빌드 과정에서 일부 경로 문제가 있어서, **TypeScript 파일을 직접 실행하는 방법을 권장**합니다.

## 1. Cursor MCP 서버 설정

### 권장 방법: TypeScript 파일 직접 실행

1. Cursor를 열고 설정으로 이동합니다 (Cmd/Ctrl + ,)
2. "mcp" 또는 "Model Context Protocol"을 검색합니다
3. MCP 서버 설정에서 다음 내용을 추가합니다:

```json
{
  "mcpServers": {
    "hello-mcp": {
      "command": "npx",
      "args": [
        "tsx",
        "/Users/raiiz/madeinnook/workspace/hello-model-context-protocol/src/server/index.ts"
      ],
      "env": {},
      "cwd": "/Users/raiiz/madeinnook/workspace/hello-model-context-protocol"
    }
  }
}
```

### 대안 방법: 빌드된 JavaScript 파일 사용 (현재 문제 있음)

빌드 문제가 해결되면 다음 설정을 사용할 수 있습니다:

```json
{
  "mcpServers": {
    "hello-mcp-build": {
      "command": "node",
      "args": [
        "/Users/raiiz/madeinnook/workspace/hello-model-context-protocol/mcp-server/server.js"
      ],
      "env": {}
    }
  }
}
```

## 3. 설정 파일 위치

Cursor의 MCP 서버 설정은 다음 위치에 저장됩니다:

- **macOS**: `~/.cursor/mcp_servers.json`
- **Windows**: `%APPDATA%\Cursor\mcp_servers.json`
- **Linux**: `~/.config/cursor/mcp_servers.json`

## 4. 설정 적용

1. 위의 JSON 설정을 Cursor의 MCP 서버 설정에 추가합니다
2. Cursor를 재시작합니다
3. 새로운 채팅을 시작하면 hello-mcp 서버의 도구들을 사용할 수 있습니다

## 5. 사용 가능한 도구들

등록된 MCP 서버에서 다음 도구들을 사용할 수 있습니다:

- `add`: 두 숫자를 더하는 도구
- `fetchWeather`: 날씨 정보를 가져오는 도구
- `init`: .hellomcp 디렉토리와 hello.yaml 파일을 생성하는 도구

## 6. 테스트

Cursor에서 다음과 같이 테스트해볼 수 있습니다:

```
"5와 3을 더해줘"
"서울의 날씨를 알려줘"
"프로젝트를 초기화해줘"
```

## 7. 디버깅

MCP 서버가 제대로 작동하지 않는 경우:

1. 터미널에서 직접 실행해보기:

   ```bash
   node mcp-server/server.js
   ```

2. fastmcp inspector로 테스트:

   ```bash
   npm run inspect
   ```

3. Cursor의 개발자 도구에서 MCP 관련 로그 확인

## 8. 주의사항

- 경로는 절대 경로를 사용해야 합니다
- Node.js 18 이상이 필요합니다
- 프로젝트가 빌드되어 있어야 합니다 (방법 1 사용 시)
