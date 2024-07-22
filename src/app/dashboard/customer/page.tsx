'use client';

import {
  Button,
  CardSnippet,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/elements';
import { debounce } from '@/common/libs';
import { getCategorys, getCustomers } from '@/common/services';
import { TableItem, CreateForm } from '@/module/customer-management';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const CustomerPage = () => {
  const [sort, setSort] = useState('asc');
  const [search, setSearch] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const { data: customers } = useQuery({
    queryKey: ['customers', { sort, search }],
    queryFn: () => getCustomers({ sort, search }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const debounceSearch = useMemo(() => debounce(handleSearch, 500), []);

  const handleCreateDialog = () => {
    setOpenCreateDialog((prev) => !prev);
  };

  return (
    <CardSnippet title="Customer Management">
      <div className="flex justify-between items-center gap-4 mb-1">
        <div className="flex gap-3">
          <Select onValueChange={(v) => setSort(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full">
            <Search className="w-4 h-4 text-default-400 absolute top-1/2 left-2 -translate-y-1/2" />
            <Input
              placeholder="Search"
              className="pl-7 h-full"
              // @ts-ignore
              onChange={debounceSearch}
            />
          </div>
        </div>
        <div className="flex-none">
          <CreateForm open={openCreateDialog} handleOpen={handleCreateDialog} />
        </div>
      </div>
      <TableItem
        datas={customers?.data || []}
        totalPage={customers?.totalPage || 0}
      />
    </CardSnippet>
  );
};

export default CustomerPage;
