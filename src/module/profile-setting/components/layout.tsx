'use client';
import React from 'react';
import Header from './header';
const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <Header />
      {children}
    </React.Fragment>
  );
};

export { ProfileLayout };
