"use client"

import localFont from "next/font/local";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'
import { ApolloProvider } from "@apollo/client";
import client from '@/utils/Apollo/ApolloClient'
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
           <ApolloProvider client={client}>
        <Navbar/>
        {children}
        <Footer/>
        </ApolloProvider>
      </body>
    </html>
  );
}
