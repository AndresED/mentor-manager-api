export class TokenEntity {
  _id?: string;
  userId: string;
  token: string;
  type: 'access' | 'refresh' | 'reset';
  expiresAt: Date;
  createdAt: Date;

  constructor(params: {
    _id?: string;
    userId: string;
    token: string;
    type: 'access' | 'refresh' | 'reset';
    expiresAt: Date;
    createdAt?: Date;
  }) {
    if (params._id) this._id = params._id;
    this.userId = params.userId;
    this.token = params.token;
    this.type = params.type;
    this.expiresAt = params.expiresAt;
    this.createdAt = params.createdAt || new Date();
    this.validateToken();
  }

  private validateToken(): void {
    if (!this.token || this.token.length === 0) {
      throw new Error('Token cannot be empty');
    }
    if (!this.userId) {
      throw new Error('UserId is required');
    }
    if (this.expiresAt < new Date()) {
      throw new Error('Token expiration date must be in the future');
    }
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
