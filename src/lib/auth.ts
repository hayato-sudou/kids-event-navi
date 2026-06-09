import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import bcrypt from 'bcryptjs';
import { getSupabaseAdmin } from '@/lib/db';
import { signInSchema } from '@/lib/validations/auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  providers: [
    // --- Google SSO ---
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // --- メール＋パスワード ---
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'メールアドレス', type: 'email' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const supabaseAdmin = getSupabaseAdmin(); // ← この行を追加

        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id, name, email, image, password')
          .eq('email', email)
          .single();

        if (!user || !user.password) return null;

        // 3. パスワード検証
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    // Credentialsを使う場合はJWT必須（DB sessionはCredentialsと非互換）
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',      // エラーはサインインページにリダイレクト
  },
});