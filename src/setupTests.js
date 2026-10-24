import React from 'react';
import { expect, vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add custom jest-dom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock framer-motion to avoid animation-related test issues
vi.mock('framer-motion', async (importOriginal) => {
  const { isValidMotionProp } = await importOriginal();
  const mockMotionComponent = (tag) => ({ children, ...props }) => {
    const domProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    );
    return React.createElement(tag, domProps, children);
  };

  return {
    motion: {
      div: mockMotionComponent('div'),
      button: mockMotionComponent('button'),
      p: mockMotionComponent('p')
    },
    AnimatePresence: ({ children }) => children,
  };
});
