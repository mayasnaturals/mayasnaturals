"use server";

import { cookies } from "next/headers";
import { customerFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/shopify/queries";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("shopify_customer_token");
  cookieStore.delete("shopify_refresh_token");
  return { success: true };
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;
  if (!token) return null;

  const res = await customerFetch({
    query: getCustomerQuery,
    accessToken: token,
  });

  if (res.error) {
    return null;
  }

  return res.body?.data?.customer || null;
}
