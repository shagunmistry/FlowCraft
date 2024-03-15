'use client'

import { DiagramData } from '@/lib/DiagramType.db'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-auth/server'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

export default async function DiagramPage({
  params,
}: {
  params: { id: string }
}) {
  const [diagram, setDiagram] = useState<DiagramData>()

  useEffect(() => {
    const fetchDiagram = async () => {
      const diagramData = await fetch(`/api/get-diagrams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: params.id }),
      })

      const { diagram } = await diagramData.json()

      if (!diagram) {
        return notFound()
      }

      console.log('---> data', diagram)
      setDiagram(diagram)
      return diagram
    }

    fetchDiagram()
  }, [])

  return (
    <div>
      <h1>Diagram Page: {params.id}</h1>
    </div>
  )
}
