#!/usr/bin/env node

import { Command } from 'commander';

console.log('Testing Discord CLI command...');

try {
  console.log('1. Importing Discord command...');
  const { createDiscordCommand } = await import('./src/cli/commands/discord.js');
  console.log('✅ Discord command imported successfully');

  console.log('2. Creating Discord command...');
  const discordCommand = createDiscordCommand();
  console.log('✅ Discord command created successfully');

  console.log('3. Testing command structure...');
  console.log('Command name:', discordCommand.name());
  console.log('Command description:', discordCommand.description());

  console.log('4. Creating test CLI...');
  const program = new Command();
  program
    .name('test-discord-cli')
    .description('Test Discord CLI')
    .version('1.0.0');

  program.addCommand(discordCommand);

  console.log('✅ Discord command added to CLI successfully');
  
  console.log('5. Testing help output...');
  program.outputHelp();

} catch (error) {
  console.error('❌ Error:', error);
}
