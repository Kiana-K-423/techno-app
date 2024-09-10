import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
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
} from '@/common/components/elements';
import { Icon } from '@iconify/react';
import { CategoryType, CustomerType, Room } from '@/common/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteCustomer,
  updateCategory,
  updateCustomer,
} from '@/common/services';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { generatePageNumbers } from '@/common/helper';
import { cn } from '@/common/libs';

type TableItemProps = {
  datas: CustomerType[];
  totalPage: number;
  page: number;
  setPage: (page: number) => void;
};

export const TableItem = ({
  datas,
  totalPage,
  page,
  setPage,
}: TableItemProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CustomerType | null>(null);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Category deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete category');
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
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datas?.map((data: CustomerType) => (
            <TableRow key={data.name}>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.phone}</TableCell>
              <TableCell>{data.address}</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    color="secondary"
                    className=" h-7 w-7"
                    onClick={() => {
                      setSelected(data);
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
                          onClick={() => onDelete(data.id)}
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
      {selected && (
        <EditingDialog data={selected} open={open} handleOpen={handleOpen} />
      )}
    </>
  );
};

type EditingDialogProps = {
  data: CustomerType | null;
  open: boolean;
  handleOpen: () => void;
};

const schema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  address: z.string(),
});

const EditingDialog = ({ data, open, handleOpen }: EditingDialogProps) => {
  const { register, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      phone: data?.phone,
      address: data?.address,
    },
    mode: 'all',
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated successfully');
    },
    onError: () => {
      toast.error('Failed to update customer');
    },
  });

  const onSubmit = async (data: Omit<CustomerType, 'createdAt'>) => {
    await mutate(data as any);
    handleOpen();
  };

  useEffect(() => {
    reset();
    setValue('id', data?.id);
    setValue('name', data?.name);
    setValue('phone', data?.phone);
    setValue('address', data?.address);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Customer {data?.name}</DialogTitle>
          <form
            onSubmit={
              // @ts-ignore
              handleSubmit(onSubmit)
            }
            className=" space-y-5 pt-4"
          >
            <div>
              <Input
                type="hidden"
                {...register('id', {
                  required: true,
                  minLength: 1,
                })}
                defaultValue={data?.id}
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
                defaultValue={data?.name}
              />
            </div>
            <div>
              <Label className="mb-2">Phone</Label>
              <Input
                placeholder="Phone"
                {...register('phone', {
                  required: true,
                  minLength: 1,
                })}
                defaultValue={data?.phone}
              />
            </div>
            <div>
              <Label className="mb-2">Address</Label>
              <Input
                placeholder="Address"
                {...register('address', {
                  required: true,
                  minLength: 1,
                })}
                defaultValue={data?.address}
              />
            </div>
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
