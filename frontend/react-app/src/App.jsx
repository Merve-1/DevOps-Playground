import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './components/Navbar';
import Products from './components/Products';
import Cart from './components/Cart';
import Orders from './components/Orders';
import { CartProvider } from './CartContext';
import { api } from './api';
import './App.css';

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const { user, signOut } = useAuthenticator((ctx) => [ctx.user]);
  const userId = user?.userId;
  const openLogin = useCallback(() => setShowLogin(true), []);

  // On sign-in: close the modal and make sure a backend profile exists
  useEffect(() => {
    if (!user) return;
    setShowLogin(false);
    const email = user.signInDetails?.loginId || user.username;
    api.getProfile().catch(() =>
      api.createProfile(email, user.username)
        .catch((err) => console.error('Failed to create profile:', err))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <CartProvider user={user}>
      <div className="App">
        <Navbar signOut={signOut} user={user} onSignInClick={openLogin} />

        {showLogin && !user && (
          <div
            className="login-overlay"
            onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}
          >
            <div className="login-modal">
              <Authenticator signUpAttributes={['email', 'name']} />
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Products user={user} onSignInClick={openLogin} />} />
          <Route path="/cart" element={<Cart user={user} onSignInClick={openLogin} />} />
          <Route path="/orders" element={<Orders user={user} onSignInClick={openLogin} />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default function App() {
  return (
    <Authenticator.Provider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Authenticator.Provider>
  );
}