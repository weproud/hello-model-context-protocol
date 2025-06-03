import { SlackToolSchema } from '../../../dist/src/schemas/slack.js';
import { executeSlackTool } from '../../../dist/src/core/tools/slack.js';
import logger from '../logger.js';

/**
 * Register Slack tool with MCP server
 * @param {Object} server - FastMCP server instance
 */
export function registerSlackTool(server) {
  server.addTool({
    name: 'send_message_slack',
    description:
      'Slack으로 메시지를 전송합니다 (SLACK_WEBHOOK_URL 환경변수 필요)',
    parameters: SlackToolSchema,
    execute: async args => {
      try {
        logger.info('Slack 도구 실행', args);

        // 공통 비즈니스 로직 사용
        const result = await executeSlackTool(args);

        logger.info('Slack 도구 완료', { result });

        return JSON.stringify(result);
      } catch (error) {
        logger.error('Slack 도구 실행 중 오류 발생', {
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
  });
}
