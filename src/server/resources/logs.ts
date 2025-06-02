import { type MCPResource, type LogEntry } from '@/types';
import { Logger } from '@/lib/fetch';

/**
 * 로그 자원 핸들러
 * MCP 클라이언트가 로그 데이터에 접근할 수 있도록 합니다
 */
export class LogsResource {
  private static logs: LogEntry[] = [];
  
  /**
   * 로그 자원 정의
   */
  static getResourceDefinition(): MCPResource {
    return {
      uri: 'logs://application',
      name: 'Application Logs',
      description: '애플리케이션 로그 데이터',
      mimeType: 'application/json',
    };
  }
  
  /**
   * 로그 엔트리 추가
   */
  static addLog(entry: Omit<LogEntry, 'timestamp'>): void {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };
    
    this.logs.push(logEntry);
    
    // 최대 1000개의 로그만 유지
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
    
    Logger.info('로그 엔트리 추가됨', logEntry);
  }
  
  /**
   * 모든 로그 반환
   */
  static getAllLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  /**
   * 레벨별 로그 필터링
   */
  static getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }
  
  /**
   * 최근 로그 반환
   */
  static getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }
  
  /**
   * 로그 검색
   */
  static searchLogs(query: string): LogEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.logs.filter(log => 
      log.message.toLowerCase().includes(lowerQuery) ||
      (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(lowerQuery))
    );
  }
  
  /**
   * 로그 초기화
   */
  static clearLogs(): void {
    this.logs = [];
    Logger.info('로그가 초기화되었습니다');
  }
  
  /**
   * MCP 자원 핸들러
   */
  static async handleResourceRequest(uri: string): Promise<string> {
    if (uri !== 'logs://application') {
      throw new Error(`지원하지 않는 자원 URI: ${uri}`);
    }
    
    const logs = this.getAllLogs();
    return JSON.stringify(logs, null, 2);
  }
}

// 초기 로그 엔트리 추가
LogsResource.addLog({
  level: 'info',
  message: 'MCP 서버 로그 시스템 초기화됨',
  metadata: {
    component: 'LogsResource',
    version: '1.0.0',
  },
});
