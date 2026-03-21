import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ProductDetails } from './components/ProductDetails';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen, OrderDetails } from './components/CheckoutScreen';
import { OrderConfirmationScreen } from './components/OrderConfirmationScreen';
import { OrderTrackingScreen } from './components/OrderTrackingScreen';
import { BottomNav } from './components/BottomNav';
import { Product, CartItem } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'cart' | 'checkout' | 'confirmation' | 'tracking'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [activeTab, setActiveTab] = useState('home');

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
  };

  const handleOpenCart = () => {
    setCurrentView('cart');
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    setCurrentView('checkout');
  };

  const handlePlaceOrder = (details: OrderDetails) => {
    // Generate order number
    const orderNum = 'GR' + Date.now().toString().slice(-8);
    setOrderNumber(orderNum);
    setOrderDetails(details);
    setCurrentView('confirmation');
  };

  const handleTrackOrder = () => {
    setCurrentView('tracking');
  };

  const handleOrderComplete = () => {
    // Clear cart and reset to home
    setCartItems([]);
    setOrderDetails(null);
    setOrderNumber('');
    setCurrentView('home');
  };

  return (
    <div className="relative max-w-md mx-auto bg-white min-h-screen">
      {currentView === 'home' ? (
        <>
          <HomeScreen 
            onProductClick={handleProductClick} 
            onOpenCart={handleOpenCart}
            onAddToCart={handleAddToCart}
            cartCount={cartCount} 
          />
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      ) : currentView === 'product' && selectedProduct ? (
        <ProductDetails
          product={selectedProduct}
          onBack={handleBackToHome}
          onAddToCart={(quantity) => {
            handleAddToCart(selectedProduct, quantity);
            handleBackToHome();
          }}
          onOpenCart={handleOpenCart}
          cartCount={cartCount}
        />
      ) : currentView === 'cart' ? (
        <CartScreen
          cartItems={cartItems}
          onBack={handleBackToHome}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      ) : currentView === 'checkout' ? (
        <CheckoutScreen
          cartItems={cartItems}
          onBack={() => setCurrentView('cart')}
          onPlaceOrder={handlePlaceOrder}
        />
      ) : currentView === 'confirmation' && orderDetails ? (
        <OrderConfirmationScreen
          orderDetails={orderDetails}
          cartItems={cartItems}
          orderNumber={orderNumber}
          onBackToHome={handleOrderComplete}
          onTrackOrder={handleTrackOrder}
        />
      ) : currentView === 'tracking' && orderDetails ? (
        <OrderTrackingScreen
          orderNumber={orderNumber}
          deliveryAddress={orderDetails.deliveryAddress}
          onBack={() => setCurrentView('confirmation')}
        />
      ) : null}
    </div>
  );
}
