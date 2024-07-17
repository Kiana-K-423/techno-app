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
import { getRooms } from '@/common/services';
import { TableItem, CreateForm } from '@/module/room-management';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const RoomPage = () => {
  const [sort, setSort] = useState('asc');
  const [search, setSearch] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const { data: rooms } = useQuery({
    queryKey: ['rooms', { sort, search }],
    queryFn: () => getRooms({ sort, search }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const debounceSearch = useMemo(() => debounce(handleSearch, 500), []);

  const handleCreateDialog = () => {
    setOpenCreateDialog((prev) => !prev);
  };

  return (
    <CardSnippet title="Room Management">
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
      <TableItem rooms={rooms?.data || []} />
    </CardSnippet>
  );
};

export default RoomPage;
