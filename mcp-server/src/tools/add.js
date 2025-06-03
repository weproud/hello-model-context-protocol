import { AddToolSchema } from '../../../dist/schemas/add.js';
import { executeAddTool } from '../../../dist/src/core/tools/add.js';
import logger from '../logger.js';

/**
 * Register Add tool with MCP server
 * @param {Object} server - FastMCP server instance
 */
export function registerAddTool(server) {
  server.addTool({
    name: 'add',
    description: '두 숫자를 더합니다',
    parameters: AddToolSchema,
    execute: async args => {
      try {
        logger.info('Add 도구 실행', args);

        // 공통 비즈니스 로직 사용
        const result = executeAddTool(args);

        logger.info('Add 도구 완료', { result });

        return JSON.stringify(result);
      } catch (error) {
        logger.error('Add 도구 실행 중 오류 발생', {
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
  });
}
