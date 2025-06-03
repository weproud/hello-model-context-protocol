#!/usr/bin/env node

import { FastMCP } from 'fastmcp';

/**
 * 매우 간단한 MCP 서버 - 테스트용
 */
async function createSimpleMCPServer() {
  const server = new FastMCP({
    name: 'hello-mcp-simple',
    version: '1.0.0',
  });

  // 간단한 add 도구
  server.addTool({
    name: 'add',
    description: '두 숫자를 더합니다',
    parameters: {
      type: 'object',
      properties: {
        a: {
          type: 'number',
          description: '첫 번째 숫자'
        },
        b: {
          type: 'number', 
          description: '두 번째 숫자'
        }
      },
      required: ['a', 'b']
    },
    execute: async (args) => {
      const { a, b } = args as { a: number; b: number };
      const result = a + b;
      console.error(`[INFO] Add 도구 실행: ${a} + ${b} = ${result}`);
      return {
        result: result,
        message: `${a} + ${b} = ${result}`
      };
    }
  });

  // 간단한 hello 도구
  server.addTool({
    name: 'hello',
    description: '인사말을 반환합니다',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '이름'
        }
      },
      required: ['name']
    },
    execute: async (args) => {
      const { name } = args as { name: string };
      const message = `안녕하세요, ${name}님!`;
      console.error(`[INFO] Hello 도구 실행: ${message}`);
      return {
        message: message
      };
    }
  });

  // 간단한 리소스
  server.addResource({
    uri: 'simple://test',
    name: 'Test Resource',
    description: '테스트 리소스',
    mimeType: 'text/plain',
    load: async () => {
      return {
        text: 'Hello from simple MCP server!'
      };
    }
  });

  return server;
}

async function startSimpleServer() {
  try {
    console.error('[INFO] 간단한 MCP 서버 시작 중...');
    
    const server = await createSimpleMCPServer();
    
    console.error('[INFO] 서버 설정 완료, 시작 중...');
    
    await server.start({
      transportType: 'stdio'
    });
    
    console.error('[INFO] 간단한 MCP 서버가 성공적으로 시작되었습니다');
    
  } catch (error) {
    console.error('[ERROR] 서버 시작 실패:', error);
    process.exit(1);
  }
}

// 서버 시작
if (import.meta.url === `file://${process.argv[1]}`) {
  startSimpleServer();
  
  // 종료 시그널 처리
  process.on('SIGINT', () => {
    console.error('[INFO] 서버 종료 중...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.error('[INFO] 서버 종료 중...');
    process.exit(0);
  });
}

export { createSimpleMCPServer, startSimpleServer };
