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
import { CategoryType, Itemtype, Room, TransactionType } from '@/common/types';
import { transformToCurrency } from '@/common/libs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteItem,
  deleteTransaction,
  updateItem,
  updateTransaction,
} from '@/common/services';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';

type TableItemProps = {
  items: Itemtype[];
  datas: TransactionType[];
};

export const TableItem = ({ items, datas }: TableItemProps) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
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

  return (
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
                <EditingDialog
                  transaction={data}
                  items={items}
                  open={open}
                  handleOpen={handleOpen}
                />
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
  );
};

type EditingDialogProps = {
  items: Itemtype[];
  transaction: TransactionType;
  open: boolean;
  handleOpen: () => void;
};

const transactionType = [
  { value: 'IN', label: 'IN' },
  { value: 'OUT', label: 'OUT' },
];

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
  const { register, handleSubmit, reset, formState, control } = useForm({
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
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpen} key={transaction.uuid}>
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
          <DialogTitle>Edit Transaction {transaction.uuid}</DialogTitle>
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
                {...register('quantity', {
                  required: true,
                  valueAsNumber: true,
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
                {...register('total', {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label className="mb-2">Transaction Type</Label>
              <Controller
                name="transaction"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    classNamePrefix="select"
                    // @ts-ignore
                    options={transactionType}
                    styles={styles}
                    value={transactionType.find((c) => c.value === value)}
                    onChange={(val) => onChange(val?.value || '')}
                    aria-invalid={
                      formState.errors.transaction ? 'true' : 'false'
                    }
                  />
                )}
              />
            </div>
            <div>
              <Label className="mb-2">Ordering Costs</Label>
              <Input
                placeholder="Ordering Costs"
                type="number"
                {...register('orderingCosts', {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label className="mb-2">Storage Costs</Label>
              <Input
                placeholder="Storage Costs"
                type="number"
                {...register('storageCosts', {
                  required: true,
                  valueAsNumber: true,
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
