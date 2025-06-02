#!/bin/bash

# MCP Tool CLI 래퍼 스크립트
# 사용법: ./mcp-tool.sh [명령] [옵션]

# 스크립트가 위치한 디렉토리로 이동
cd "$(dirname "$0")"

# tsx를 사용해서 TypeScript CLI 실행
npx tsx src/cli/index.ts "$@"
