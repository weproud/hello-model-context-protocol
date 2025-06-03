import { FetchWeatherSchema } from '../../../src/schemas/fetchWeather.js';
import { executeFetchWeatherTool } from '../../../src/core/tools/weather.js';
import logger from '../logger.js';

/**
 * Register FetchWeather tool with MCP server
 * @param {Object} server - FastMCP server instance
 */
export function registerFetchWeatherTool(server) {
  server.addTool({
    name: 'fetchWeather',
    description: '지정된 도시의 날씨 정보를 가져옵니다',
    parameters: FetchWeatherSchema,
    execute: async args => {
      try {
        logger.info('FetchWeather 도구 실행', args);

        // 공통 비즈니스 로직 사용
        const result = await executeFetchWeatherTool(args);

        logger.info('FetchWeather 도구 완료', { result });

        return JSON.stringify(result);
      } catch (error) {
        logger.error('FetchWeather 도구 실행 중 오류 발생', {
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
  });
}
