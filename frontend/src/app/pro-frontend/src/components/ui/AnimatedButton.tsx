"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Button, ButtonProps } from './Button';

export interface AnimatedButtonProps extends ButtonProps {
  animationVariant?: 'bounce' | 'pulse' | 'scale' | 'none';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  animationVariant = 'scale',
  children,
  ...props
}) => {
  // Define animation variants
  const animations = {
    bounce: {
      initial: {},
      whileHover: { y: -3 },
      whileTap: { y: 0 }
    },
    pulse: {
      initial: {},
      whileHover: { 
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, repeat: Infinity }
      },
      whileTap: { scale: 0.95 }
    },
    scale: {
      initial: {},
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 }
    },
    none: {
      initial: {},
      whileHover: {},
      whileTap: {}
    }
  };

  const currentAnimation = animations[animationVariant];
  
  return (
    <motion.div
      initial={currentAnimation.initial}
      whileHover={currentAnimation.whileHover}
      whileTap={currentAnimation.whileTap}
      className="inline-block"
    >
      <Button {...props}>
        {children}
      </Button>
    </motion.div>
  );
};
