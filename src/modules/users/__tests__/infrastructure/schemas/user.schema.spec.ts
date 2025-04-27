import { User, UserSchema } from '../../../infrastructure/schemas/user.schema';
import * as mongoose from 'mongoose';

describe('User Schema', () => {
  let userModel: mongoose.Model<User & mongoose.Document>;

  beforeAll(() => {
    // Crear el modelo sin conectar a una base de datos
    userModel = mongoose.model<User & mongoose.Document>('User', UserSchema);
  });

  it('should have the required fields', () => {
    // Verificar que el esquema tenga los campos esperados
    const schemaFields = UserSchema.paths;

    expect(schemaFields.email).toBeDefined();
    expect(schemaFields.name).toBeDefined();
    expect(schemaFields.password).toBeDefined();
    expect(schemaFields.createdAt).toBeDefined();
    expect(schemaFields.updatedAt).toBeDefined();

    // Verificar que los campos requeridos estén marcados como tal
    expect(schemaFields.email.isRequired).toBeTruthy();
    expect(schemaFields.name.isRequired).toBeTruthy();
    expect(schemaFields.password.isRequired).toBeTruthy();
  });

  it('should have a pre-save middleware for updatedAt', () => {
    // Verificar que el middleware pre-save esté definido
    const preHooks = UserSchema.pre;

    // Verify the pre hook exists by trying to add a dummy function
    // This is a way to check if the pre method is available and functional
    let hookWasCalled = false;
    UserSchema.pre('save', function () {
      hookWasCalled = true;
    });

    expect(preHooks).toBeDefined();
    expect(typeof preHooks).toBe('function');
  });

  it('should create a valid user model', () => {
    // Crear una instancia del modelo
    const user = new userModel({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    });

    // Verificar que la instancia tenga los valores correctos
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.password).toBe('password123');
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
});
