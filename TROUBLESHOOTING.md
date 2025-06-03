# Cursor MCP 서버 문제 해결 가이드

## 🔧 발견된 문제와 해결책

### 1. 주요 문제: 경로 및 의존성 문제

**문제**:

- `mcp-server/server.js`에서 `dotenv` 의존성 누락
- MCP 서버 도구들이 잘못된 경로 참조
- 빌드 과정에서 경로 불일치

**해결책**:

- TypeScript 파일을 직접 실행하는 방식으로 변경
- `mcp-server/src/index.ts` 파일 사용 (현재 구조)

### 2. 현재 작동하는 설정

```json
{
  "mcpServers": {
    "hello-mcp": {
      "command": "npx",
      "args": [
        "tsx",
        "/Users/raiiz/madeinnook/workspace/hello-model-context-protocol/mcp-server/src/index.ts"
      ],
      "env": {},
      "cwd": "/Users/raiiz/madeinnook/workspace/hello-model-context-protocol"
    }
  }
}
```

## 🚀 Cursor에서 MCP 서버 등록 단계

### 1. Cursor 설정 열기

- Cursor 실행
- `Cmd/Ctrl + ,` 또는 메뉴에서 Settings 선택

### 2. MCP 설정 찾기

- 설정 검색창에 "mcp" 입력
- "Model Context Protocol" 섹션 찾기

### 3. 서버 설정 추가

- 위의 JSON 설정을 MCP 서버 설정에 추가
- 경로가 정확한지 확인 (절대 경로 사용)

### 4. Cursor 재시작

- 설정 저장 후 Cursor 완전히 종료
- Cursor 다시 시작

## 🧪 테스트 방법

### 1. 서버 독립 실행 테스트

```bash
npx tsx mcp-server/src/index.ts
```

성공 시 다음과 같은 메시지가 표시됩니다:

```
[INFO] FastMCP 서버 초기화 중...
[INFO] FastMCP 서버 시작 중...
[INFO] FastMCP 서버가 성공적으로 시작되었습니다
```

### 2. Cursor에서 테스트

새로운 채팅에서 다음 명령어들을 시도해보세요:

- "5와 3을 더해줘" (add 도구)
- "서울의 날씨를 알려줘" (fetchWeather 도구)
- "프로젝트를 초기화해줘" (init 도구)

## ❌ 일반적인 오류와 해결책

### 1. "Cannot find module" 오류

**원인**: 경로가 잘못되었거나 파일이 존재하지 않음
**해결**: 절대 경로 사용 및 파일 존재 확인

### 2. "dotenv" 관련 오류

**원인**: 불필요한 dotenv 의존성
**해결**: TypeScript 파일 직접 실행 방식 사용

### 3. Cursor에서 도구가 인식되지 않음

**원인**:

- 설정이 제대로 적용되지 않음
- 서버 시작 실패
- 경로 문제

**해결**:

1. Cursor 완전히 재시작
2. 서버 독립 실행으로 테스트
3. 경로 다시 확인
4. Cursor 개발자 도구에서 오류 로그 확인

### 4. 권한 문제

**원인**: 파일 실행 권한 부족
**해결**:

```bash
chmod +x src/server/index.ts
```

## 📝 디버깅 팁

### 1. 로그 확인

- Cursor 개발자 도구 열기 (Cmd/Ctrl + Shift + I)
- Console 탭에서 MCP 관련 오류 확인

### 2. 서버 상태 확인

```bash
# 서버가 실행 중인지 확인
ps aux | grep tsx

# 포트 사용 확인
lsof -i :3000
```

### 3. 설정 파일 위치 확인

- macOS: `~/.cursor/mcp_servers.json`
- Windows: `%APPDATA%\Cursor\mcp_servers.json`
- Linux: `~/.config/cursor/mcp_servers.json`

## 🔄 다음 단계

1. **빌드 문제 해결**: 경로 문제를 해결하여 빌드된 JavaScript 파일도 사용할 수 있도록 개선
2. **의존성 정리**: 불필요한 의존성 제거 및 정리
3. **테스트 자동화**: MCP 서버 테스트 자동화 구축
