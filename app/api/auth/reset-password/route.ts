import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Missing token or password') },
        { status: 400 }
      );
    }

    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Invalid or expired token') },
        { status: 400 }
      );
    }

    const hasExpired = new Date() > new Date(existingToken.expires);

    if (hasExpired) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Token has expired') },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'User not found') },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return NextResponse.json(
      { success: true, message: getApiLocalizedText(req, 'Password updated successfully') },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Internal server error') },
      { status: 500 }
    );
  }
}
