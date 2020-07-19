import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const asyncProducts = await AsyncStorage.getItem(
        'GoMarketplace:products',
      );

      if (asyncProducts) {
        setProducts([...JSON.parse(asyncProducts)]);
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(async id => {
    // todo
  }, []);

  const decrement = useCallback(async id => {
    // TODO: decrement the product correspondent to this id
  }, []);

  const addToCart = useCallback(
    async product => {
      const productExists: Product | undefined = products.find(
        cartProduct => cartProduct.id === product.id,
      );

      if (productExists) {
        setProducts(
          products.map(p =>
            p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
          ),
        );
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:Products',
        JSON.stringify(product),
      );

      console.log(products);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return context;
}

export { CartProvider, useCart };