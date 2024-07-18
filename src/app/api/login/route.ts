import prisma from '@/config/prisma';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const existUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!existUser) {
    return new Response(JSON.stringify({ message: 'User not found' }), {
      status: 400,
    });
  }

  if (body.password.length < 6) {
    return new Response(
      JSON.stringify({ message: 'Password must be at least 6 characters' }),
      {
        status: 400,
      }
    );
  }

  if (body.password !== existUser.password) {
    return new Response(
      JSON.stringify({ message: 'Current password not match' }),
      {
        status: 400,
      }
    );
  }

  return new Response(JSON.stringify({ message: 'Login Success' }), {
    status: 201,
  });
}
