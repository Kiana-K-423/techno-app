import prisma from '@/config/prisma';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
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

  // compare password
  if (body.password !== body.confirmPassword) {
    return new Response(
      JSON.stringify({ message: 'Password and confirm password not match' }),
      {
        status: 400,
      }
    );
  }

  if (body.currentPassword !== existUser.password) {
    return new Response(
      JSON.stringify({ message: 'Current password not match' }),
      {
        status: 400,
      }
    );
  }

  if (body.currentPassword === body.password) {
    return new Response(
      JSON.stringify({
        message: 'New password cannot be the same as the current password',
      }),
      {
        status: 400,
      }
    );
  }

  const data = await prisma.user.update({
    where: {
      email: body.email,
    },
    data: {
      password: body.password,
    },
  });

  return new Response(JSON.stringify({ data: data, message: 'Data updated' }), {
    status: 201,
  });
}
