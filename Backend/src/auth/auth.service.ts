import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { UsersService } from '../users/users.service.js';
import { MailService } from '../mail/mail.service.js';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema.js';
import { Otp, OtpDocument } from './schemas/otp.schema.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { VerifyOtpDto, ResendOtpDto, ForgotPasswordDto } from './dto/verify-otp.dto.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
  ) {}

  // ─── Register ─────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    // Check if user already exists
    const existing = await this.usersService.findByEmail(email);
    if (existing && existing.isEmailVerified) {
      throw new ConflictException('An account with this email address already exists. Please log in.');
    }

    // Hash password with bcrypt (12 rounds)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    let user: UserDocument;
    if (existing && !existing.isEmailVerified) {
      // Update unverified user
      user = await this.usersService.update(existing._id.toString(), {
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        role: dto.role,
        companyName: dto.role === UserRole.EMPLOYER ? dto.companyName?.trim() : undefined,
        password: hashedPassword,
      });
    } else {
      user = await this.usersService.create({
        name: dto.name.trim(),
        email,
        phone: dto.phone.trim(),
        role: dto.role,
        companyName: dto.role === UserRole.EMPLOYER ? dto.companyName?.trim() : undefined,
        password: hashedPassword,
        isEmailVerified: false,
      });
    }

    // Generate & send OTP
    const otpResult = await this.generateAndSendOtp(user.email, user.name);

    return {
      success: true,
      requiresVerification: true,
      email: user.email,
      role: user.role,
      name: user.name,
      message: `A 6-digit verification code has been sent to ${user.email}.`,
      demoOtp: otpResult.plainOtp,
      previewUrl: otpResult.previewUrl,
    };
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Prevent user enumeration with generic safe message
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Enforce email verification
    if (!user.isEmailVerified) {
      const otpRes = await this.generateAndSendOtp(user.email, user.name);
      return {
        success: false,
        requiresVerification: true,
        email: user.email,
        role: user.role,
        name: user.name,
        message: 'Your email address is not verified yet. We just sent a 6-digit verification code to your email.',
        demoOtp: otpRes.plainOtp,
        previewUrl: otpRes.previewUrl,
      };
    }

    // Login successful
    await this.usersService.updateLastLogin(user.email);
    const accessToken = this.generateToken(user);

    return {
      success: true,
      message: 'Login successful!',
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
      redirectTo: user.role === UserRole.EMPLOYER ? '/employer/dashboard' : '/dashboard',
    };
  }

  // ─── Verify OTP ───────────────────────────────────────────────────────────

  async verifyOtp(dto: VerifyOtpDto) {
    const email = dto.email.toLowerCase().trim();
    const enteredOtp = dto.otp.trim();

    const otpRecord = await this.otpModel.findOne({ email }).exec();
    if (!otpRecord) {
      throw new BadRequestException('No active verification code found for this email, or it has expired.');
    }

    if (new Date() > otpRecord.expiresAt) {
      await this.otpModel.deleteOne({ _id: otpRecord._id }).exec();
      throw new BadRequestException('Verification code has expired. Please request a new code.');
    }

    if (otpRecord.attempts >= 4) {
      await this.otpModel.deleteOne({ _id: otpRecord._id }).exec();
      throw new ForbiddenException('Too many failed attempts. Please request a new verification code.');
    }

    // Verify OTP with timing-safe comparison
    const isOtpValid = await bcrypt.compare(enteredOtp, otpRecord.otpHash);

    if (!isOtpValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = 4 - otpRecord.attempts;
      throw new BadRequestException(`Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
    }

    // OTP is valid! Clean up OTP record and verify user
    await this.otpModel.deleteOne({ _id: otpRecord._id }).exec();
    const user = await this.usersService.markEmailVerified(email);

    if (!user) {
      throw new BadRequestException('User account could not be found.');
    }

    await this.usersService.updateLastLogin(user.email);
    const accessToken = this.generateToken(user);

    return {
      success: true,
      message: 'Email verified successfully! Welcome to TecJob.',
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
      redirectTo: user.role === UserRole.EMPLOYER ? '/employer/dashboard' : '/dashboard',
    };
  }

  // ─── Resend OTP ───────────────────────────────────────────────────────────

  async resendOtp(dto: ResendOtpDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('No account found with this email.');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('This email is already verified. You can log in.');
    }

    const otpResult = await this.generateAndSendOtp(user.email, user.name);

    return {
      success: true,
      message: `A new 6-digit verification code has been sent to ${user.email}.`,
      demoOtp: otpResult.plainOtp,
      previewUrl: otpResult.previewUrl,
    };
  }

  // ─── 1-Click Magic Link Verification ───────────────────────────────────────

  async verifyMagicLink(email: string, token: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await this.otpModel.findOne({ email: normalizedEmail }).exec();

    if (!otpRecord || otpRecord.verificationToken !== token) {
      const user = await this.usersService.findByEmail(normalizedEmail);
      if (user && user.isEmailVerified) {
        return { success: true, user };
      }
      throw new BadRequestException('Invalid or expired verification link.');
    }

    if (new Date() > otpRecord.expiresAt) {
      await this.otpModel.deleteOne({ _id: otpRecord._id }).exec();
      throw new BadRequestException('Verification link has expired.');
    }

    await this.otpModel.deleteOne({ _id: otpRecord._id }).exec();
    const user = await this.usersService.markEmailVerified(normalizedEmail);
    return { success: true, user };
  }

  // ─── Forgot Password ──────────────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email);

    if (user) {
      this.logger.log(`Password reset link requested for ${email}`);
    }

    // Always return success message to prevent user enumeration
    return {
      success: true,
      message: `If an account exists for ${email}, a password reset link has been sent.`,
    };
  }

  // ─── Helper: Generate & Send OTP ──────────────────────────────────────────

  private async generateAndSendOtp(email: string, userName: string) {
    const now = new Date();
    const existing = await this.otpModel.findOne({ email }).exec();

    // 60-second cooldown check
    if (existing && existing.resendAvailableAt > now) {
      const waitSec = Math.ceil((existing.resendAvailableAt.getTime() - now.getTime()) / 1000);
      throw new BadRequestException(`Please wait ${waitSec}s before requesting a new code.`);
    }

    // Generate cryptographically secure 6-digit numeric OTP
    const plainOtp = crypto.randomInt(100000, 999999).toString();
    const otpSalt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(plainOtp, otpSalt);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
    const resendAvailableAt = new Date(now.getTime() + 60 * 1000); // 60 seconds

    // Store in MongoDB (upsert)
    await this.otpModel.findOneAndUpdate(
      { email },
      {
        otpHash,
        plainOtpForDemo: plainOtp,
        verificationToken,
        expiresAt,
        attempts: 0,
        resendAvailableAt,
      },
      { upsert: true, new: true },
    ).exec();

    // Construct 1-click magic link
    const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const magicLink = `${baseUrl}/api/auth/verify-email?email=${encodeURIComponent(email)}&token=${verificationToken}`;

    // Send email
    const emailRes = await this.mailService.sendVerificationEmail(
      email,
      userName,
      plainOtp,
      magicLink,
    );

    return {
      plainOtp,
      previewUrl: emailRes.previewUrl,
    };
  }

  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }
}

