import prisma from '@/config/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;
  const itemId = searchParams?.get('itemId') || '';

  if (itemId !== '' || itemId !== null) {
    const orderingCosts = searchParams.get('orderingCosts') || 0;
    const storageCosts = searchParams.get('storageCosts') || 0;

    const quantity = await prisma.transaction
      .aggregate({
        _avg: {
          quantity: true,
        },
        where: {
          itemId: itemId,
          transaction: 'OUT',
          deletedAt: null,
        },
      })
      .then((res) => res._avg.quantity as number);

    const eoq = Math.sqrt(
      (2 * (+orderingCosts as number) * ((+quantity as number) * 12)) /
        (+storageCosts as number)
    );

    return new Response(
      JSON.stringify({
        data: {
          itemId,
          orderingCosts,
          storageCosts,
          quantity,
          eoq,
        },
        message: 'Data found',
      }),
      {
        status: 200,
      }
    );
  } else {
    const datas = await prisma.item.findMany({
      include: {
        // @ts-ignore
        deletedAt: null,
        _count: {
          select: {
            transactions: {
              where: {
                transaction: 'IN',
                deletedAt: null,
              },
            },
          },
        },
      },
      where: {
        deletedAt: null,
        category: {
          deletedAt: null,
        },
        room: {
          deletedAt: null,
        },
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
        JSON.stringify({
          message: 'Data not found',
          data: null,
          totalData: 0,
          totalPage: 0,
        }),
        {
          status: 404,
        }
      );
    }

    const dataWithEOQ = await Promise.all(
      datas?.map(async (data) => {
        const orderingCosts = await prisma.transaction
          .aggregate({
            _avg: {
              orderingCosts: true,
            },
            where: {
              itemId: data?.id,
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
              itemId: data?.id,
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
              itemId: data?.id,
              transaction: 'OUT',
              deletedAt: null,
            },
          })
          .then((res) => res._avg.quantity);

        const eoq = Math.sqrt(
          (2 * (orderingCosts || 0) * ((quantity || 0) * 12)) /
            (storageCosts || 1)
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
}
