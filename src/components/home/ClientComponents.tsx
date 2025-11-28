// ================================================
// src/components/home/ClientComponents.tsx - Client-side Only Components
// ================================================

'use client'

import dynamic from 'next/dynamic'

// Lazy load chat components (client-side only, no SSR)
export const ChatBot = dynamic(() => import('@/components/chat/ChatBot'), {
  ssr: false,
  loading: () => null,
})

export const WhatsAppButton = dynamic(() => import('@/components/chat/WhatsAppButton'), {
  ssr: false,
  loading: () => null,
})
