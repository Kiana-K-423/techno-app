import prisma from '@/config/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const email = searchParams.get('email') || '';

  const data = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!data) {
    return new Response(JSON.stringify({ message: 'Data not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ data: data }), {
    status: 200,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const data = await prisma.user.update({
    where: {
      email: body.email,
    },
    data: {
      email: body.email,
      name: body.name,
    },
  });

  return new Response(JSON.stringify({ data: data, message: 'Data updated' }), {
    status: 201,
  });
}
