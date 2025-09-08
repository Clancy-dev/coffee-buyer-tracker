"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SocialMediaHandle } from "@/lib/types"

interface SocialMediaCellProps {
  handles: SocialMediaHandle[]
}

const platformIcons = {
  instagram: "📷",
  x: "🐦",
  tiktok: "🎵",
  youtube: "📺",
  facebook: "👥",
  linkedin: "💼",
  whatsapp: "💬",
}

const platformColors = {
  instagram: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  x: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  tiktok: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  youtube: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  facebook: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  linkedin: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  whatsapp: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export const SocialMediaCell = ({ handles }: SocialMediaCellProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (handles.length === 0) {
    return <span className="text-gray-400 dark:text-gray-500 text-sm">No social media</span>
  }

  if (handles.length === 1) {
    const handle = handles[0]
    return (
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${platformColors[handle.platform]}`}>
          {handle.platform.charAt(0).toUpperCase() + handle.platform.slice(1)}
        </span>
        <a
          href={handle.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
        >
          <span>@{handle.username}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-0 h-auto text-left justify-start hover:bg-transparent"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">{handles.length} platforms</span>
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </div>
      </Button>

      {isExpanded && (
        <div className="mt-2 space-y-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          {handles.map((handle, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${platformColors[handle.platform]}`}>
                {handle.platform.charAt(0).toUpperCase() + handle.platform.slice(1)}
              </span>
              <a
                href={handle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
              >
                <span>@{handle.username}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
