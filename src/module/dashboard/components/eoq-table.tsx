'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useThemeStore } from '@/common/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import {
  getGridConfig,
  getYAxisConfig,
  transformToCurrency,
} from '@/common/libs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/elements';
import { EOQType } from '@/common/types';
import dayjs from 'dayjs';
import { Loader2, Text } from 'lucide-react';

type EoqTableProps = {
  datas: EOQType[];
  isLoading?: boolean;
};

const EoqTable = ({ datas, isLoading }: EoqTableProps) => {
  return (
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
  );
};

export default EoqTable;
