import { createContext, useContext, useEffect, useState } from "react";

const EnquiryContext = createContext(null);
const STORAGE_KEY = "arcadia_enquiry_basket_v1";

export function EnquiryProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable (private browsing, quota) - basket just won't persist
    }
  }, [items]);

  function addItem(product) {
    setItems((prev) => {
      if (prev.some((i) => i.productId === product._id)) return prev;
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          productCode: product.productCode,
          slug: product.slug,
          image: product.images?.[0]?.url,
        },
      ];
    });
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clear() {
    setItems([]);
  }

  return (
    <EnquiryContext.Provider value={{ items, addItem, removeItem, clear }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used within EnquiryProvider");
  return ctx;
}
