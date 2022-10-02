// Test to see if the function works as expected
import capitalizeFirstLetter from './capitalizeFirstLetter';

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });
});
