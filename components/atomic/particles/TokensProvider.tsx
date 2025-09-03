// components/atomic/particles/TokensProvider.tsx
import React, { createContext, useContext } from 'react'
import { tokens as base } from './tokens'

type TokensOverride = Partial<typeof base>
const Ctx = createContext<typeof base>(base)

export const useTokens = () => useContext(Ctx)

/** Wrap preview with this to override a few token props live */
export function TokensProvider({
  value,
  children,
}: { value?: TokensOverride; children: React.ReactNode }) {
  // shallow merge is enough for our few knobs (accent/density usage is outside)
  const merged = { ...base, ...value }
  return <Ctx.Provider value={merged}>{children}</Ctx.Provider>
}