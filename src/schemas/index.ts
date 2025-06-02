/**
 * 모든 MCP 도구 스키마를 export하는 중앙 집중식 파일
 */

// Add 도구 스키마
export {
  AddToolSchema,
  type AddToolInput,
  type AddToolResponse,
} from './add';

// FetchWeather 도구 스키마
export {
  FetchWeatherSchema,
  type FetchWeatherInput,
  type WeatherResponse,
} from './fetchWeather';
