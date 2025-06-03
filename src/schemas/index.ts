/**
 * 모든 MCP 도구 스키마를 export하는 중앙 집중식 파일
 */

// Init 도구 스키마
export {
  InitToolSchema,
  type InitToolInput,
  type InitToolResponse,
} from './init.js';

// Greeting 도구 스키마
export {
  GreetingToolSchema,
  type GreetingToolInput,
  type GreetingToolResponse,
} from './greeting.js';
