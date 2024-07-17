'use client';
import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardContent,
  Label,
} from '@/common/components/elements';
import { cn } from '@/common/libs';
import { Icon } from '@iconify/react';
import { Eye, EyeOff } from 'lucide-react';
import { updateProfilePassword } from '@/common/services';
import { useMutation } from '@tanstack/react-query';
import { ProfileType } from '@/common/types';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const [currentPasswordType, setCurrentPasswordType] =
    useState<string>('password');
  const [newPasswordType, setNewPasswordType] = useState<string>('password');
  const [confirmPasswordType, setConfirmPasswordType] =
    useState<string>('password');

  const { mutate } = useMutation({
    mutationFn: updateProfilePassword,
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: () => {
      toast.error('Failed to update password');
    },
  });

  const onSubmit = async (
    data: Omit<ProfileType, 'id' | 'createdAt' | 'email' | 'name'> & {
      confirmPassword: string;
      currentPassword: string;
    }
  ) => {
    await mutate(data);
  };

  return (
    <>
      <Card className="rounded-t-none pt-6">
        <CardContent>
          <div className="grid grid-cols-12 md:gap-x-12 gap-y-5">
            <div className="col-span-12 md:col-span-6">
              <Label
                htmlFor="currentPassword"
                className="mb-2 text-default-800"
              >
                Current Password
              </Label>
              <div className="relative">
                <Input id="currentPassword" type={currentPasswordType} />
                <Eye
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer',
                    currentPasswordType === 'text' && 'hidden'
                  )}
                  onClick={() => setCurrentPasswordType('text')}
                />
                <EyeOff
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer',
                    currentPasswordType === 'password' && 'hidden'
                  )}
                  onClick={() => setCurrentPasswordType('password')}
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6"></div>
            <div className="col-span-12 md:col-span-6">
              <Label htmlFor="newPassword" className="mb-2 text-default-800">
                New Password
              </Label>
              <div className="relative">
                <Input id="newPassword" type={newPasswordType} />
                <Eye
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer',
                    newPasswordType === 'text' && 'hidden'
                  )}
                  onClick={() => setNewPasswordType('text')}
                />
                <EyeOff
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer',
                    newPasswordType === 'password' && 'hidden'
                  )}
                  onClick={() => setNewPasswordType('password')}
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Label
                htmlFor="confirmPassword"
                className="mb-2 text-default-800"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input id="confirmPassword" type={confirmPasswordType} />
                <Eye
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer',
                    confirmPasswordType === 'text' && 'hidden'
                  )}
                  onClick={() => setConfirmPasswordType('text')}
                />
                <EyeOff
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer',
                    confirmPasswordType === 'password' && 'hidden'
                  )}
                  onClick={() => setConfirmPasswordType('password')}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 text-sm font-medium text-default-800">
            Password Requirements:
          </div>
          <div className="mt-3 space-y-1.5">
            {[
              'Minimum 8 characters long - the more, the better.',
              'At least one lowercase character.',
              'At least one number, symbol, or whitespace character.',
            ].map((item, index) => (
              <div
                className="flex items-center gap-1.5"
                key={`requirement-${index}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-default-400"></div>
                <div className="text-xs text-default-600">{item}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-5 justify-end">
            <Button color="secondary">Cancel</Button>
            <Button
              onClick={() =>
                onSubmit({
                  currentPassword: currentPasswordType,
                  password: newPasswordType,
                  confirmPassword: confirmPasswordType,
                })
              }
            >
              <Icon
                icon="heroicons:lock-closed"
                className="w-5 h-5 text-primary-foreground me-1"
              />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { ChangePassword };
