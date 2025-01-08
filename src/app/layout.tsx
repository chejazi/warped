import type { Metadata } from "next";
import Link from 'next/link';

import { getSession } from "~/auth"
import "~/app/globals.css";
import { Providers } from "~/app/providers";

export const metadata: Metadata = {
  title: "Warped",
  description: "Warped is an NFT marketplace on Farcaster",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  
  return (
    <html lang="en">
      <body>
        <Providers session={session}>
        <div className="flex p-2" style={{ backgroundColor: '#1300ff', color: 'white', alignItems: 'center' }}>
          <Link href="/"><img src="/icon.png" style={{ width: '2.5em' }} /></Link>
          <div className="flex-grow" />
          <Link href="/airdrop">Airdrop</Link>
          <Link href="/create" className="ml-4 mr-2"><button className="create-button">&nbsp;Create&nbsp;</button></Link>
        </div>
        {children}
        </Providers>
      </body>
    </html>
  );
}
