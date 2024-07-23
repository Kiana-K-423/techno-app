'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label, Checkbox } from '@/common/components/elements';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { cn } from '@/common/libs';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import googleIcon from '@public/images/auth/google.png';
import facebook from '@public/images/auth/facebook.png';
import twitter from '@public/images/auth/twitter.png';
import GithubIcon from '@public/images/auth/github.png';
import SiteLogo from '@public/icon-techno.png';
import { useMediaQuery } from '@/common/hooks';

const schema = z.object({
  email: z.string().email({ message: 'Your email is invalid.' }),
  password: z.string().min(4),
});
export const LogInForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState('password');
  const togglePasswordType = () => {
    if (passwordType === 'text') {
      setPasswordType('password');
    } else if (passwordType === 'password') {
      setPasswordType('text');
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'admin123',
    },
  });

  const isDesktop2xl = useMediaQuery('(max-width: 1530px)');

  const onSubmit = (data: any) => {
    startTransition(async () => {
      let response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (response?.ok) {
        toast.success('Login Successful');
        window.location.assign('/dashboard');
        reset();
      } else if (response?.error) {
        toast.error(response?.error);
      }
    });
  };
  return (
    <div className="w-full">
      <Link
        href="/dashboard"
        className="inline-block w-full items-center justify-center"
      >
        <Image
          src={SiteLogo}
          alt="logo"
          className="h-12 w-12 2xl:h-14 2xl:w-14 text-primary"
        />
      </Link>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Hey, Hello 👋
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Enter the information you entered while registering.
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="2xl:mt-7 mt-8">
        <div className="relative">
          <Input
            removeWrapper
            type="email"
            id="email"
            size={!isDesktop2xl ? 'xl' : 'lg'}
            placeholder=" "
            disabled={isPending}
            {...register('email')}
            className={cn('peer', {
              'border-destructive': errors.email,
            })}
          />
          <Label
            htmlFor="email"
            className={cn(
              ' absolute text-base text-default-600  rounded-t duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0]   bg-background  px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1',
              {
                ' text-sm ': isDesktop2xl,
              }
            )}
          >
            Email
          </Label>
        </div>
        {errors.email && (
          <div className=" text-destructive mt-2">{errors.email.message}</div>
        )}

        <div className="relative mt-6">
          <Input
            removeWrapper
            type={passwordType === 'password' ? 'password' : 'text'}
            id="password"
            size={!isDesktop2xl ? 'xl' : 'lg'}
            placeholder=" "
            disabled={isPending}
            {...register('password')}
            className={cn('peer', {
              'border-destructive': errors.password,
            })}
          />
          <Label
            htmlFor="password"
            className={cn(
              ' absolute text-base  rounded-t text-default-600  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0]   bg-background  px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1',
              {
                ' text-sm ': isDesktop2xl,
              }
            )}
          >
            Password
          </Label>
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={togglePasswordType}
          >
            {passwordType === 'password' ? (
              <Icon icon="heroicons:eye" className="w-4 h-4 text-default-400" />
            ) : (
              <Icon
                icon="heroicons:eye-slash"
                className="w-4 h-4 text-default-400"
              />
            )}
          </div>
        </div>
        {errors.password && (
          <div className=" text-destructive mt-2">
            {errors.password.message}
          </div>
        )}

        <Button
          className="w-full mt-4"
          disabled={isPending}
          size={!isDesktop2xl ? 'lg' : 'md'}
        >
          {isPending && (
            <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
          )}
          {isPending ? 'Loading...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};
