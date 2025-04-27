export class UserEntity {
  _id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    _id?: string;
    email: string;
    name: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.validateEmail(params.email);
    this.validateName(params.name);
    this._id = params._id || '';
    this.email = params.email;
    this.name = params.name;
    this.password = params.password;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validateName(name: string): void {
    if (!name || name.length < 3) {
      throw new Error('Name must be at least 3 characters long');
    }
  }
}
