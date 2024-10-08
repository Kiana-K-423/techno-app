import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Avatar,
  AvatarFallback,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  Input,
  Label,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AvatarImage,
} from '@/common/components/elements';
import { Icon } from '@iconify/react';
import { CategoryType, Itemtype, Room } from '@/common/types';
import { cn, transformToCurrency } from '@/common/libs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItem, updateItem } from '@/common/services';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { generatePageNumbers } from '@/common/helper';

type TableItemProps = {
  items: Itemtype[];
  rooms: Room[];
  categories: CategoryType[];
  totalPage: number;
  page: number;
  setPage: (page: number) => void;
};

export const TableItem = ({
  items,
  categories,
  rooms,
  totalPage,
  page,
  setPage,
}: TableItemProps) => {
  const [open, setOpen] = useState(false);
  const [selectItem, setSelectItem] = useState<Itemtype | null>(null);

  console.log('page ', page);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete item');
    },
  });

  const onDelete = async (id: string) => {
    await mutate(id);
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handlePage = (page: number) => {
    setPage(page);
  };

  const pageNumber = generatePageNumbers(totalPage, page);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Item</TableHead>
            {/* <TableHead> Room</TableHead> */}
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item: Itemtype) => (
            <TableRow key={item.name}>
              <TableCell className=" font-medium  text-card-foreground/80">
                <div className="flex gap-3 items-center">
                  <Avatar className="rounded-full">
                    <AvatarImage src={item.image} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <span className=" text-sm   text-card-foreground">
                    {item.name}
                  </span>
                </div>
              </TableCell>

              {/* <TableCell>{item.room?.name}</TableCell> */}
              <TableCell>{item.category?.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{transformToCurrency(item.price)}</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    color="secondary"
                    className=" h-7 w-7"
                    onClick={() => {
                      setSelectItem(item);
                      handleOpen();
                    }}
                  >
                    <Icon icon="heroicons:pencil" className=" h-4 w-4  " />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className=" h-7 w-7"
                        color="secondary"
                      >
                        <Icon icon="heroicons:trash" className=" h-4 w-4  " />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className=" bg-secondary">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/80"
                          onClick={() => onDelete(item.id)}
                        >
                          Ok
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          )) || (
            <TableRow>
              <TableCell colSpan={7} className="text-center" align="center">
                No data
              </TableCell>
            </TableRow>
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
          {pageNumber.map((val, pageIndex) => (
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
      {selectItem && (
        <EditingDialog
          item={selectItem as Itemtype}
          rooms={rooms}
          categories={categories}
          open={open}
          handleOpen={handleOpen}
        />
      )}
    </>
  );
};

type EditingDialogProps = {
  item: Itemtype;
  rooms: Room[];
  categories: CategoryType[];
  open: boolean;
  handleOpen: () => void;
};

const units = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'g', label: 'Gram' },
  { value: 'l', label: 'Liter' },
  { value: 'ml', label: 'Milliliter' },
  { value: 'm', label: 'Meter' },
  { value: 'cm', label: 'Centimeter' },
  { value: 'mm', label: 'Millimeter' },
  { value: 'ft', label: 'Feet' },
  { value: 'inch', label: 'Inch' },
  { value: 'pcs', label: 'Pieces' },
];

const styles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: '14px',
  }),
};

const schema = z.object({
  id: z.string(),
  name: z.string(),
  roomId: z.string(),
  categoryId: z.string(),
  quantity: z.number(),
  unit: z.string(),
  price: z.number(),
});

const EditingDialog = ({
  item,
  categories,
  rooms,
  open,
  handleOpen,
}: EditingDialogProps) => {
  const { register, handleSubmit, reset, formState, control, setValue } =
    useForm({
      resolver: zodResolver(schema),
      defaultValues: {
        id: item.id,
        name: item.name,
        roomId: item.roomId,
        categoryId: item.categoryId,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
      },
      mode: 'all',
    });

  const [image, setImage] = useState<File | string | null>(item.image);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item updated successfully');
    },
    onError: () => {
      toast.error('Failed to update item');
    },
  });

  const onSubmit = async (data: Omit<Itemtype, 'createdAt' | 'image'>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (image) {
      formData.append('image', image);
    }

    await mutate(formData as any);
    handleOpen();
  };

  useEffect(() => {
    reset();
    setImage(null);
    setValue('id', item.id);
    setValue('name', item.name);
    setValue('roomId', item.roomId);
    setValue('categoryId', item.categoryId);
    setValue('quantity', item.quantity);
    setValue('unit', item.unit);
    setValue('price', item.price);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  return (
    <Dialog open={open} onOpenChange={handleOpen} key={item?.name}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          color="secondary"
          className=" h-7 w-7"
        >
          <Icon icon="heroicons:pencil" className=" h-4 w-4  " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item {item.name}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className=" space-y-5 pt-4">
            <div>
              <Input
                type="hidden"
                {...register('id', {
                  required: true,
                  minLength: 1,
                })}
              />
            </div>
            <div>
              <Label className="mb-2">Name</Label>
              <Input
                placeholder="Name"
                {...register('name', {
                  required: true,
                  minLength: 1,
                })}
              />
            </div>
            {/* <div>
              <Label className="mb-2">Room</Label>
              <Controller
                control={control}
                name="roomId"
                rules={{ required: true }}
                render={({ field: { ref, onChange } }) => {
                  const defaultValue = rooms.find((c) => c.id === item.roomId);
                  return (
                    <Select
                      ref={ref}
                      classNamePrefix="select"
                      // @ts-ignore
                      options={rooms.map((room) => ({
                        value: room.id,
                        label: room.name,
                      }))}
                      styles={styles}
                      defaultValue={{
                        value: defaultValue?.id,
                        label: defaultValue?.name,
                      }}
                      onChange={(val) => onChange(val?.value || '')}
                      aria-invalid={formState.errors.roomId ? 'true' : 'false'}
                    />
                  );
                }}
              />
            </div> */}
            <div>
              <Label className="mb-2">Category</Label>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: true }}
                render={({ field: { ref, onChange } }) => {
                  const defaultValue = categories.find(
                    (c) => c.id === item.categoryId
                  );
                  return (
                    <Select
                      ref={ref}
                      classNamePrefix="select"
                      // @ts-ignore
                      options={categories?.map((category) => ({
                        value: category.id,
                        label: category.name,
                      }))}
                      styles={styles}
                      defaultValue={{
                        value: defaultValue?.id,
                        label: defaultValue?.name,
                      }}
                      onChange={(val) => onChange(val?.value || '')}
                      aria-invalid={
                        formState.errors.categoryId ? 'true' : 'false'
                      }
                    />
                  );
                }}
              />
            </div>
            <div>
              <Label className="mb-2">Quantity</Label>
              <Input
                placeholder="Quantity"
                type="number"
                {...register('quantity', {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label className="mb-2">Unit</Label>
              <Controller
                name="unit"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    classNamePrefix="select"
                    // @ts-ignore
                    options={units}
                    styles={styles}
                    value={units.find((c) => c.value === value)}
                    onChange={(val) => onChange(val?.value || '')}
                    aria-invalid={formState.errors.unit ? 'true' : 'false'}
                  />
                )}
              />
            </div>
            <div>
              <Label className="mb-2">Price</Label>
              <Input
                placeholder="Price"
                type="number"
                {...register('price', {
                  valueAsNumber: true,
                  required: true,
                })}
                aria-invalid={formState.errors.price ? 'true' : 'false'}
              />
            </div>
            {/* <div>
              <Label className="mb-2">Image</Label>
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImage(file);
                  }
                }}
              />
            </div> */}
            <div className="flex justify-end space-x-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" color="destructive">
                  Cancel
                </Button>
              </DialogClose>
              <Button color="success" type="submit">
                Save
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
