import { Itemtype } from '@/common/types';
import prisma from '@/config/prisma';
import { unlink, writeFile } from 'fs';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'asc';
  let roomId = searchParams.get('roomId') || '';

  if (roomId === 'All Room') {
    roomId = '';
  }

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
    },
    where: {
      name: {
        contains: search,
      },
      roomId: {
        contains: roomId,
      },
      deletedAt: null,
    },
    orderBy: {
      id: sort as 'asc' | 'desc',
    },
    skip: (((+page as number) - 1) * (+limit as number)) as number,
    take: +limit as number,
  });

  const count = await prisma.item.count({
    where: {
      name: {
        contains: search,
      },
      roomId: {
        contains: roomId,
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

  const newData = datas.map((data) => {
    return {
      ...data,
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/images/items/${data.image}`,
    };
  });

  return new Response(
    JSON.stringify({
      data: newData,
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
  const body = await request.formData();

  const name = body.get('name');
  const quantity = body.get('quantity');
  const price = body.get('price');
  const unit = body.get('unit');
  const categoryId = body.get('categoryId');
  const image = body.get('image');

  if (!name || !quantity || !price || !unit || !categoryId) {
    return new Response(
      JSON.stringify({ message: 'All fields are required' }),
      {
        status: 400,
      }
    );
  }
  let filename = '';

  if (image) {
    // @ts-ignore
    const buffer = Buffer.from(await image?.arrayBuffer());
    filename = `item-${Date.now()}.jpg`;

    try {
      await writeFile(`public/images/items/${filename}`, buffer, (err) => {
        if (err) {
          return new Response(
            JSON.stringify({ message: 'Failed to upload image' }),
            {
              status: 500,
            }
          );
        }
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Failed to upload image' }),
        {
          status: 500,
        }
      );
    }
  }

  const data = await prisma.item.create({
    data: {
      name: String(name),
      quantity: +quantity,
      price: +price,
      unit: String(unit),
      categoryId: String(categoryId),
      roomId: String('cf38281a-02c5-4342-be95-9073b3a8df64'),
      image: filename || '/images/avatar/avatar-9.jpg',
    },
  });

  return new Response(JSON.stringify({ message: 'Data created', data: data }), {
    status: 201,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.formData();

  const id = body.get('id');
  const name = body.get('name');
  const quantity = body.get('quantity');
  const price = body.get('price');
  const unit = body.get('unit');
  const categoryId = body.get('categoryId');
  const image = body.get('image');

  if (!id) {
    return new Response(
      JSON.stringify({ message: 'All fields are required' }),
      {
        status: 400,
      }
    );
  }

  const exist = await prisma.item.findUnique({
    where: {
      id: String(id),
    },
  });

  if (!exist) {
    return new Response(JSON.stringify({ message: 'Data not found' }), {
      status: 404,
    });
  }

  let filename = exist?.image;
  //? Check if image is updated
  if (image && typeof image !== 'string') {
    // @ts-ignore
    const buffer = Buffer.from(await image?.arrayBuffer());
    filename = `item-${Date.now()}.jpg`;

    try {
      await writeFile(
        `public/images/items/${filename}`,
        buffer,
        async (err) => {
          if (err) {
            return new Response(
              JSON.stringify({ message: 'Failed to upload image' }),
              {
                status: 500,
              }
            );
          }

          if (exist?.image) {
            try {
              await unlink(`public/images/items/${exist?.image}`, (err) => {
                if (err) {
                  return new Response(
                    JSON.stringify({ message: 'Failed to delete image' }),
                    {
                      status: 500,
                    }
                  );
                }
              });
            } catch (error) {
              return new Response(
                JSON.stringify({ message: 'Failed to delete image' }),
                {
                  status: 500,
                }
              );
            }
          }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Failed to upload image' }),
        {
          status: 500,
        }
      );
    }
  }

  const data = await prisma.item.update({
    where: {
      id: String(id),
    },
    data: {
      name: String(name) || exist?.name,
      quantity: +Number(quantity) || exist?.quantity,
      price: +Number(price) || +exist?.price,
      unit: String(unit) || exist?.unit,
      categoryId: String(categoryId) || exist?.categoryId,
      roomId: exist?.roomId,
      image: filename || exist?.image,
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

  const data = await prisma.item.update({
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
