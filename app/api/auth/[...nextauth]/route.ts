// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '../../../../lib/prisma';
import type { AuthOptions } from 'next-auth';

console.log("SERVER: GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
console.log("SERVER: GOOGLE_CLIENT_SECRET =", process.env.GOOGLE_CLIENT_SECRET);

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };