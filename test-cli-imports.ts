#!/usr/bin/env node

import { Command } from 'commander';

console.log('Testing CLI imports...');

try {
  console.log('1. Importing init command...');
  const { createInitCommand } = await import('./src/cli/commands/init.js');
  console.log('✅ Init command imported successfully');

  console.log('2. Importing greeting command...');
  const { createGreetingCommand } = await import('./src/cli/commands/greeting.js');
  console.log('✅ Greeting command imported successfully');

  console.log('3. Importing slack command...');
  const { createSlackCommand } = await import('./src/cli/commands/slack.js');
  console.log('✅ Slack command imported successfully');

  console.log('4. Importing discord command...');
  const { createDiscordCommand } = await import('./src/cli/commands/discord.js');
  console.log('✅ Discord command imported successfully');

  console.log('5. Creating CLI program...');
  const program = new Command();
  program
    .name('test-cli')
    .description('Test CLI')
    .version('1.0.0');

  program.addCommand(createInitCommand());
  program.addCommand(createGreetingCommand());
  program.addCommand(createSlackCommand());
  program.addCommand(createDiscordCommand());

  console.log('✅ All commands added successfully');
  
  console.log('6. Testing help output...');
  program.outputHelp();

} catch (error) {
  console.error('❌ Error:', error);
}
