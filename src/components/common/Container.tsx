import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  className = '',
  size = 'default',
  children,
  ...props
}) => {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1440px]',
  }[size];

  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
