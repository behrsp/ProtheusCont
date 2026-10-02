import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProtContábil - Gestão de Suporte & Lançamentos Padrão Protheus",
  description: "Hub colaborativo para resolução de problemas TOTVS Protheus, manuais técnicos passo a passo com fotos/vídeos e comparativo Antes x Depois de LPs Contábeis.",
  keywords: ["Protheus", "TOTVS", "Lançamento Padrão", "SIGACTB", "Contabilidade", "ADVPL", "Suporte Protheus", "Tarefas Colaborativas"],
  authors: [{ name: "ProtContábil Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
