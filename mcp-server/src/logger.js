/**
 * Simple logger for MCP server
 */
class Logger {
  static info(message, data = {}) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] INFO: ${message}`, data);
  }

  static warn(message, data = {}) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] WARN: ${message}`, data);
  }

  static error(message, data = {}) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`, data);
  }

  static debug(message, data = {}) {
    if (process.env.DEBUG) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] DEBUG: ${message}`, data);
    }
  }
}

export default Logger;
