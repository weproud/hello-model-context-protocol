import { FastMCP } from 'fastmcp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import logger from './logger.js';
import { registerHelloMCPTools } from './tools/index.js';

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main MCP server class that integrates with Hello MCP
 */
class HelloMCPServer {
  constructor() {
    // Get version from package.json using synchronous fs
    const packagePath = path.join(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    this.options = {
      name: 'Hello MCP Server',
      version: packageJson.version,
    };

    this.server = new FastMCP(this.options);
    this.initialized = false;

    this.server.addResource({});
    this.server.addResourceTemplate({});

    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // Setup logging
    this.logger = logger;
  }

  /**
   * Initialize the MCP server with necessary tools and routes
   */
  async init() {
    if (this.initialized) return;

    // Register all Hello MCP tools
    registerHelloMCPTools(this.server);

    this.initialized = true;
    return this;
  }

  /**
   * Start the MCP server
   */
  async start() {
    if (!this.initialized) {
      await this.init();
    }

    // Start the FastMCP server with increased timeout
    await this.server.start({
      transportType: 'stdio',
      timeout: 120000, // 2 minutes timeout (in milliseconds)
    });

    return this;
  }

  /**
   * Stop the MCP server
   */
  async stop() {
    if (this.server) {
      await this.server.stop();
    }
  }
}

export default HelloMCPServer;
