import { Command } from 'commander';
import { DiscordTool } from '../../core/tools/discord.js';

/**
 * Discord 명령 생성
 */
export function createDiscordCommand(): Command {
  const discordCommand = new Command('send-message-discord');

  discordCommand
    .description('Discord로 메시지를 전송합니다')
    .argument('<message>', 'Discord로 전송할 메시지')
    .action(async (message: string) => {
      try {
        console.log(`📤 Discord 메시지 전송 중...`);
        
        const result = await DiscordTool.executeFromParams(message);

        if (result.success) {
          console.log(result.message);
          console.log('📋 전송된 메시지 정보:');
          console.log(`  - 메시지: "${result.sentMessage.content}"`);
        } else {
          console.error(`❌ ${result.message}`);
          process.exit(1);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Discord 메시지 전송 중 오류 발생: ${errorMessage}`);
        process.exit(1);
      }
    });

  // 도움말 개선
  discordCommand.on('--help', () => {
    console.log('');
    console.log('사용 예시:');
    console.log('  $ mcp-tool send-message-discord "Hello, World!"');
    console.log('  $ mcp-tool send-message-discord "배포 완료!"');
    console.log('  $ mcp-tool send-message-discord "알림 메시지"');
    console.log('');
    console.log('환경 변수:');
    console.log('  DISCORD_WEBHOOK_URL  Discord Webhook URL (필수)');
    console.log('');
    console.log('설명:');
    console.log('  이 명령은 Discord Webhook을 사용하여 메시지를 전송합니다.');
    console.log('  환경변수 DISCORD_WEBHOOK_URL을 설정해야 합니다.');
    console.log('');
    console.log('Discord Webhook URL 설정 방법:');
    console.log('  1. Discord 서버 설정에서 Integrations > Webhooks 선택');
    console.log('  2. New Webhook 생성 후 채널 선택');
    console.log('  3. Webhook URL 복사');
    console.log('  4. 환경변수 설정: export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."');
  });

  return discordCommand;
}

/**
 * Discord 명령 사용 예시 표시
 */
export function showDiscordExamples(): void {
  console.log('📤 Discord 명령 사용 예시:');
  console.log('');
  console.log('기본 사용법:');
  console.log('  $ mcp-tool send-message-discord "Hello, World!"');
  console.log('  → Discord로 메시지 전송');
  console.log('');
  console.log('다양한 메시지:');
  console.log('  $ mcp-tool send-message-discord "배포 완료!"');
  console.log('  $ mcp-tool send-message-discord "알림 메시지"');
  console.log('  $ mcp-tool send-message-discord "시스템 점검 완료"');
  console.log('');
  console.log('환경 변수 설정:');
  console.log('  $ export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."');
  console.log('  $ mcp-tool send-message-discord "환경변수로 전송"');
}
