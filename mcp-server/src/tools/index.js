/**
 * tools/index.js
 * Export all Hello MCP tools for MCP server
 */
import { registerInitTool } from './init.js';
import { registerGreetingTool } from './greeting.js';
import logger from '../logger.js';

/**
 * Register all Hello MCP tools with the MCP server
 * @param {Object} server - FastMCP server instance
 */
export function registerHelloMCPTools(server) {
  try {
    // Register each tool
    registerInitTool(server);
    registerGreetingTool(server);

    logger.info('All Hello MCP tools registered successfully');
  } catch (error) {
    logger.error(`Error registering Hello MCP tools: ${error.message}`);
    throw error;
  }
}

export default {
  registerHelloMCPTools,
};
