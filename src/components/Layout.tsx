import { Footer } from './Footer'
import Navbar from './Navbar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-indigo-900">
      <Navbar />
      <main className="container prose prose-invert mx-auto mb-7 sm:prose-lg md:prose-lg lg:prose-xl prose-img:mx-auto prose-img:w-96 prose-img:rounded-xl">
        {children}
      </main>
      <Footer className="gradient" />
    </div>
  )
}
