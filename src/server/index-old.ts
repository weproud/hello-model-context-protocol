#!/usr/bin/env node

import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { Logger } from '@/lib/fetch';
import {
  AddToolSchema,
  FetchWeatherSchema,
  type WeatherResponse,
} from '@/types';

/**
 * MCP 서버 클래스
 */
class MCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'hello-model-context-protocol',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * 서버 핸들러 설정
   */
  private setupHandlers(): void {
    // 도구 목록 핸들러
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      Logger.info('도구 목록 요청 처리');

      return {
        tools: [
          {
            name: addTool.name,
            description: addTool.description,
            inputSchema: addTool.inputSchema,
          },
          {
            name: fetchWeatherTool.name,
            description: fetchWeatherTool.description,
            inputSchema: fetchWeatherTool.inputSchema,
          },
        ],
      };
    });

    // 도구 호출 핸들러
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      Logger.info('도구 호출 요청', { name, args });

      try {
        let result;

        switch (name) {
          case 'add':
            result = await addTool.handler(args);
            break;
          case 'fetchWeather':
            result = await fetchWeatherTool.handler(args);
            break;
          default:
            throw new Error(`알 수 없는 도구: ${name}`);
        }

        // 로그에 도구 실행 결과 기록
        LogsResource.addLog({
          level: 'info',
          message: `도구 '${name}' 실행 완료`,
          metadata: { tool: name, args, result },
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        Logger.error('도구 실행 중 오류 발생', { name, error: errorMessage });

        // 로그에 오류 기록
        LogsResource.addLog({
          level: 'error',
          message: `도구 '${name}' 실행 실패: ${errorMessage}`,
          metadata: { tool: name, args, error: errorMessage },
        });

        throw error;
      }
    });

    // 자원 목록 핸들러
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      Logger.info('자원 목록 요청 처리');

      return {
        resources: [LogsResource.getResourceDefinition()],
      };
    });

    // 자원 읽기 핸들러
    this.server.setRequestHandler(ReadResourceRequestSchema, async request => {
      const { uri } = request.params;

      Logger.info('자원 읽기 요청', { uri });

      try {
        const content = await LogsResource.handleResourceRequest(uri);

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: content,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        Logger.error('자원 읽기 중 오류 발생', { uri, error: errorMessage });
        throw error;
      }
    });
  }

  /**
   * 서버 시작
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();

    Logger.info('MCP 서버 시작 중...');

    await this.server.connect(transport);

    Logger.info('MCP 서버가 성공적으로 시작되었습니다');

    // 서버 시작 로그 추가
    LogsResource.addLog({
      level: 'info',
      message: 'MCP 서버 시작됨',
      metadata: {
        timestamp: new Date().toISOString(),
        tools: ['add', 'fetchWeather'],
        resources: ['logs://application'],
      },
    });
  }
}

// 서버 시작
if (require.main === module) {
  const server = new MCPServer();

  server.start().catch(error => {
    Logger.error('서버 시작 실패', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  });

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

export { MCPServer };
