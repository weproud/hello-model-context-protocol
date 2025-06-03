import { describe, it, expect } from 'vitest';
import { InitTool } from '../../src/core/tools/index.js';

describe('MCP Tools', () => {
  describe('Init Tool', () => {
    it('should initialize project with default settings', async () => {
      const result = await InitTool.execute({
        force: false,
        configPath: '.hellomcp-test',
      });

      expect(result).toMatchObject({
        success: expect.any(Boolean),
        message: expect.any(String),
        createdFiles: expect.any(Array),
        skippedFiles: expect.any(Array),
        configPath: expect.stringContaining('.hellomcp-test'),
      });
    });

    it('should validate input parameters', () => {
      expect(() =>
        InitTool.executeWithValidation({ force: 'invalid' })
      ).toThrow();
    });
  });
});
