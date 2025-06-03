#!/usr/bin/env node

console.log('Testing env command...');

try {
  console.log('1. Importing EnvLoader...');
  const { EnvLoader } = await import('./src/core/env.js');
  console.log('✅ EnvLoader imported successfully');

  console.log('2. Testing EnvLoader.load()...');
  EnvLoader.load();
  console.log('✅ EnvLoader.load() executed successfully');

  console.log('3. Testing EnvLoader.checkMessagingConfig()...');
  const config = EnvLoader.checkMessagingConfig();
  console.log('✅ Messaging config:', config);

  console.log('4. Importing env command...');
  const { createEnvCommand } = await import('./src/cli/commands/env.js');
  console.log('✅ Env command imported successfully');

  console.log('5. Creating env command...');
  const envCommand = createEnvCommand();
  console.log('✅ Env command created successfully');
  console.log('Command name:', envCommand.name());
  console.log('Command description:', envCommand.description());

} catch (error) {
  console.error('❌ Error:', error);
}
