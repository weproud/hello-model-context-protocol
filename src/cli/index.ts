#!/usr/bin/env node

import { Command } from 'commander';
import { createAddCommand, showAddExamples } from './commands/add';
import {
  createFetchWeatherCommand,
  showFetchWeatherExamples,
} from './commands/fetchWeather';

/**
 * MCP CLI 도구 메인 프로그램
 */
function createCLI(): Command {
  const program = new Command();

  program
    .name('mcp-tool')
    .description('Model Context Protocol (MCP) 서버 도구들을 위한 CLI')
    .version('1.0.0');

  // Add 명령 추가
  program.addCommand(createAddCommand());

  // FetchWeather 명령 추가
  program.addCommand(createFetchWeatherCommand());

  // Examples 명령 추가
  const examplesCommand = new Command('examples');
  examplesCommand
    .description('사용 예시를 보여줍니다')
    .option(
      '-c, --command <command>',
      '특정 명령의 예시만 표시 (add|fetch-weather)'
    )
    .action((options: { command?: string }) => {
      if (options.command) {
        switch (options.command) {
          case 'add':
            showAddExamples();
            break;
          case 'fetch-weather':
            showFetchWeatherExamples();
            break;
          default:
            console.error(`❌ 알 수 없는 명령: ${options.command}`);
            console.log('사용 가능한 명령: add, fetch-weather');
            process.exit(1);
        }
      } else {
        console.log('🛠️  MCP CLI 도구 사용 예시\n');
        showAddExamples();
        console.log('');
        showFetchWeatherExamples();
        console.log('\n더 자세한 정보는 각 명령에 --help 옵션을 사용하세요.');
        console.log('예: mcp-tool add --help');
      }
    });

  program.addCommand(examplesCommand);

  // 도움말 개선
  program.on('--help', () => {
    console.log('');
    console.log('사용 예시:');
    console.log('  $ mcp-tool add 5 3');
    console.log('  $ mcp-tool fetch-weather Seoul');
    console.log('  $ mcp-tool examples');
    console.log('');
    console.log('더 많은 예시를 보려면:');
    console.log('  $ mcp-tool examples');
  });

  return program;
}

/**
 * CLI 실행
 */
async function main(): Promise<void> {
  const program = createCLI();

  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ CLI 실행 중 오류 발생: ${errorMessage}`);
    process.exit(1);
  }
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 예상치 못한 오류:', error);
    process.exit(1);
  });
}

export { createCLI };
