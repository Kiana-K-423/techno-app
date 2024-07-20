'use client';

import EoqTable from './components/eoq-table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DashboardSelect,
  DatePickerWithRange,
} from '@/common/components/elements';
import EcommerceStats from './components/ecommerce-stats';
import { useState } from 'react';
import { getDashboard } from '@/common/services/dashboard';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getEOQ } from '@/common/services';

interface DashboardProps {
  trans: {
    [key: string]: string;
  };
}
const Dashboard = ({ trans }: DashboardProps) => {
  const [selectedDate, setSelectedDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [page, setPage] = useState(1);

  const { data: dashboard, isFetching } = useQuery({
    queryKey: ['dashboard', { from: selectedDate.from, to: selectedDate.to }],
    queryFn: () =>
      getDashboard({
        from: selectedDate?.from
          ? format(selectedDate.from, 'yyyy-MM-dd')
          : format(dayjs().startOf('month').toDate(), 'yyyy-MM-dd'),
        to: selectedDate?.to
          ? format(selectedDate.to, 'yyyy-MM-dd')
          : format(dayjs().endOf('month').toDate(), 'yyyy-MM-dd'),
      }),
  });

  const { data: eoq, isLoading } = useQuery({
    queryKey: ['eoq', { month: '', year: '', page: page }],
    queryFn: () =>
      getEOQ({
        month: '',
        year: '',
        page: page,
        limit: 10,
      }),
  });
  const handleSelectDate = (date: { from: Date; to: Date }) => {
    setSelectedDate(date);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="text-2xl font-medium text-default-800">Dashboard</div>
        <DatePickerWithRange date={selectedDate} onSelect={handleSelectDate} />
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <EcommerceStats
              dashboard={dashboard?.data || 0}
              isFetching={isFetching}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-none pb-0 mb-3">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="flex-1 whitespace-nowrap">
              Economic Order Quantity (EOQ)
            </CardTitle>
            <div className="flex-none">{/* <DashboardSelect /> */}</div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <EoqTable
            datas={eoq?.data || []}
            isLoading={isLoading}
            handlePage={handlePageChange}
            page={page}
            totalPage={eoq?.totalPage || 0}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
