import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  SEEKER = 'seeker',
  EMPLOYER = 'employer',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.SEEKER })
  role: UserRole;

  @Prop({ required: false, trim: true })
  companyName?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ required: false })
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Ensure index on email
UserSchema.index({ email: 1 }, { unique: true });

