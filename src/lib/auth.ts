import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/models/Organizer";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await Organizer.findOne({ email: credentials.email.toLowerCase() });
        if (!user || !user.passwordHash) return null;
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        let existingUser = await Organizer.findOne({ email: user.email?.toLowerCase() });
        if (!existingUser) {
          existingUser = await Organizer.create({
            name: user.name || "Organizer",
            email: user.email?.toLowerCase(),
            googleId: (profile as any)?.sub,
            companyName: user.name || "Organizer",
            plan: "free",
          });
        } else if (!existingUser.googleId) {
          existingUser.googleId = (profile as any)?.sub;
          await existingUser.save();
        }
        user.id = existingUser._id.toString();
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        const dbUser = await Organizer.findOne({ email: token.email?.toLowerCase() });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.plan = dbUser.plan;
        }
      } else if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).plan = token.plan;
      }
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key",
};
