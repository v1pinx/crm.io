import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { connectToMongoDB } from "@/lib/mongodb";
import User from "@/models/Users";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      await connectToMongoDB();
      const existingUser = await User.findOne({ email: profile?.email });
      if (!existingUser) {
        await User.create({
          name: profile?.name,
          email: profile?.email,
        });
      }
      return true;
    },
    async session({ session }) {
      const user = await User.findOne({ email: session?.user?.email });
      if (session.user && user) {
        (session.user as any)._id = user._id.toString();
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
