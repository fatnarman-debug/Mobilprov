import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isPaid: user.isPaid,
        }
      }
    })
  ],
  callbacks: {
    // Google ile ilk girişte kullanıcıyı veritabanında oluştur
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name ?? "",
                passwordHash: "", // Google kullanıcılarının şifresi yok
                isPaid: false,
              }
            })
          }
        } catch (error) {
          console.error("Google signIn DB error:", error)
          return false
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      // İlk girişte veya her token yenilemesinde DB'den güncel veriyi çek
      if (user || account) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! }
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.isPaid = dbUser.isPaid
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isPaid = token.isPaid as boolean
      }
      return session
    }
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: "jwt",
  },
})
