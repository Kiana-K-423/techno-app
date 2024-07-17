'use client';
import {
  Input,
  Label,
  Button,
  Card,
  CardContent,
  Toast,
} from '@/common/components/elements';
import { updateProfile } from '@/common/services';
import { ProfileType } from '@/common/types';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const PersonalDetails = () => {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      setTimeout(() => {
        update({ ...profile, image: '' });
      }, 1000);
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const onSubmit = async (
    data: Omit<ProfileType, 'id' | 'createdAt' | 'password'>
  ) => {
    await mutate(data);
  };

  useEffect(() => {
    setProfile({
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    });
  }, [session]);

  return (
    <Card className="rounded-t-none pt-6">
      <CardContent>
        <div className="grid grid-cols-12 md:gap-x-12 gap-y-5">
          <div className="col-span-12">
            <Label htmlFor="username" className="mb-2">
              Username
            </Label>
            <Input
              id="username"
              value={profile?.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="col-span-12">
            <Label htmlFor="email" className="mb-2">
              Email Address
            </Label>
            <Input
              id="email"
              value={profile?.email || ''}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button color="secondary">Cancel</Button>
          <Button onClick={() => onSubmit(profile)} color="primary">
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { PersonalDetails };
