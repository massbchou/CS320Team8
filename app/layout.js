import './globals.css'
import { Inter } from 'next/font/google'
import { Young_Serif } from 'next/font/google'

const youngSerif = Young_Serif({
  subsets: ['latin'],
  weight: '400',
});

//const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'Campuswire Analytics App',
  description: 'Campuswire Analytics App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={youngSerif.className}>{children}</body>
    </html>
  )
}