import "./globals.css";
// import { Inter } from 'next/font/google'
import { Young_Serif, Roboto } from "next/font/google";

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});
const font = roboto;

//const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: "Campuswire Analytics App",
  description: "Campuswire Analytics App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body>{children}</body> */}
      <body className={font.className}>{children}</body>
    </html>
  );
}
