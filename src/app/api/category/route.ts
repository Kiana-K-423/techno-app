import prisma from '@/config/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'asc';

  const datas = await prisma.categories.findMany({
    include: {
      // @ts-ignore
      deletedAt: false,
    },
    where: {
      name: {
        contains: search,
      },
      deletedAt: null,
    },
    orderBy: {
      id: sort as 'asc' | 'desc',
    },
    skip: (((+page as number) - 1) * (+limit as number)) as number,
    take: +limit as number,
  });

  const count = await prisma.categories.count({
    where: {
      name: {
        contains: search,
      },
      deletedAt: null,
    },
  });

  if (!datas || datas.length === 0) {
    return new Response(
      JSON.stringify({ message: 'Data not found', data: null }),
      {
        status: 404,
      }
    );
  }

  return new Response(
    JSON.stringify({
      data: datas,
      message: 'Data found',
      page: page,
      totalData: count,
      totalPage: Math.ceil(count / (limit as number)),
    }),
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const data = await prisma.categories.create({
    data: {
      name: body.name,
    },
  });

  return new Response(JSON.stringify({ data: data, message: 'Data created' }), {
    status: 201,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const data = await prisma.categories.update({
    where: {
      id: body.id,
    },
    data: {
      name: body.name,
    },
  });

  return new Response(JSON.stringify({ data: data, message: 'Data updated' }), {
    status: 200,
  });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryId = searchParams.get('id');

  if (!queryId) {
    return new Response(JSON.stringify({ message: 'Id is required' }), {
      status: 400,
    });
  }

  const data = await prisma.categories.update({
    where: {
      id: queryId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return new Response(JSON.stringify({ data: data, message: 'Data deleted' }), {
    status: 200,
  });
}
