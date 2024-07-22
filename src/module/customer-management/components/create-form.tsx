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
import { createCategory, createCustomer } from '@/common/services';
import { CustomerType, Room } from '@/common/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

type CreateFormProps = {
  open: boolean;
  handleOpen: () => void;
};

const schema = z.object({
  name: z.string(),
  phone: z.string(),
  address: z.string(),
});

export const CreateForm = ({ handleOpen, open }: CreateFormProps) => {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully');
    },
    onError: () => {
      toast.error('Failed to create customer');
    },
  });

  const onSubmit = async (data: Omit<CustomerType, 'id' | 'createdAt'>) => {
    await mutate(data as any);
    reset();
    handleOpen();
  };

  useEffect(() => {
    reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button type="button">Add Customer</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="create-item">
        <DialogHeader>
          <DialogTitle>Create Customer</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className=" space-y-5 pt-4">
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
            <div>
              <Label className="mb-2">Phone</Label>
              <Input
                placeholder="Phone"
                {...register('phone', {
                  required: true,
                  minLength: 1,
                })}
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
