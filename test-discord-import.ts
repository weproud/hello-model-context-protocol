#!/usr/bin/env node

console.log('Testing Discord import...');

try {
  console.log('1. Importing DiscordTool...');
  const { DiscordTool } = await import('./src/core/tools/discord.js');
  console.log('✅ DiscordTool imported successfully');

  console.log('2. Testing Discord tool execution...');
  const result = await DiscordTool.executeFromParams('Test message');
  console.log('✅ Discord tool executed:', result);

} catch (error) {
  console.error('❌ Error:', error);
}
