import React from 'react';
import { MemoryRouterProvider } from 'next-router-mock';

// This setup function wraps all Codux boards
// It provides a mock router context using next-router-mock
export default function setup(Board) {
  return (
    <MemoryRouterProvider>
      <Board />
    </MemoryRouterProvider>
  );
}
