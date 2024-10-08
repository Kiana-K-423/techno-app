'use client';

import {
  CardSnippet,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/elements';
import { debounce } from '@/common/libs';
import { getItems, getTransactions } from '@/common/services';
import { Itemtype } from '@/common/types';
import { TableItem, CreateForm } from '@/module/supply-management';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const SupplyPage = () => {
  const [sort, setSort] = useState('asc');
  const [filterItem, setFilterItem] = useState('All Item');
  const [search, setSearch] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [page, setPage] = useState(1);

  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItems({ limit: 100 }),
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions-in', { sort, search, filterItem, page }],
    queryFn: () =>
      getTransactions({ sort, itemId: filterItem, search, type: 'IN', page }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const debounceSearch = useMemo(() => debounce(handleSearch, 500), []);

  const handleCreateDialog = () => {
    setOpenCreateDialog((prev) => !prev);
  };

  return (
    <CardSnippet title="Supply Management">
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

          <Select onValueChange={(v) => setFilterItem(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Item">All Item</SelectItem>
              {items?.data.map((item: Itemtype) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
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
          <CreateForm
            items={items?.data || []}
            open={openCreateDialog}
            handleOpen={handleCreateDialog}
          />
        </div>
      </div>
      <TableItem
        items={items?.data || []}
        datas={transactions?.data || []}
        totalPage={transactions?.totalPage || 0}
        page={page}
        setPage={setPage}
      />
    </CardSnippet>
  );
};

export default SupplyPage;
