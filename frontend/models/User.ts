import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Definir la interfaz para TypeScript
export interface IUser extends Document {
  email: string;
  name?: string;
  username?: string;
  password?: string;
  image?: string;
  birthDate?: Date;
  gender?: string;
  country?: string;
  bio?: string;
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Métodos de instancia
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Esquema de Mongoose
const UserSchema = new Schema<IUser>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/,
      index: true,
      sparse: true
    },
    password: {
      type: String,
      select: false // No incluir en las consultas por defecto
    },
    name: { 
      type: String, 
      trim: true,
      maxlength: 50
    },
    image: { 
      type: String 
    },
    birthDate: { 
      type: Date 
    },
    gender: { 
      type: String,
      enum: ['mujer', 'hombre', 'no-binario', 'otro', 'prefiero-no-decir'],
      default: 'prefiero-no-decir'
    },
    country: { 
      type: String,
      default: 'MX'
    },
    bio: {
      type: String,
      maxlength: 150
    },
    emailVerified: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    return false;
  }
};

// Middleware para hashear la contraseña antes de guardar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Crear el modelo si no existe
const User = (mongoose.models.User as Model<IUser>) || 
  mongoose.model<IUser>('User', UserSchema);

export default User;
