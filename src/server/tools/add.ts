import {
  AddToolSchema,
  type AddToolInput,
  type AddToolResponse,
} from '@/schemas';
import { Logger } from '@/lib/fetch';

/**
 * 두 숫자를 더하는 MCP 도구
 */
export const addTool = {
  name: 'add',
  description: '두 숫자를 더합니다',
  inputSchema: AddToolSchema,
  handler: async (args: unknown): Promise<AddToolResponse> => {
    try {
      // 입력 유효성 검사
      const { a, b } = AddToolSchema.parse(args) as AddToolInput;

      Logger.info('Add 도구 실행', { a, b });

      // 계산 수행
      const result = a + b;
      const calculation = `${a} + ${b} = ${result}`;

      Logger.info('Add 도구 완료', { result, calculation });

      return {
        result,
        calculation,
      };
    } catch (error) {
      Logger.error('Add 도구 실행 중 오류 발생', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
};

/**
 * CLI에서 사용할 Add 함수
 */
export async function addNumbers(
  a: number,
  b: number
): Promise<AddToolResponse> {
  return addTool.handler({ a, b });
}
