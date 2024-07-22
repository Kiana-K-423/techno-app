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
import { createTransaction } from '@/common/services';
import { Itemtype, TransactionType } from '@/common/types';
import { Units } from '@/constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
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
  const { register, handleSubmit, reset, formState, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      itemId: '',
      quantity: 0,
      type: 'Kg',
      total: 0,
      transaction: 'OUT',
      orderingCosts: 0,
      storageCosts: 0,
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction created successfully');
    },
    onError: () => {
      toast.error('Failed to create transaction');
    },
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

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button type="button">Add Transaction</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="create-item">
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>

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
                    // @ts-ignore
                    onChange={(val) => onChange(val?.value || '')}
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
              <Label className="mb-2">Unit</Label>
              <Controller
                control={control}
                name="type"
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    classNamePrefix="select"
                    // @ts-ignore
                    options={Units.map((unit) => ({
                      value: unit.id,
                      label: unit.name,
                    }))}
                    styles={styles}
                    value={{ value, label: value }}
                    // @ts-ignore
                    onChange={(val) => onChange(val?.value || '')}
                    aria-invalid={formState.errors.type ? 'true' : 'false'}
                  />
                )}
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
