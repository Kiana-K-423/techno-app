import prisma from '@/config/prisma';
import Credentials from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const foundUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!foundUser) {
          return null;
        }

        const valid = password === foundUser.password;

        if (!valid) {
          return null;
        }
        if (foundUser) {
          return foundUser as any;
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, trigger, session }: any) {
      console.log('trigger', trigger);
      if (trigger === 'update') {
        token.user = session.user;
        token.email = session.email;
      }
      return token;
    },
    async session({ session, trigger, newSession }: any) {
      console.log('trigger', trigger);
      if (trigger === 'update') {
        session.user = newSession?.user || session.user;
        session.email = newSession?.email || session.email;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV !== 'production',
};
