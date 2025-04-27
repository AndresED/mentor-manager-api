import { Email } from '../../../../domain/value-objects/email.value-object';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const emailString = 'test@example.com';
    const email = new Email(emailString);

    expect(email.getValue()).toBe(emailString);
  });

  it('should throw error for invalid email without @', () => {
    const invalidEmail = 'testexample.com';

    expect(() => {
      new Email(invalidEmail);
    }).toThrow('Invalid email format');
  });

  it('should throw error for invalid email without domain', () => {
    const invalidEmail = 'test@.com';

    expect(() => {
      new Email(invalidEmail);
    }).toThrow('Invalid email format');
  });

  it('should throw error for invalid email with spaces', () => {
    const invalidEmail = 'test @example.com';

    expect(() => {
      new Email(invalidEmail);
    }).toThrow('Invalid email format');
  });

  it('should throw error for empty email', () => {
    const invalidEmail = '';

    expect(() => {
      new Email(invalidEmail);
    }).toThrow('Invalid email format');
  });
});
