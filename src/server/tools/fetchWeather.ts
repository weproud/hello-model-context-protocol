import {
  FetchWeatherSchema,
  type FetchWeatherInput,
  type WeatherResponse,
} from '@/schemas';
import { FetchUtil, Logger } from '@/lib/fetch';

/**
 * 날씨 정보를 가져오는 MCP 도구
 * 실제 구현에서는 OpenWeatherMap API 등을 사용할 수 있습니다
 */
export const fetchWeatherTool = {
  name: 'fetchWeather',
  description: '지정된 위치의 날씨 정보를 가져옵니다',
  inputSchema: FetchWeatherSchema,
  handler: async (args: unknown): Promise<WeatherResponse> => {
    try {
      // 입력 유효성 검사
      const { location, units } = FetchWeatherSchema.parse(
        args
      ) as FetchWeatherInput;

      Logger.info('FetchWeather 도구 실행', { location, units });

      // 실제 API 호출 대신 모의 데이터 반환
      // 실제 구현에서는 아래와 같이 API를 호출할 수 있습니다:
      // const apiKey = process.env.OPENWEATHER_API_KEY;
      // const response = await FetchUtil.get<WeatherApiResponse>(
      //   `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${units === 'celsius' ? 'metric' : 'imperial'}`
      // );

      const mockWeatherData: WeatherResponse = {
        location,
        temperature: units === 'celsius' ? 22 : 72,
        description: '맑음',
        humidity: 65,
        units,
      };

      Logger.info('FetchWeather 도구 완료', { weather: mockWeatherData });

      return mockWeatherData;
    } catch (error) {
      Logger.error('FetchWeather 도구 실행 중 오류 발생', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
};

/**
 * CLI에서 사용할 날씨 조회 함수
 */
export async function fetchWeather(
  location: string,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<WeatherResponse> {
  return fetchWeatherTool.handler({ location, units });
}

/**
 * 실제 날씨 API를 호출하는 함수 (예시)
 * 환경변수에 API 키가 설정되어 있을 때 사용
 */
export async function fetchRealWeather(
  location: string,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<WeatherResponse> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    Logger.warn('OpenWeather API 키가 설정되지 않음, 모의 데이터 반환');
    return fetchWeatherTool.handler({ location, units });
  }

  try {
    const unitsParam = units === 'celsius' ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=${unitsParam}`;

    const response = await FetchUtil.get<{
      main: { temp: number; humidity: number };
      weather: Array<{ description: string }>;
      name: string;
    }>(url);

    return {
      location: response.name,
      temperature: Math.round(response.main.temp),
      description: response.weather[0]?.description ?? '정보 없음',
      humidity: response.main.humidity,
      units,
    };
  } catch (error) {
    Logger.error('실제 날씨 API 호출 실패, 모의 데이터 반환', { error });
    return fetchWeatherTool.handler({ location, units });
  }
}
