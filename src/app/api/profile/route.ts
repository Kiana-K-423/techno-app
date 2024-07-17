import prisma from '@/config/prisma';
import { NextRequest } from 'next/server';

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
