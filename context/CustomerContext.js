"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "@/app/actions/auth";

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomer = async () => {
    setIsLoading(true);
    const data = await checkAuth();
    setCustomer(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, isLoading, refreshCustomer: fetchCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}
