'use client';
import { cn, transformToCurrency } from '@/common/libs';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/elements';
import { EOQType } from '@/common/types';
import dayjs from 'dayjs';
import { Text } from 'lucide-react';
import { Icon } from '@iconify/react';
import { generatePageNumbers } from '@/common/helper';

type EoqTableProps = {
  datas: EOQType[];
  isLoading?: boolean;
  page: number;
  handlePage: (page: number) => void;
  totalPage: number;
};

const EoqTable = ({
  datas,
  isLoading,
  handlePage,
  page,
  totalPage,
}: EoqTableProps) => {
  const pageNumber = totalPage ? generatePageNumbers(totalPage, page) : [];
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Item</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Ordering Cost</TableHead>
            <TableHead>Storage Cost</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Monthly Request</TableHead>
            <TableHead>EOQ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <Text> Loading...</Text>
          ) : (
            datas?.map((data: EOQType) => (
              <TableRow key={data.id}>
                <TableCell className=" font-medium">{data?.name}</TableCell>
                <TableCell>{data?.quantity}</TableCell>
                <TableCell>
                  {transformToCurrency(data?._avg?.orderingCosts)}
                </TableCell>
                <TableCell>
                  {transformToCurrency(data?._avg?.storageCosts)}
                </TableCell>
                <TableCell>
                  {dayjs(data?.createdAt).format('DD MMM YYYY')}
                </TableCell>
                <TableCell>{data?._avg?.quantity}</TableCell>
                <TableCell>{data?.eoq.toFixed(2)}</TableCell>
              </TableRow>
            )) || (
              <TableRow>
                <TableCell colSpan={9} className="text-center" align="center">
                  No data
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      <div className="flex flex-wrap gap-2  justify-center mt-4">
        <Button
          size="icon"
          className="h-7 w-7 bg-default-100 text-default-600 hover:text-primary-foreground"
          onClick={() => handlePage(page - 1)}
          disabled={page === 0 || page === 1}
        >
          <Icon
            icon="heroicons:chevron-left"
            className="w-3.5 h-3.5 rtl:rotate-180"
          />
        </Button>
        <ul className=" flex space-x-3 rtl:space-x-reverse items-center">
          {pageNumber?.map((val, pageIndex) => (
            <li key={pageIndex}>
              <Button
                onClick={() => handlePage(val)}
                aria-current="page"
                className={cn(
                  'h-7 w-7 bg-default-100 text-default-600 p-0 hover:bg-opacity-70 hover:text-primary-foreground',
                  {
                    'bg-primary text-primary-foreground':
                      pageIndex === page - 1,
                  }
                )}
              >
                {val}
              </Button>
            </li>
          ))}
        </ul>

        <Button
          size="icon"
          className="h-7 w-7 bg-default-100 text-default-600 hover:text-primary-foreground"
          onClick={() => handlePage(page + 1)}
          disabled={page === totalPage}
        >
          <Icon
            icon="heroicons:chevron-right"
            className="w-3.5 h-3.5 rtl:rotate-180"
          />
        </Button>
      </div>
    </>
  );
};

export default EoqTable;
