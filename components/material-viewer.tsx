"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { Material } from "@/lib/api-types"
import { CheckCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface MaterialViewerProps {
  material: Material
  onComplete: () => void
}

export function MaterialViewer({ material, onComplete }: MaterialViewerProps) {
  const [readingTime, setReadingTime] = useState(0)
  const [isCompleted, setIsCompleted] = useState(material.status === "completed")
  const [showCompleteButton, setShowCompleteButton] = useState(false)

  useEffect(() => {
    // Reset state when material changes
    setIsCompleted(material.status === "completed")
    setShowCompleteButton(false)

    // Estimate reading time based on content length (rough estimate)
    if (material.type === "text") {
      const wordCount = material.content.split(/\s+/).length
      const readingTimeMinutes = Math.ceil(wordCount / 200) // Asumsi kecepatan membaca 200 kata per menit
      setReadingTime(readingTimeMinutes)
    }

    // Show complete button after some time for text materials
    if (material.type === "text" && material.status !== "completed") {
      const timer = setTimeout(() => {
        setShowCompleteButton(true)
      }, 10000) // Tampilkan tombol setelah 10 detik
      return () => clearTimeout(timer)
    } else {
      setShowCompleteButton(true)
    }
  }, [material])

  const handleComplete = () => {
    setIsCompleted(true)
    onComplete()
  }

  const renderContent = () => {
    switch (material.type) {
      case "text":
        return (
          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {material.content}
            </ReactMarkdown>
          </div>
        )
      case "image":
        return (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-2xl h-96 my-4">
              <Image
                src={material.content || "/placeholder.svg"}
                alt={material.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )
      case "video":
        return (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl my-4">
              <div className="aspect-video relative">
                <iframe
                  src={material.content}
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )
      case "code":
        return (
          <div className="w-full my-4">
            <SyntaxHighlighter style={tomorrow} language="java" className="rounded-xl">
              {material.content}
            </SyntaxHighlighter>
          </div>
        )
      default:
        return <p>{material.content}</p>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">{material.title}</h1>
          {material.type === "text" && (
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1" /> Waktu baca: {readingTime} menit
            </p>
          )}
        </div>
        {isCompleted && (
          <div className="flex items-center text-quaternary">
            <CheckCircle className="h-5 w-5 mr-1" /> Selesai
          </div>
        )}
      </div>

      <div className="my-6">{renderContent()}</div>

      {!isCompleted && showCompleteButton && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <Button
            onClick={handleComplete}
            className="bg-quaternary hover:bg-quaternary/90 text-white neumorphic-quaternary"
          >
            Tandai Selesai
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
