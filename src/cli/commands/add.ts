import { Command } from 'commander';
import { addNumbers } from '@/server/tools/add';
import { Logger } from '@/lib/fetch';

/**
 * Add 명령을 위한 CLI 핸들러
 */
export function createAddCommand(): Command {
  const addCommand = new Command('add');
  
  addCommand
    .description('두 숫자를 더합니다')
    .argument('<a>', '첫 번째 숫자', parseFloat)
    .argument('<b>', '두 번째 숫자', parseFloat)
    .option('-v, --verbose', '상세한 출력 표시')
    .action(async (a: number, b: number, options: { verbose?: boolean }) => {
      try {
        if (isNaN(a) || isNaN(b)) {
          console.error('❌ 오류: 유효한 숫자를 입력해주세요.');
          process.exit(1);
        }
        
        if (options.verbose) {
          Logger.info('Add 명령 실행 시작', { a, b });
        }
        
        const result = await addNumbers(a, b);
        
        if (options.verbose) {
          console.log('✅ 계산 완료:');
          console.log(`   입력: ${a}, ${b}`);
          console.log(`   결과: ${result.result}`);
          console.log(`   계산식: ${result.calculation}`);
        } else {
          console.log(result.result);
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ 오류: ${errorMessage}`);
        
        if (options.verbose) {
          Logger.error('Add 명령 실행 실패', { error: errorMessage });
        }
        
        process.exit(1);
      }
    });
  
  return addCommand;
}

/**
 * Add 명령 예시 사용법 출력
 */
export function showAddExamples(): void {
  console.log('Add 명령 사용 예시:');
  console.log('  mcp-tool add 5 3');
  console.log('  mcp-tool add 10.5 2.3 --verbose');
  console.log('  mcp-tool add -1 5');
}
