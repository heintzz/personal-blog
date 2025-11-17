import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata = {
  title: "Hasnan's Blog",
  description: "A blog about hasnan's thoughts and experiences",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
