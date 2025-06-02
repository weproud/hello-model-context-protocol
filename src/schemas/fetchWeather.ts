import { z } from 'zod';

/**
 * FetchWeather 도구 스키마
 * 날씨 정보를 조회하는 도구의 입력 매개변수를 정의합니다.
 */
export const FetchWeatherSchema = z.object({
  location: z.string().describe('날씨를 조회할 위치'),
  units: z
    .enum(['celsius', 'fahrenheit'])
    .optional()
    .default('celsius')
    .describe('온도 단위'),
});

/**
 * FetchWeather 도구 입력 타입
 */
export type FetchWeatherInput = z.infer<typeof FetchWeatherSchema>;

/**
 * FetchWeather 도구 응답 타입
 */
export interface WeatherResponse {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  units: 'celsius' | 'fahrenheit';
}
