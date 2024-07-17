'use client';

import RevinueChart from './components/revinue-chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DashboardSelect,
  DatePickerWithRange,
} from '@/common/components/elements';
import EcommerceStats from './components/ecommerce-stats';
interface DashboardProps {
  trans: {
    [key: string]: string;
  };
}
const Dashboard = ({ trans }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="text-2xl font-medium text-default-800">
          Ecommerce Dashboard
        </div>
        <DatePickerWithRange />
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <EcommerceStats />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-none pb-0 mb-0">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="flex-1 whitespace-nowrap">
              Average Revenue
            </CardTitle>
            <div className="flex-none">
              <DashboardSelect />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <RevinueChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
