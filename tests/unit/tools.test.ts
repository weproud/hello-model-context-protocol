import { describe, it, expect } from 'vitest';
import { addTool } from '@/server/tools/add';
import { fetchWeatherTool } from '@/server/tools/fetchWeather';

describe('MCP Tools', () => {
  describe('Add Tool', () => {
    it('should add two positive numbers correctly', async () => {
      const result = await addTool.handler({ a: 5, b: 3 });
      
      expect(result).toEqual({
        result: 8,
        calculation: '5 + 3 = 8',
      });
    });
    
    it('should add negative numbers correctly', async () => {
      const result = await addTool.handler({ a: -2, b: 7 });
      
      expect(result).toEqual({
        result: 5,
        calculation: '-2 + 7 = 5',
      });
    });
    
    it('should add decimal numbers correctly', async () => {
      const result = await addTool.handler({ a: 1.5, b: 2.3 });
      
      expect(result).toEqual({
        result: 3.8,
        calculation: '1.5 + 2.3 = 3.8',
      });
    });
    
    it('should throw error for invalid input', async () => {
      await expect(addTool.handler({ a: 'invalid', b: 3 })).rejects.toThrow();
    });
    
    it('should throw error for missing parameters', async () => {
      await expect(addTool.handler({ a: 5 })).rejects.toThrow();
    });
  });
  
  describe('FetchWeather Tool', () => {
    it('should return weather data for valid location', async () => {
      const result = await fetchWeatherTool.handler({ 
        location: 'Seoul', 
        units: 'celsius' 
      });
      
      expect(result).toMatchObject({
        location: 'Seoul',
        temperature: expect.any(Number),
        description: expect.any(String),
        humidity: expect.any(Number),
        units: 'celsius',
      });
    });
    
    it('should use celsius as default unit', async () => {
      const result = await fetchWeatherTool.handler({ location: 'Tokyo' });
      
      expect(result.units).toBe('celsius');
    });
    
    it('should support fahrenheit units', async () => {
      const result = await fetchWeatherTool.handler({ 
        location: 'New York', 
        units: 'fahrenheit' 
      });
      
      expect(result.units).toBe('fahrenheit');
    });
    
    it('should throw error for invalid units', async () => {
      await expect(fetchWeatherTool.handler({ 
        location: 'London', 
        units: 'kelvin' 
      })).rejects.toThrow();
    });
    
    it('should throw error for missing location', async () => {
      await expect(fetchWeatherTool.handler({ units: 'celsius' })).rejects.toThrow();
    });
  });
});
