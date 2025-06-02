#!/usr/bin/env node

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// 프로젝트 루트 디렉토리 (ES 모듈 방식)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = __dirname;
const cliPath = join(projectRoot, 'src', 'cli', 'index.ts');

// tsx를 사용해서 TypeScript 파일 직접 실행
const args = ['tsx', cliPath, ...process.argv.slice(2)];

const child = spawn('npx', args, {
  stdio: 'inherit',
  cwd: projectRoot,
});

child.on('exit', code => {
  process.exit(code || 0);
});

child.on('error', error => {
  console.error('❌ mcp-tool 실행 중 오류 발생:', error.message);
  process.exit(1);
});
