'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { sanitizeMermaid, sanitizeSVG } from '@/lib/utils'

interface DiagramRendererProps {
    type: string
    data: string
    imageUrl?: string
    className?: string
}

export default function DiagramRenderer({
    type,
    data,
    imageUrl,
    className = '',
}: DiagramRendererProps) {
    const mermaidContainerRef = useRef<HTMLDivElement>(null)
    const [mermaidInitialized, setMermaidInitialized] = useState(false)
    const [svgCode, setSvgCode] = useState('')
    const [mermaidCode, setMermaidCode] = useState('')

    // Initialize Mermaid once
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
        })
        setMermaidInitialized(true)
    }, [])

    // Process diagram data based on type
    useEffect(() => {
        if (type === 'illustration' || type === 'generated_image') {
            setSvgCode('')
            setMermaidCode('')
        } else if (type === 'infographic') {
            const sanitizedSvgCode = sanitizeSVG(data)
            setSvgCode(sanitizedSvgCode.svgContent)
            setMermaidCode('')
        } else {
            const sanitizedMermaidCode = sanitizeMermaid(data)
            setMermaidCode(sanitizedMermaidCode)
            setSvgCode('')
        }
    }, [type, data])

    // Render Mermaid diagram when code changes
    useEffect(() => {
        if (mermaidInitialized && mermaidCode && mermaidContainerRef.current) {
            const container = mermaidContainerRef.current
            container.innerHTML = '' // Clear previous content
            
            try {
                mermaid
                    .render('mermaid-diagram', mermaidCode)
                    .then(({ svg }) => {
                        container.innerHTML = svg
                    })
                    .catch((error) => {
                        console.error('Mermaid rendering error:', error)
                        container.innerHTML = `<div class="text-red-500">Error rendering Mermaid diagram</div>`
                    })
            } catch (error) {
                console.error('Mermaid error:', error)
                container.innerHTML = `<div class="text-red-500">Error processing Mermaid diagram</div>`
            }
        }
    }, [mermaidCode, mermaidInitialized])

    if (svgCode) {
        return (
            <div
                dangerouslySetInnerHTML={{ __html: svgCode }}
                style={{ width: '100%', height: 'auto' }}
            />
        )
    } else if (mermaidCode) {
        return (
            <div className="w-full h-full p-4">
                <div
                    ref={mermaidContainerRef}
                    className="mermaid"
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
        )
    } else if (imageUrl) {
        return (
            <div className="max-w-full h-auto mx-auto">
                <img src={imageUrl} alt="Diagram" style={{ maxWidth: '100%' }} />
            </div>
        )
    }
    
    return (
        <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${className}`}>
            <div className="text-gray-500">No diagram preview available</div>
        </div>
    )
}