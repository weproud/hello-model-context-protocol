#!/usr/bin/env node

/**
 * 간단한 MCP 클라이언트 테스트
 * stdio를 통해 MCP 서버와 통신하여 도구 목록을 확인
 */

import { spawn } from 'child_process';

async function testMCPClient() {
  console.log('🧪 MCP 클라이언트 테스트 시작...');
  
  try {
    // MCP 서버 프로세스 시작
    const serverProcess = spawn('npx', ['tsx', 'src/server/index.ts'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseData = '';
    
    // 서버 응답 수신
    serverProcess.stdout.on('data', (data) => {
      responseData += data.toString();
      console.log('📨 서버 응답:', data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
      console.log('📝 서버 로그:', data.toString());
    });

    // 서버가 시작될 때까지 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 2000));

    // MCP 초기화 요청 전송
    const initRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    };

    console.log('📤 초기화 요청 전송...');
    serverProcess.stdin.write(JSON.stringify(initRequest) + '\n');

    // 응답 대기
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 도구 목록 요청
    const toolsRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    };

    console.log('📤 도구 목록 요청 전송...');
    serverProcess.stdin.write(JSON.stringify(toolsRequest) + '\n');

    // 응답 대기
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 프로세스 종료
    serverProcess.kill();
    
    console.log('🎉 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  }
}

// 테스트 실행
testMCPClient();
