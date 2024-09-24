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
import { Itemtype, TransactionType } from '@/common/types';
import { cn, transformToCurrency } from '@/common/libs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTransaction, updateTransaction } from '@/common/services';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { generatePageNumbers } from '@/common/helper';

type TableItemProps = {
  items: Itemtype[];
  datas: TransactionType[];
  totalPage: number;
  page: number;
  setPage: (page: number) => void;
};

export const TableItem = ({
  items,
  datas,
  totalPage,
  page,
  setPage,
}: TableItemProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TransactionType | null>(null);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions-in'] });
      toast.success('Transaction deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete transaction');
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
            <TableHead className="font-semibold">UUID</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Total Transaction</TableHead>
            <TableHead>Transaction Type</TableHead>
            <TableHead>Ordering Costs</TableHead>
            <TableHead>Storage Costs</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datas?.map((data: TransactionType) => (
            <TableRow key={data.uuid}>
              <TableCell className=" font-medium">{data.uuid}</TableCell>
              <TableCell>{data?.item?.name}</TableCell>
              <TableCell>{data.quantity}</TableCell>
              <TableCell>{data.type}</TableCell>
              <TableCell>{transformToCurrency(data.total)}</TableCell>
              <TableCell>{data.transaction}</TableCell>
              <TableCell>{transformToCurrency(data.orderingCosts)}</TableCell>
              <TableCell>{transformToCurrency(data.storageCosts)}</TableCell>
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
              <TableCell colSpan={9} className="text-center" align="center">
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
        <EditingDialog
          transaction={selected as TransactionType}
          items={items}
          open={open}
          handleOpen={handleOpen}
        />
      )}
    </>
  );
};

type EditingDialogProps = {
  items: Itemtype[];
  transaction: TransactionType;
  open: boolean;
  handleOpen: () => void;
};

const styles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: '14px',
  }),
};

const schema = z.object({
  id: z.string(),
  itemId: z.string(),
  quantity: z.number(),
  type: z.string(),
  total: z.number(),
  transaction: z.enum(['IN', 'OUT']),
  orderingCosts: z.number(),
  storageCosts: z.number(),
});

const EditingDialog = ({
  items,
  transaction,
  open,
  handleOpen,
}: EditingDialogProps) => {
  const { register, handleSubmit, reset, formState, control, setValue } =
    useForm({
      resolver: zodResolver(schema),
      defaultValues: {
        id: transaction.id,
        itemId: transaction.itemId,
        quantity: transaction.quantity,
        type: transaction.type,
        total: transaction.total,
        transaction: transaction.transaction,
        orderingCosts: transaction.orderingCosts,
        storageCosts: transaction.storageCosts,
      },
      mode: 'all',
    });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions-in'] });
      toast.success('Transaction updated successfully');
    },
    onError: () => {
      toast.error('Failed to update transaction');
    },
  });

  const onSubmit = async (
    data: Omit<TransactionType, 'createdAt' | 'uuid'>
  ) => {
    await mutate(data as any);
    handleOpen();
  };

  useEffect(() => {
    reset();

    setValue('id', transaction.id);
    setValue('itemId', transaction.itemId);
    setValue('quantity', transaction.quantity);
    setValue('type', transaction.type);
    setValue('total', transaction.total);
    setValue('transaction', transaction.transaction);
    setValue('orderingCosts', transaction.orderingCosts);
    setValue('storageCosts', transaction.storageCosts);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction?.id]);

  return (
    <Dialog open={open} onOpenChange={handleOpen} key={transaction.uuid}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Supply {transaction.uuid}</DialogTitle>
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
              />
            </div>
            <div>
              <Label className="mb-2">Item</Label>
              <Controller
                control={control}
                name="itemId"
                rules={{ required: true }}
                render={({ field: { ref, onChange } }) => {
                  const defaultValue = items.find(
                    (c) => c.id === transaction.itemId
                  );
                  return (
                    <Select
                      ref={ref}
                      classNamePrefix="select"
                      // @ts-ignore
                      options={items.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      styles={styles}
                      defaultValue={{
                        value: defaultValue?.id,
                        label: defaultValue?.name,
                      }}
                      onChange={(val) => onChange(val?.value || '')}
                      aria-invalid={formState.errors.itemId ? 'true' : 'false'}
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
                min={1}
                {...register('quantity', {
                  required: true,
                  valueAsNumber: true,
                  min: 1,
                })}
              />
            </div>
            <div>
              <Label className="mb-2">Type</Label>
              <Input
                placeholder="Type"
                {...register('type', { required: true })}
              />
            </div>
            <div>
              <Label className="mb-2">Total</Label>
              <Input
                placeholder="Total"
                type="number"
                min={0}
                {...register('total', {
                  required: true,
                  valueAsNumber: true,
                  min: 0,
                })}
              />
            </div>
            <div>
              <Label className="mb-2">Ordering Costs</Label>
              <Input
                placeholder="Ordering Costs"
                type="number"
                min={0}
                {...register('orderingCosts', {
                  required: true,
                  valueAsNumber: true,
                  min: 0,
                })}
              />
            </div>
            <div>
              <Label className="mb-2">Storage Costs</Label>
              <Input
                placeholder="Storage Costs"
                type="number"
                min={0}
                {...register('storageCosts', {
                  required: true,
                  valueAsNumber: true,
                  min: 0,
                })}
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
