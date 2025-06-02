import {
  FetchWeatherSchema,
  type FetchWeatherInput,
  type WeatherResponse,
} from '@/schemas';

/**
 * 공통 Weather 비즈니스 로직
 * CLI와 MCP 서버에서 모두 사용할 수 있는 순수 함수
 */
export class WeatherTool {
  /**
   * 날씨 정보를 가져오는 핵심 로직 (모의 데이터)
   */
  static execute(input: FetchWeatherInput): WeatherResponse {
    const { location, units = 'celsius' } = input;

    // 모의 데이터 생성
    const temperature = units === 'celsius' ? 22 : 72;

    return {
      location,
      temperature,
      description: '맑음',
      humidity: 65,
      units,
    };
  }

  /**
   * 입력 유효성 검사 및 실행
   */
  static executeWithValidation(args: unknown): WeatherResponse {
    // Zod 스키마로 입력 검증
    const validatedInput = FetchWeatherSchema.parse(args);

    // 비즈니스 로직 실행
    return this.execute(validatedInput);
  }

  /**
   * CLI용 헬퍼 함수 - 직접 매개변수 전달
   */
  static executeFromParams(
    location: string,
    units: 'celsius' | 'fahrenheit' = 'celsius'
  ): WeatherResponse {
    return this.execute({ location, units });
  }

  /**
   * 실제 API 호출 로직 (확장 가능)
   */
  static async executeReal(input: FetchWeatherInput): Promise<WeatherResponse> {
    const apiKey = process.env['OPENWEATHER_API_KEY'];

    if (!apiKey) {
      // API 키가 없으면 모의 데이터 반환
      return this.execute(input);
    }

    try {
      // 실제 API 호출 로직은 여기에 구현할 예정
      // const { location, units = 'celsius' } = input;
      // const unitsParam = units === 'celsius' ? 'metric' : 'imperial';
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unitsParam}`);

      // 현재는 모의 데이터 반환
      return this.execute(input);
    } catch (error) {
      // 에러 발생 시 모의 데이터 반환
      return this.execute(input);
    }
  }
}

/**
 * 간단한 함수형 인터페이스 (선택사항)
 */
export function fetchWeather(
  location: string,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): WeatherResponse {
  return WeatherTool.executeFromParams(location, units);
}

/**
 * MCP 도구용 헬퍼 함수
 */
export function executeFetchWeatherTool(args: unknown): WeatherResponse {
  return WeatherTool.executeWithValidation(args);
}

/**
 * 실제 API 사용 헬퍼 함수
 */
export async function fetchRealWeather(
  location: string,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<WeatherResponse> {
  return WeatherTool.executeReal({ location, units });
}
