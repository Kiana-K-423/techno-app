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
import { createItem } from '@/common/services';
import { CategoryType, Itemtype, Room } from '@/common/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { z } from 'zod';

type CreateFormProps = {
  rooms: Room[];
  categories: CategoryType[];
};

const units = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'g', label: 'Gram' },
  { value: 'l', label: 'Liter' },
  { value: 'ml', label: 'Milliliter' },
  { value: 'pcs', label: 'Pieces' },
];

const styles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: '14px',
  }),
};

const schema = z.object({
  name: z.string(),
  roomId: z.string(),
  categoryId: z.string(),
  quantity: z.number(),
  unit: z.string(),
  price: z.number(),
});

export const CreateForm = ({ rooms, categories }: CreateFormProps) => {
  const { register, handleSubmit, reset, formState, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      roomId: '',
      categoryId: '',
      quantity: 0,
      unit: '',
      price: 0,
    },
  });

  const [image, setImage] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item created successfully');
    },
    onError: () => {
      toast.error('Failed to create item');
    },
  });

  const onSubmit = async (
    data: Omit<Itemtype, 'id' | 'createdAt' | 'image'>
  ) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (image) {
      formData.append('image', image);
    }

    await mutate(formData as any);
    reset();
    setImage(null);
  };

  useEffect(() => {
    reset();
    setImage(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">Add Item</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="create-item">
        <DialogHeader>
          <DialogTitle>Create Item</DialogTitle>
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
              <Label className="mb-2">Room</Label>
              <Controller
                control={control}
                name="roomId"
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    classNamePrefix="select"
                    // @ts-ignore
                    options={rooms.map((room) => ({
                      value: room.id,
                      label: room.name,
                    }))}
                    styles={styles}
                    value={rooms.find((c) => c.name === value)}
                    // @ts-ignore
                    onChange={(val) => onChange(val?.value || '')}
                    aria-invalid={formState.errors.roomId ? 'true' : 'false'}
                  />
                )}
              />
            </div>
            <div>
              <Label className="mb-2">Category</Label>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    classNamePrefix="select"
                    // @ts-ignore
                    options={categories?.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))}
                    styles={styles}
                    value={categories.find((c) => c.name === value)}
                    // @ts-ignore
                    onChange={(val) => onChange(val?.value || '')}
                    aria-invalid={
                      formState.errors.categoryId ? 'true' : 'false'
                    }
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
            <div>
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
