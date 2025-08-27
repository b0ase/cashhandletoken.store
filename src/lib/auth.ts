import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'handcash',
      name: 'HandCash',
      credentials: {
        handle: { label: 'Handle', type: 'text' },
        authToken: { label: 'Auth Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.handle || !credentials?.authToken) {
          return null;
        }

        try {
          // Here you would typically validate the HandCash auth token
          // For now, we'll create a basic user object
          return {
            id: credentials.handle,
            name: credentials.handle,
            email: `${credentials.handle}@handcash.io`,
            image: null,
            authToken: credentials.authToken,
          };
        } catch (error) {
          console.error('HandCash authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.authToken = user.authToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.authToken = token.authToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
