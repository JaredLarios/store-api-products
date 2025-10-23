import { v4 as uuidv4 } from 'uuid';
import {
  generateUuid,
  generateDate,
  getEnumKeyByEnumValue,
  validateMissingParams,
  isValidUUID,
} from './utils';

jest.mock('uuid'); // Mock uuid so we can control its output

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateUuid', () => {
    it('should return a UUID string', () => {
      (uuidv4 as jest.Mock).mockReturnValue('mocked-uuid');
      const result = generateUuid();
      expect(result).toBe('mocked-uuid');
      expect(uuidv4).toHaveBeenCalled();
    });
  });

  describe('generateDate', () => {
    it('should return a Date object close to now', () => {
      const result = generateDate();
      expect(result).toBeInstanceOf(Date);
      const now = new Date();
      expect(result.getTime()).toBeLessThanOrEqual(now.getTime());
    });
  });

  describe('getEnumKeyByEnumValue', () => {
    enum Colors {
      RED = 'red',
      BLUE = 'blue',
    }

    it('should return the enum key for a given value', () => {
      const key = getEnumKeyByEnumValue(Colors, 'red');
      expect(key).toBe('RED');
    });

    it('should return undefined if value is not in enum', () => {
      const key = getEnumKeyByEnumValue(Colors, 'green');
      expect(key).toBeUndefined();
    });
  });

  describe('validateMissingParams', () => {
    it('should return missing keys', () => {
      const queries = { a: '1', b: '', c: null };
      const result = validateMissingParams(queries, undefined);
      expect(result).toEqual(['b', 'c']);
    });

    it('should ignore keys in ignore list', () => {
      const queries = { a: '', b: '', c: null };
      const result = validateMissingParams(queries, ['b']);
      expect(result).toEqual(['a', 'c']);
    });

    it('should return empty array if no missing params', () => {
      const queries = { a: 'x', b: 1 };
      const result = validateMissingParams(queries, undefined);
      expect(result).toEqual([]);
    });
  });

  describe('isValidUUID', () => {
    it('should return true for valid UUID', () => {
      const valid = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidUUID(valid)).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      const invalid = 'not-a-uuid';
      expect(isValidUUID(invalid)).toBe(false);
    });

    it('should return false for almost valid UUID', () => {
      const almost = '550e8400-e29b-41d4-a716-44665544';
      expect(isValidUUID(almost)).toBe(false);
    });
  });
});
