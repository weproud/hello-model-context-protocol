#!/usr/bin/env node

/**
 * MCP 서버 테스트 스크립트
 * 현재는 mcp-server 디렉토리의 서버를 사용합니다
 */
async function testMCPServer() {
  try {
    console.log('🧪 MCP 서버 테스트 안내');
    console.log('');
    console.log('📋 현재 프로젝트는 mcp-server/ 디렉토리의 서버를 사용합니다');
    console.log('');
    console.log('🔧 MCP 서버 테스트 방법:');
    console.log('  1. MCP Inspector 실행: npm run inspect');
    console.log('  2. 개발 서버 실행: npm run dev:server');
    console.log('  3. 빌드 후 실행: npm run build && npm run start:server');
    console.log('');
    console.log('🌐 MCP Inspector URL: http://127.0.0.1:6274');
    console.log('');
    console.log('🎉 테스트 안내 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

// 스크립트 실행
testMCPServer();
