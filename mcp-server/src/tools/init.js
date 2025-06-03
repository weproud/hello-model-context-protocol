import { InitToolSchema } from '../../../dist/schemas/init.js';
import { executeInitTool } from '../../../dist/src/core/tools/init.js';
import logger from '../logger.js';

/**
 * Register Init tool with MCP server
 * @param {Object} server - FastMCP server instance
 */
export function registerInitTool(server) {
  server.addTool({
    name: 'init',
    description: 'Hello MCP 프로젝트를 초기화합니다',
    parameters: InitToolSchema,
    execute: async args => {
      try {
        logger.info('Init 도구 실행', args);

        // 공통 비즈니스 로직 사용
        const result = await executeInitTool(args);

        logger.info('Init 도구 완료', { result });

        return JSON.stringify(result);
      } catch (error) {
        logger.error('Init 도구 실행 중 오류 발생', {
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
  });
}
