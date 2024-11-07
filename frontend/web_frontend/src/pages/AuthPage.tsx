import React, { useState } from 'react';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import ForgotPassword from '../components/ForgotPassword';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'login' | 'signUp' | 'forgotPassword'>('login');

  const renderForm = () => {
    switch (activeForm) {
      case 'login':
        return <Login onSwitchToSignUp={() => setActiveForm('signUp')} onSwitchToForgotPassword={() => setActiveForm('forgotPassword')} />;
      case 'signUp':
        return <SignUp onSwitchToLogin={() => setActiveForm('login')} />;
      case 'forgotPassword':
        return <ForgotPassword onSwitchToLogin={() => setActiveForm('login')} />;
      default:
        return null;
    }
  };

  return (
    <div className="auth-page">
      <div className="overlay">
        {renderForm()}
      </div>
    </div>
  );
};

export default AuthPage;
