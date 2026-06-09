"use server";

import { cookies } from "next/headers";
import { loginCustomer, registerCustomer, getCustomer } from "@/lib/shopify";

export async function login(email, password) {
  try {
    const data = await loginCustomer(email, password);

    if (data?.customerUserErrors?.length > 0) {
      return { error: data.customerUserErrors[0].message };
    }

    const token = data?.customerAccessToken?.accessToken;
    if (token) {
      const expiresAt = new Date(data.customerAccessToken.expiresAt);
      const cookieStore = await cookies();
      cookieStore.set("customerAccessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        path: "/",
      });
      return { success: true };
    }

    return { error: "Failed to login. Please try again." };
  } catch (error) {
    return { error: "An unexpected error occurred." };
  }
}

export async function register(firstName, lastName, email, password) {
  try {
    const data = await registerCustomer(firstName, lastName, email, password);

    if (data?.customerUserErrors?.length > 0) {
      return { error: data.customerUserErrors[0].message };
    }

    // Auto-login after successful registration
    if (data?.customer?.id) {
      return await login(email, password);
    }

    return { error: "Failed to register. Please try again." };
  } catch (error) {
    return { error: "An unexpected error occurred." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("customerAccessToken");
  return { success: true };
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;
  if (!token) return null;

  const customer = await getCustomer(token);
  return customer;
}

