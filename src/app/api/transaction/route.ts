import prisma from '@/config/prisma';
import { TransactionType } from '@prisma/client';
import { unlink, writeFile } from 'fs';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'asc';
  let itemId = searchParams.get('itemId') || '';

  if (itemId === 'All Item') {
    itemId = '';
  }

  const datas = await prisma.transaction.findMany({
    include: {
      // @ts-ignore
      deletedAt: false,
      item: {
        // @ts-ignore
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      uuid: {
        contains: search,
      },
      itemId: {
        contains: itemId,
      },
      deletedAt: null,
    },
    orderBy: {
      id: sort as 'asc' | 'desc',
    },
    skip: (((+page as number) - 1) * (+limit as number)) as number,
    take: +limit as number,
  });

  const count = await prisma.transaction.count({
    where: {
      uuid: {
        contains: search,
      },
      itemId: {
        contains: itemId,
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

  if (
    !body?.itemId ||
    !body?.quantity ||
    !body?.total ||
    !body?.transaction ||
    !body?.orderingCosts ||
    !body?.storageCosts ||
    !body?.type
  ) {
    return new Response(
      JSON.stringify({ message: 'All fields are required' }),
      {
        status: 400,
      }
    );
  }

  // generate uuid
  const lastData = await prisma.transaction.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const uuid = `TRX-00${
    lastData ? +lastData.uuid?.split('-')[1] + 1 : new Date().getTime()
  }`;

  const data = await prisma.transaction.create({
    data: {
      uuid: uuid,
      itemId: String(body.itemId),
      quantity: +Number(body.quantity),
      total: +Number(body.total),
      transaction: body.transaction as TransactionType,
      orderingCosts: +Number(body.orderingCosts),
      storageCosts: +Number(body.storageCosts),
      type: String(body.type),
    },
  });

  return new Response(JSON.stringify({ message: 'Data created', data: data }), {
    status: 201,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const {
    id,
    itemId,
    quantity,
    total,
    transaction,
    orderingCosts,
    storageCosts,
    type,
  } = body;

  if (!id) {
    return new Response(
      JSON.stringify({ message: 'All fields are required' }),
      {
        status: 400,
      }
    );
  }

  const exist = await prisma.transaction.findUnique({
    where: {
      id: String(id),
    },
  });

  if (!exist) {
    return new Response(JSON.stringify({ message: 'Data not found' }), {
      status: 404,
    });
  }

  const data = await prisma.transaction.update({
    where: {
      id: String(id),
    },
    data: {
      itemId: itemId ? String(itemId) : exist.itemId,
      quantity: quantity ? +Number(quantity) : exist.quantity,
      total: total ? +Number(total) : exist.total,
      transaction: transaction ? transaction : exist.transaction,
      orderingCosts: orderingCosts
        ? +Number(orderingCosts)
        : exist.orderingCosts,
      storageCosts: storageCosts ? +Number(storageCosts) : exist.storageCosts,
      type: type ? String(type) : exist.type,
    },
  });

  return new Response(JSON.stringify({ message: 'Data updated', data: data }), {
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

  const data = await prisma.transaction.update({
    where: {
      id: queryId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return new Response(JSON.stringify({ message: 'Data deleted', data: data }), {
    status: 200,
  });
}
