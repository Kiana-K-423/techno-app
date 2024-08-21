import prisma from '@/config/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get('month') || new Date().getMonth() + 1;
  const year = searchParams.get('year') || new Date().getFullYear();
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;

  const datas = await prisma.item.findMany({
    include: {
      // @ts-ignore
      deletedAt: false,
      category: {
        // @ts-ignore
        select: {
          id: true,
          name: true,
        },
      },
      room: {
        // @ts-ignore
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          transactions: {
            where: {
              transaction: 'OUT',
            },
          },
        },
      },
    },
    where: {
      deletedAt: null,
    },
    orderBy: {
      id: 'asc',
    },
    skip: (((+page as number) - 1) * (+limit as number)) as number,
    take: +limit as number,
  });

  const count = await prisma.item.count({
    where: {
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

  const dataWithEOQ = await Promise.all(
    datas.map(async (data) => {
      const orderingCosts = await prisma.transaction
        .aggregate({
          _avg: {
            orderingCosts: true,
          },
          where: {
            itemId: data.id,
            transaction: 'IN',
            deletedAt: null,
          },
        })
        .then((res) => res._avg.orderingCosts);
      const storageCosts = await prisma.transaction
        .aggregate({
          _avg: {
            storageCosts: true,
          },
          where: {
            itemId: data.id,
            transaction: 'IN',
            deletedAt: null,
          },
        })
        .then((res) => res._avg.storageCosts);
      const quantity = await prisma.transaction
        .aggregate({
          _avg: {
            quantity: true,
          },
          where: {
            itemId: data.id,
            transaction: 'IN',
            deletedAt: null,
          },
        })
        .then((res) => res._avg.quantity);

      const eoq = Math.sqrt(
        (2 * (orderingCosts || 0) * (quantity || 0)) / (storageCosts || 1)
      );
      return {
        ...data,
        _avg: {
          orderingCosts,
          storageCosts,
          quantity,
        },
        eoq,
      };
    })
  );

  return new Response(
    JSON.stringify({
      data: dataWithEOQ,
      totalData: count,
      totalPage: Math.ceil(count / (limit as number)),
      message: 'Data found',
    }),
    {
      status: 200,
    }
  );
}
