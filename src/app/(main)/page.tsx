import MainLanding from '@/components/Landing/Main.landing'
import { Metadata } from 'next'
import MaintenancePage from '@/components/MaintenancePage'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FlowCraft',
  description:
    'FlowCraft is a diagramming tool that helps you create flowcharts, process maps, and system diagrams with AI and with ease. Some diagram types include Flowcharts, sequence diagrams, User journey maps, mind maps, knowledge graphs, and more.',
}

export default async function Home() {
  return (
    <>
      <MainLanding />
      <Footer />
    </>
  )
  return (
    <>
      <MaintenancePage />
    </>
  )
}
