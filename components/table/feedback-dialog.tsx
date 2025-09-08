"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FeedbackDialogProps {
  feedback: string
}

export const FeedbackDialog = ({ feedback }: FeedbackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!feedback.trim()) {
    return <span className="text-gray-400 dark:text-gray-500 text-sm">No feedback</span>
  }

  const truncatedFeedback = (() => {
    const words = feedback.trim().split(/\s+/)
    if (words.length <= 3) return feedback
    return words.slice(0, 3).join(" ") + "..."
  })()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto text-left justify-start hover:bg-transparent">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">{truncatedFeedback}</span>
            <MessageSquare className="h-3 w-3 text-gray-400" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Buyer Feedback</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Complete feedback and notes for this buyer
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">{feedback}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
