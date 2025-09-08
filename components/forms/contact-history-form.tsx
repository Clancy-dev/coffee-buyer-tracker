"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormDataManager } from "@/lib/api-client"
import type { ContactHistoryFormData, CoffeeBuyer } from "@/lib/types"

interface ContactHistoryFormProps {
  buyer: CoffeeBuyer
  onClose: () => void
  onSave: (buyerId: string, data: ContactHistoryFormData) => void
}

export const ContactHistoryForm = ({ buyer, onClose, onSave }: ContactHistoryFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const formId = `contact-history-form-${buyer.id}`

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactHistoryFormData>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      message: "",
      type: "call",
    },
  })

  // Load saved form data on mount
  useEffect(() => {
    const savedData = FormDataManager.getFormData(formId)
    if (savedData) {
      Object.keys(savedData).forEach((key) => {
        setValue(key as keyof ContactHistoryFormData, savedData[key])
      })
    }
  }, [formId, setValue])

  // Save form data on changes (debounced)
  const watchedValues = watch()
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      FormDataManager.saveFormData(formId, watchedValues)
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [watchedValues, formId])

  const onSubmit = async (data: ContactHistoryFormData) => {
    setIsLoading(true)
    try {
      await onSave(buyer.id, data)
      FormDataManager.clearFormData(formId)
      toast.success("Contact history added successfully!")
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add contact history")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-900 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Add Contact History</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Record a new interaction with {buyer.socialMediaHandles[0]?.username || buyer.email || "this buyer"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Type */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Contact Type</Label>
              <Select
                value={watch("type")}
                onValueChange={(value) => setValue("type", value as ContactHistoryFormData["type"])}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  <SelectItem
                    value="call"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    📞 Phone Call
                  </SelectItem>
                  <SelectItem
                    value="email"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    📧 Email
                  </SelectItem>
                  <SelectItem
                    value="message"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    💬 Message
                  </SelectItem>
                  <SelectItem
                    value="meeting"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    🤝 Meeting
                  </SelectItem>
                  <SelectItem
                    value="other"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    📝 Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  {...register("time")}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
                Message & Notes
              </Label>
              <Textarea
                id="message"
                placeholder="Describe what was discussed, outcomes, next steps, etc..."
                rows={6}
                {...register("message", { required: "Message is required" })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
              />
              {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isLoading ? "Saving..." : "Add Contact"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
