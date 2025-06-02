#!/usr/bin/env node

import { FastMCP } from 'fastmcp';
import { Logger } from '@/lib/fetch';
import {
  AddToolSchema,
  FetchWeatherSchema,
  type WeatherResponse,
} from '@/schemas';

/**
 * FastMCP를 사용한 MCP 서버 생성
 */
function createMCPServer(): FastMCP {
  const server = new FastMCP({
    name: 'hello-model-context-protocol',
    version: '1.0.0',
  });

  // Add 도구 추가
  server.addTool({
    name: 'add',
    description: '두 숫자를 더합니다',
    parameters: AddToolSchema,
    execute: async args => {
      try {
        Logger.info('Add 도구 실행', args);

        const result = args.a + args.b;
        const calculation = `${args.a} + ${args.b} = ${result}`;

        Logger.info('Add 도구 완료', { result, calculation });

        return JSON.stringify({
          result,
          calculation,
        });
      } catch (error) {
        Logger.error('Add 도구 실행 중 오류 발생', {
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
  });

  // FetchWeather 도구 추가
  server.addTool({
    name: 'fetchWeather',
    description: '지정된 위치의 날씨 정보를 가져옵니다',
    parameters: FetchWeatherSchema,
    execute: async args => {
      try {
        Logger.info('FetchWeather 도구 실행', args);

        // 모의 날씨 데이터 생성
        const mockWeatherData: WeatherResponse = {
          location: args.location,
          temperature: args.units === 'celsius' ? 22 : 72,
          description: '맑음',
          humidity: 65,
          units: args.units || 'celsius',
        };

        Logger.info('FetchWeather 도구 완료', { weather: mockWeatherData });

        return JSON.stringify(mockWeatherData);
      } catch (error) {
        Logger.error('FetchWeather 도구 실행 중 오류 발생', {
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
  });

  // 로그 리소스 추가
  server.addResource({
    uri: 'logs://application',
    name: 'Application Logs',
    description: '애플리케이션 로그 데이터',
    mimeType: 'application/json',
    load: async () => {
      try {
        // 간단한 로그 데이터 반환
        const logs = [
          {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: 'FastMCP 서버가 시작되었습니다',
            metadata: {
              component: 'FastMCP Server',
              version: '1.0.0',
              tools: ['add', 'fetchWeather'],
            },
          },
          {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: '도구 및 리소스가 성공적으로 등록되었습니다',
            metadata: {
              toolCount: 2,
              resourceCount: 1,
            },
          },
        ];

        return {
          text: JSON.stringify(logs, null, 2),
        };
      } catch (error) {
        Logger.error('로그 리소스 로드 중 오류 발생', {
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
  });

  return server;
}

/**
 * 서버 시작 함수
 */
async function startServer(): Promise<void> {
  try {
    Logger.info('FastMCP 서버 초기화 중...');

    const server = createMCPServer();

    Logger.info('FastMCP 서버 시작 중...');

    await server.start({
      transportType: 'stdio',
    });

    Logger.info('FastMCP 서버가 성공적으로 시작되었습니다');
  } catch (error) {
    Logger.error('서버 시작 실패', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// 서버 시작
if (require.main === module) {
  startServer();

  // 종료 시그널 처리
  process.on('SIGINT', () => {
    Logger.info('서버 종료 중...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    Logger.info('서버 종료 중...');
    process.exit(0);
  });
}

export { createMCPServer, startServer };
