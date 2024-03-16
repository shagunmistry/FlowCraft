import Image from 'next/image'
import { Footer } from './Footer'
import Navbar from './Navbar'

import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'

export function ReleaseNotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* <Image
        src={FlowCraftLogo}
        alt="FlowCraft Logo"
        width={300}
        height={100}
        className="mx-auto"
      /> */}
      <main className="container prose prose mx-auto mb-7 sm:prose-lg md:prose-lg lg:prose-xl prose-img:mx-auto prose-img:w-96 prose-img:rounded-xl prose-img:shadow-lg">
        {children}
      </main>
      <Footer />
    </div>
  )
}
