import React, { createContext, useContext, useState } from 'react';


const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);

  const getCart = async () => {
    try {
      const response = await fetch('http://localhost:8080/cart/lastCart', {
        method: 'GET',
      });

      if (response.ok) {
        const cart = await response.json();
        setCart(cart);
        setCartId(cart.id); // Establece el cartId
        console.log('Carrito Obtenido');
        console.log(cart);
      } else {
        // Manejo de errores en caso de respuesta no exitosa
        console.error('Error al crear el carrito:', response.status);
      }
    } catch (error) {
      // Manejo de errores en caso de error de red u otros
      console.error('Error al crear el carrito:', error);
    }
  };
  const deleteAllProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/cart/deleteallproducts/${cartId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        
       getCart()
        console.log('Todos los productos eliminados del carrito');
      } else {
        console.error('Error al eliminar todos los productos del carrito:', response.status);
      }
    } catch (error) {
      console.error('Error al eliminar todos los productos del carrito:', error);
    }
  };
  const deleteProduct = async (productId) => {
    try {
      // Llama al endpoint para eliminar un producto del carrito
      const response = await fetch(`http://localhost:8080/cart/${cartId}/product/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        getCart()
        // No es necesario actualizar el carrito después de eliminar el producto
        console.log('Producto eliminado del carrito');
      } else {
        console.error('Error al eliminar el producto del carrito:', response.status);
      }
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  const addProduct = async (productId) => {
    try {
      // Llama al endpoint para agregar un producto al carrito
      const response = await fetch(`http://localhost:8080/cart/addProductToCart/${cartId}/product/${productId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        // No es necesario actualizar el carrito después de agregar el producto
        console.log('Producto agregado al carrito');
      } else {
        console.error('Error al agregar el producto al carrito:', response.status);
      }
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartId, getCart, deleteProduct, addProduct, deleteAllProducts }}>
      {children}
    </CartContext.Provider>
  );
};