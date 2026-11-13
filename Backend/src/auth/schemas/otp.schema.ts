import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true })
  otpHash: string;

  @Prop({ required: false })
  plainOtpForDemo?: string;

  @Prop({ required: false, index: true })
  verificationToken?: string;

  @Prop({ required: true, index: { expires: '10m' } })
  expiresAt: Date;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ required: true })
  resendAvailableAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

