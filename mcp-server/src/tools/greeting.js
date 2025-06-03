import { GreetingToolSchema } from '../../../dist/src/schemas/greeting.js';
import { executeGreetingTool } from '../../../dist/src/core/tools/greeting.js';
import logger from '../logger.js';

/**
 * Register Greeting tool with MCP server
 * @param {Object} server - FastMCP server instance
 */
export function registerGreetingTool(server) {
  server.addTool({
    name: 'greeting',
    description:
      'Greeting 파일을 생성합니다 (.hellomcp 디렉토리에 hello-<name>.yaml 파일 생성)',
    parameters: GreetingToolSchema,
    execute: async args => {
      try {
        logger.info('Greeting 도구 실행', args);

        // 공통 비즈니스 로직 사용
        const result = await executeGreetingTool(args);

        logger.info('Greeting 도구 완료', { result });

        return JSON.stringify(result);
      } catch (error) {
        logger.error('Greeting 도구 실행 중 오류 발생', {
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
  });
}
