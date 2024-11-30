import { cache } from "react";
import NextAuth from "next-auth";

import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

const getRole = async () => {
  const session = await auth();

  return session?.user.role ?? "";
};

export { auth, getRole, handlers, signIn, signOut };
