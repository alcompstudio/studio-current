import React from 'react';
import { AuthForm } from '../../../../src/components/auth/auth-form';
import { Toaster } from '../../../../src/components/ui/toaster';

// This is a Codux board for the AuthForm component
const AuthFormBoard = () => {
  return (
    <>
      <AuthForm />
      <Toaster />
    </>
  );
};

export default AuthFormBoard;
