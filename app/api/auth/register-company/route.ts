import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      name,
      location,
      website,
      industry,
      size, // optional: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE'
      description,
    } = body || {};

    // basic validation
    if (!email || !password || !name || !location) {
      return NextResponse.json(
        { error: 'Email, password, name, and location are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (exists) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        role: 'COMPANY',
        company: {
          create: {
            name,
            website: website || null,
            location,
            industry: industry || null,
            size: size || null,
            description: description || null,
            isVerified: false, // admin will verify later
          },
        },
      },
      include: { company: true },
    });

    return NextResponse.json(
      {
        message: 'Company registered successfully. Await admin verification.',
        userId: user.id,
        companyId: user.company?.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Register company error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}