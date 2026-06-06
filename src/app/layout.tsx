import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QA LMS — Learning Management System',
  description: 'AI-powered QA training platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
