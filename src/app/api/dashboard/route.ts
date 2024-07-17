import prisma from '@/config/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  let from = searchParams.get('from') || '';
  let to = searchParams.get('to') || '';

  if (from === '' || to === '') {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    from = from || `${year}-${month}-01`;
    to = to || `${year}-${month}-${day}`;
  }

  const items = await prisma.item.count({
    where: {
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
      deletedAt: null,
    },
  });

  const supplys = await prisma.transaction.count({
    where: {
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
      transaction: 'IN',
      deletedAt: null,
    },
  });

  const transactions = await prisma.transaction.count({
    where: {
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
      transaction: 'OUT',
      deletedAt: null,
    },
  });

  const total = await prisma.transaction.aggregate({
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
      deletedAt: null,
    },
  });

  return new Response(
    JSON.stringify({
      data: {
        items,
        supplys,
        transactions,
        total: total._sum.total,
      },
      message: 'Data found',
    }),
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    }
  );
}
