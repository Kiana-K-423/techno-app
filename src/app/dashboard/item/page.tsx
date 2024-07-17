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
import { getCategorys, getItems, getRooms } from '@/common/services';
import { Room } from '@/common/types';
import { TableItem, CreateForm } from '@/module/item-management';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const ItemPage = () => {
  const [sort, setSort] = useState('asc');
  const [filterRoom, setFilterRoom] = useState('All Room');
  const [search, setSearch] = useState('');

  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getRooms({ limit: 100 }),
  });

  const { data: items } = useQuery({
    queryKey: ['items', { sort, search, filterRoom }],
    queryFn: () => getItems({ sort, roomId: filterRoom, search }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategorys({}),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const debounceSearch = useMemo(() => debounce(handleSearch, 500), []);

  return (
    <CardSnippet title="Item Management">
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

          <Select onValueChange={(v) => setFilterRoom(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Rooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Room">All Room</SelectItem>
              {rooms?.data.map((room: Room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
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
            rooms={rooms?.data || []}
            categories={categories?.data || []}
          />
        </div>
      </div>
      <TableItem
        items={items?.data || []}
        rooms={rooms?.data || []}
        categories={categories?.data || []}
      />
    </CardSnippet>
  );
};

export default ItemPage;
