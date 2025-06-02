import { Command } from 'commander';
import { fetchWeather, fetchRealWeather } from '@/server/tools/fetchWeather';
import { Logger } from '@/lib/fetch';

/**
 * FetchWeather 명령을 위한 CLI 핸들러
 */
export function createFetchWeatherCommand(): Command {
  const weatherCommand = new Command('fetch-weather');
  
  weatherCommand
    .description('지정된 위치의 날씨 정보를 가져옵니다')
    .argument('<location>', '날씨를 조회할 위치 (예: Seoul, Tokyo)')
    .option('-u, --units <units>', '온도 단위 (celsius|fahrenheit)', 'celsius')
    .option('-r, --real', '실제 날씨 API 사용 (API 키 필요)')
    .option('-v, --verbose', '상세한 출력 표시')
    .action(async (location: string, options: { 
      units?: string; 
      real?: boolean; 
      verbose?: boolean; 
    }) => {
      try {
        // 단위 유효성 검사
        const units = options.units as 'celsius' | 'fahrenheit';
        if (units !== 'celsius' && units !== 'fahrenheit') {
          console.error('❌ 오류: 온도 단위는 celsius 또는 fahrenheit만 지원됩니다.');
          process.exit(1);
        }
        
        if (options.verbose) {
          Logger.info('FetchWeather 명령 실행 시작', { location, units, real: options.real });
        }
        
        // 실제 API 또는 모의 데이터 사용
        const weatherData = options.real 
          ? await fetchRealWeather(location, units)
          : await fetchWeather(location, units);
        
        if (options.verbose) {
          console.log('🌤️  날씨 정보 조회 완료:');
          console.log(`   위치: ${weatherData.location}`);
          console.log(`   온도: ${weatherData.temperature}°${units === 'celsius' ? 'C' : 'F'}`);
          console.log(`   상태: ${weatherData.description}`);
          console.log(`   습도: ${weatherData.humidity}%`);
          console.log(`   단위: ${weatherData.units}`);
          
          if (!options.real) {
            console.log('   ℹ️  모의 데이터입니다. --real 옵션으로 실제 데이터를 조회할 수 있습니다.');
          }
        } else {
          console.log(`${weatherData.location}: ${weatherData.temperature}°${units === 'celsius' ? 'C' : 'F'}, ${weatherData.description}`);
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ 오류: ${errorMessage}`);
        
        if (options.verbose) {
          Logger.error('FetchWeather 명령 실행 실패', { error: errorMessage });
        }
        
        process.exit(1);
      }
    });
  
  return weatherCommand;
}

/**
 * FetchWeather 명령 예시 사용법 출력
 */
export function showFetchWeatherExamples(): void {
  console.log('FetchWeather 명령 사용 예시:');
  console.log('  mcp-tool fetch-weather Seoul');
  console.log('  mcp-tool fetch-weather "New York" --units fahrenheit');
  console.log('  mcp-tool fetch-weather Tokyo --real --verbose');
  console.log('  mcp-tool fetch-weather London -u celsius -v');
}
