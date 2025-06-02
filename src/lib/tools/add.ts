import {
  AddToolSchema,
  type AddToolInput,
  type AddToolResponse,
} from '../../schemas/index.js';

/**
 * 공통 Add 비즈니스 로직
 * CLI와 MCP 서버에서 모두 사용할 수 있는 순수 함수
 */
export class AddTool {
  /**
   * 두 숫자를 더하는 핵심 로직
   */
  static execute(input: AddToolInput): AddToolResponse {
    const { a, b } = input;
    const result = a + b;
    const calculation = `${a} + ${b} = ${result}`;

    return {
      result,
      calculation,
    };
  }

  /**
   * 입력 유효성 검사 및 실행
   */
  static executeWithValidation(args: unknown): AddToolResponse {
    // Zod 스키마로 입력 검증
    const validatedInput = AddToolSchema.parse(args);

    // 비즈니스 로직 실행
    return this.execute(validatedInput);
  }

  /**
   * CLI용 헬퍼 함수 - 직접 매개변수 전달
   */
  static executeFromParams(a: number, b: number): AddToolResponse {
    return this.execute({ a, b });
  }
}

/**
 * 간단한 함수형 인터페이스 (선택사항)
 */
export function addNumbers(a: number, b: number): AddToolResponse {
  return AddTool.executeFromParams(a, b);
}

/**
 * MCP 도구용 헬퍼 함수
 */
export function executeAddTool(args: unknown): AddToolResponse {
  return AddTool.executeWithValidation(args);
}
