import React from "react";
import {HeroUIProvider} from '@heroui/react'

export function HerouiProvider({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  )
}