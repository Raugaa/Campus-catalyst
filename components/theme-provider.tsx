'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProvider(props: ThemeProviderProps & { children: React.ReactNode }) {
  return <NextThemesProvider {...props} />
}