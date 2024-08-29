'use client';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@/common/components/elements';
import { createTransaction, getEOQ } from '@/common/services';
import { Itemtype, TransactionType } from '@/common/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { z } from 'zod';

type CreateFormProps = {
  items: Itemtype[];
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
  itemId: z.string(),
  quantity: z.number(),
  type: z.string(),
  total: z.number(),
  transaction: z.enum(['IN', 'OUT']),
  orderingCosts: z.number(),
  storageCosts: z.number(),
});

export const CreateForm = ({ items, handleOpen, open }: CreateFormProps) => {
  const [selectedItem, setSelectedItem] = useState<Itemtype>();
  const { register, handleSubmit, reset, formState, control, watch, setValue } =
    useForm({
      resolver: zodResolver(schema),
      defaultValues: {
        itemId: '',
        quantity: 0,
        type: 'kg',
        total: 0,
        transaction: 'IN',
        orderingCosts: 0,
        storageCosts: 0,
        customerId: '',
      },
      mode: 'all',
    });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions-in'] });
      toast.success('Transaction created successfully');
    },
    onError: () => {
      toast.error('Failed to create transaction');
    },
  });

  const { data: eoq, isLoading } = useQuery({
    queryKey: [
      'eoq-item',
      {
        itemId: watch('itemId'),
        orderingCosts: watch('orderingCosts'),
        storageCosts: watch('storageCosts'),
      },
    ],
    queryFn: () =>
      getEOQ({
        itemId: watch('itemId'),
        orderingCosts: watch('orderingCosts'),
        storageCosts: watch('storageCosts'),
      }),
  });

  const onSubmit = async (
    data: Omit<TransactionType, 'id' | 'uuid' | 'createdAt'>
  ) => {
    await mutate(data as any);
    handleOpen();
    reset();
  };

  useEffect(() => {
    reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      setValue('total', +watch('quantity') * +(selectedItem?.price || 1));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedItem, watch('quantity')]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button type="button">Add Supply</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="create-item">
        <DialogHeader>
          <DialogTitle>Create Supply</DialogTitle>

          <form
            onSubmit={
              // @ts-ignore
              handleSubmit(onSubmit)
            }
            className=" space-y-5 pt-4"
          >
            <div>
              <Label className="mb-2">Item</Label>
              <Controller
                control={control}
                name="itemId"
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    classNamePrefix="select"
                    // @ts-ignore
                    options={items.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    styles={styles}
                    value={items.find((c) => c.name === value)}
                    onChange={(val) => {
                      // @ts-ignore
                      onChange(val?.value || '');
                      // @ts-ignore
                      setSelectedItem(items?.find((c) => c.id === val?.value));
                    }}
                    aria-invalid={formState.errors.itemId ? 'true' : 'false'}
                  />
                )}
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
            <div>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  <h1>EOQ: {eoq?.data?.eoq?.toFixed(2)}</h1>
                </div>
              )}
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
