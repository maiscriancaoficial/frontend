import React from 'react';
import { CategoriaLayoutClient } from './layout-client';

export default function CategoriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CategoriaLayoutClient>{children}</CategoriaLayoutClient>
  );
}
