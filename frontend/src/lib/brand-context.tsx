"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Brand } from "@/types";
import { api } from "./api";
import { useAuth } from "./auth-context";

interface BrandContextType {
  brands: Brand[];
  selectedBrand: Brand | null;
  setSelectedBrand: (brand: Brand | null) => void;
  refreshBrands: () => Promise<Brand[]>;
  isLoadingBrands: boolean;
}

const BrandContext = createContext<BrandContextType>({
  brands: [],
  selectedBrand: null,
  setSelectedBrand: () => {},
  refreshBrands: async () => [],
  isLoadingBrands: true,
});

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrandState] = useState<Brand | null>(null);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);

  const refreshBrands = useCallback(async () => {
    if (!user) {
      setBrands([]);
      setSelectedBrandState(null);
      setIsLoadingBrands(false);
      return [];
    }
    try {
      setIsLoadingBrands(true);
      const data = await api.listBrands();
      setBrands(data);
      setSelectedBrandState((prev) => {
        if (prev && data.some((b: Brand) => b.id === prev.id)) {
          return data.find((b: Brand) => b.id === prev.id) || prev;
        }
        if (data.length > 0) {
          const def = data.find((b: Brand) => b.is_default) || data[0];
          return def;
        }
        return null;
      });
      return data;
    } catch (e) {
      console.error("Failed to load brands:", e);
      return [];
    } finally {
      setIsLoadingBrands(false);
    }
  }, [user]);

  useEffect(() => {
    refreshBrands();
  }, [refreshBrands]);

  const setSelectedBrand = (brand: Brand | null) => {
    setSelectedBrandState(brand);
  };

  return (
    <BrandContext.Provider
      value={{
        brands,
        selectedBrand,
        setSelectedBrand,
        refreshBrands,
        isLoadingBrands,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}

