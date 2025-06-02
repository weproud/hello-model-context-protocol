import { z } from 'zod';

/**
 * Add 도구 스키마
 * 두 숫자를 더하는 도구의 입력 매개변수를 정의합니다.
 */
export const AddToolSchema = z.object({
  a: z.number().describe('첫 번째 숫자'),
  b: z.number().describe('두 번째 숫자'),
});

/**
 * Add 도구 입력 타입
 */
export type AddToolInput = z.infer<typeof AddToolSchema>;

/**
 * Add 도구 응답 타입
 */
export interface AddToolResponse {
  result: number;
  calculation: string;
}
