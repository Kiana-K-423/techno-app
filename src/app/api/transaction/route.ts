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
  let type = searchParams.get('type') || 'IN';

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
      customer: {
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
      ...(type === 'OUT'
        ? {
            customer: {
              phone: {
                contains: search,
              },
            },
          }
        : false),
      transaction: type as TransactionType,
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
      AND: [
        {
          OR: [
            {
              uuid: {
                contains: search,
              },
            },
            ...(type === 'OUT'
              ? [
                  {
                    customer: {
                      phone: {
                        contains: search,
                      },
                    },
                  },
                ]
              : []),
          ],
        },
        {
          itemId: {
            contains: itemId,
          },
        },
      ],
      transaction: type as TransactionType,
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
    !body?.type
  ) {
    return new Response(
      JSON.stringify({ message: 'All fields are required' }),
      {
        status: 400,
      }
    );
  }

  let customerId = body.customerId;
  if (body.name) {
    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
      },
    });

    customerId = customer.id;
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

  const [data] = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        uuid: uuid,
        itemId: String(body.itemId),
        customerId: customerId,
        quantity: +body.quantity < 0 ? 0 : +Number(body.quantity),
        total: +body.total < 0 ? 0 : +Number(body.total),
        transaction: body.transaction as TransactionType,
        orderingCosts:
          +body.orderingCosts < 0 ? 0 : +Number(body.orderingCosts),
        storageCosts: +body.storageCosts < 0 ? 0 : +Number(body.storageCosts),
        type: String(body.type),
      },
    }),
    prisma.item.update({
      where: {
        id: String(body.itemId),
      },
      data: {
        quantity: {
          [body.transaction === 'IN' ? 'increment' : 'decrement']: +Number(
            body.quantity
          ),
        },
      },
    }),
  ]);

  return new Response(JSON.stringify({ message: 'Data created', data: data }), {
    status: 201,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const {
    id,
    itemId,
    customerId,
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
      customerId: customerId ? String(customerId) : exist.customerId,
      quantity: quantity ? +Number(quantity) : exist.quantity,
      total: total ? (+total < 0 ? 0 : +Number(total)) : exist.total,
      transaction: transaction ? transaction : exist.transaction,
      orderingCosts: orderingCosts
        ? +orderingCosts < 0
          ? 0
          : +Number(orderingCosts)
        : exist.orderingCosts,
      storageCosts: storageCosts
        ? +storageCosts < 0
          ? 0
          : +Number(storageCosts)
        : exist.storageCosts,
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
