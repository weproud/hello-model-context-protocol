import { MCPError } from '@/types';

/**
 * HTTP 요청을 위한 유틸리티 함수
 */
export class FetchUtil {
  private static readonly DEFAULT_TIMEOUT = 10000; // 10초

  /**
   * GET 요청을 수행합니다
   */
  static async get<T>(
    url: string,
    options: {
      headers?: Record<string, string>;
      timeout?: number;
    } = {}
  ): Promise<T> {
    return this.request<T>(url, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * POST 요청을 수행합니다
   */
  static async post<T>(
    url: string,
    data?: unknown,
    options: {
      headers?: Record<string, string>;
      timeout?: number;
    } = {}
  ): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  }

  /**
   * 기본 HTTP 요청 함수
   */
  private static async request<T>(
    url: string,
    options: {
      method: string;
      headers?: Record<string, string>;
      body?: string;
      timeout?: number;
    }
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = options.timeout ?? this.DEFAULT_TIMEOUT;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        method: options.method,
        headers: options.headers,
        body: options.body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new MCPError(
          `HTTP 요청 실패: ${response.status} ${response.statusText}`,
          'HTTP_ERROR',
          response.status
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return (await response.json()) as T;
      } else {
        return (await response.text()) as T;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof MCPError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new MCPError(
            `요청 시간 초과 (${timeout}ms)`,
            'TIMEOUT_ERROR',
            408
          );
        }
        throw new MCPError(
          `네트워크 오류: ${error.message}`,
          'NETWORK_ERROR',
          500
        );
      }

      throw new MCPError('알 수 없는 오류가 발생했습니다', 'UNKNOWN_ERROR', 500);
    }
  }
}

/**
 * 로깅 유틸리티
 */
export class Logger {
  static info(message: string, metadata?: Record<string, unknown>): void {
    console.log(`[INFO] ${message}`, metadata ? JSON.stringify(metadata) : '');
  }

  static warn(message: string, metadata?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message}`, metadata ? JSON.stringify(metadata) : '');
  }

  static error(message: string, metadata?: Record<string, unknown>): void {
    console.error(`[ERROR] ${message}`, metadata ? JSON.stringify(metadata) : '');
  }

  static debug(message: string, metadata?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, metadata ? JSON.stringify(metadata) : '');
    }
  }
}
