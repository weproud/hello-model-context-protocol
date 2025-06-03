import { describe, it, expect } from 'vitest';
import { AddTool, WeatherTool, InitTool } from '../../src/core/tools/index.js';

describe('MCP Tools', () => {
  describe('Add Tool', () => {
    it('should add two positive numbers correctly', () => {
      const result = AddTool.execute({ a: 5, b: 3 });

      expect(result).toEqual({
        result: 8,
        calculation: '5 + 3 = 8',
      });
    });

    it('should add negative numbers correctly', () => {
      const result = AddTool.execute({ a: -2, b: 7 });

      expect(result).toEqual({
        result: 5,
        calculation: '-2 + 7 = 5',
      });
    });

    it('should add decimal numbers correctly', () => {
      const result = AddTool.execute({ a: 1.5, b: 2.3 });

      expect(result).toEqual({
        result: 3.8,
        calculation: '1.5 + 2.3 = 3.8',
      });
    });

    it('should throw error for invalid input', () => {
      expect(() =>
        AddTool.executeWithValidation({ a: 'invalid', b: 3 })
      ).toThrow();
    });

    it('should throw error for missing parameters', () => {
      expect(() => AddTool.executeWithValidation({ a: 5 })).toThrow();
    });
  });

  describe('FetchWeather Tool', () => {
    it('should return weather data for valid location', () => {
      const result = WeatherTool.execute({
        location: 'Seoul',
        units: 'celsius',
      });

      expect(result).toMatchObject({
        location: 'Seoul',
        temperature: expect.any(Number),
        description: expect.any(String),
        humidity: expect.any(Number),
        units: 'celsius',
      });
    });

    it('should use celsius as default unit', () => {
      const result = WeatherTool.executeWithValidation({ location: 'Tokyo' });

      expect(result.units).toBe('celsius');
    });

    it('should support fahrenheit units', () => {
      const result = WeatherTool.execute({
        location: 'New York',
        units: 'fahrenheit',
      });

      expect(result.units).toBe('fahrenheit');
    });

    it('should throw error for invalid units', () => {
      expect(() =>
        WeatherTool.executeWithValidation({
          location: 'London',
          units: 'kelvin',
        })
      ).toThrow();
    });

    it('should throw error for missing location', () => {
      expect(() =>
        WeatherTool.executeWithValidation({ units: 'celsius' })
      ).toThrow();
    });
  });

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
