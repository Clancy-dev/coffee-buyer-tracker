"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { X, Save, AlertTriangle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialMediaSection } from "./social-media-section"
import { FormDataManager } from "@/lib/api-client"
import type { BuyerFormData, CoffeeBuyer } from "@/lib/types"

interface BuyerFormProps {
  buyer?: CoffeeBuyer | null
  onClose: () => void
  onSave: (data: BuyerFormData) => void
  onDelete?: (id: string) => void
}

export const BuyerForm = ({ buyer, onClose, onSave, onDelete }: BuyerFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const isEditing = !!buyer

  const formId = `buyer-form-${buyer?.id || "new"}`

  const getCurrentDate = () => {
    const now = new Date()
    return now.toISOString().split("T")[0]
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BuyerFormData>({
    defaultValues: {
      name: buyer?.name || "",
      phoneNumber: buyer?.phoneNumber || "",
      email: buyer?.email || "",
      dateLastContacted: buyer?.dateLastContacted || (isEditing ? "" : getCurrentDate()),
      timeLastContacted: buyer?.timeLastContacted || (isEditing ? "" : getCurrentTime()),
      feedback: buyer?.feedback || "",
      expectation: buyer?.expectation || "medium",
      socialMediaHandles: buyer?.socialMediaHandles || [],
    },
  })

  // Load saved form data on mount
  useEffect(() => {
    if (!isEditing) {
      const savedData = FormDataManager.getFormData(formId)
      if (savedData) {
        Object.keys(savedData).forEach((key) => {
          setValue(key as keyof BuyerFormData, savedData[key])
        })
      }
    }
  }, [formId, isEditing, setValue])

  // Save form data on changes (debounced)
  const watchedValues = watch()
  useEffect(() => {
    if (!isEditing) {
      const timeoutId = setTimeout(() => {
        FormDataManager.saveFormData(formId, watchedValues)
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [watchedValues, formId, isEditing])

  const onSubmit = async (data: BuyerFormData) => {
    setIsLoading(true)
    try {
      await onSave(data)
      FormDataManager.clearFormData(formId)
      toast.success(isEditing ? "Buyer updated successfully!" : "Buyer created successfully!")
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save buyer")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!buyer || !onDelete) return

    setIsLoading(true)
    try {
      await onDelete(buyer.id)
      toast.success("Buyer deleted successfully!")
      onClose()
    } catch (error) {
      toast.error("Failed to delete buyer")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearForm = () => {
    reset({
      name: "",
      phoneNumber: "",
      email: "",
      dateLastContacted: getCurrentDate(),
      timeLastContacted: getCurrentTime(),
      feedback: "",
      expectation: "medium",
      socialMediaHandles: [],
    })
    FormDataManager.clearFormData(formId)
    toast.success("Form cleared successfully!")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white dark:bg-gray-900 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              {isEditing ? "Edit Coffee Buyer" : "Add New Coffee Buyer"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {isEditing ? "Update buyer information and preferences" : "Add a new coffee buyer to your network"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Buyer Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Buyer Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter buyer's full name"
                  {...register("name", {
                    required: "Buyer name is required",
                  })}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register("phoneNumber")}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="buyer@example.com"
                    {...register("email", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
              </div>

              {/* Last Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateLastContacted" className="text-gray-700 dark:text-gray-300">
                    Date Last Contacted
                  </Label>
                  <Input
                    id="dateLastContacted"
                    type="date"
                    {...register("dateLastContacted")}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLastContacted" className="text-gray-700 dark:text-gray-300">
                    Time Last Contacted
                  </Label>
                  <Input
                    id="timeLastContacted"
                    type="time"
                    {...register("timeLastContacted")}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Expectation Level */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Expectation Level</Label>
                <Select
                  value={watch("expectation")}
                  onValueChange={(value) => setValue("expectation", value as "high" | "medium" | "low")}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                    <SelectItem
                      value="high"
                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>High</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="medium"
                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Medium</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="low"
                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Low</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback" className="text-gray-700 dark:text-gray-300">
                  Feedback & Notes
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Add any feedback, notes, or observations about this buyer..."
                  rows={4}
                  {...register("feedback")}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
                />
              </div>

              <SocialMediaSection control={control} />

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 pt-6 border-t border-gray-200 dark:border-gray-700">
                {isEditing && onDelete ? (
                  <Button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Delete Buyer
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleClearForm}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 flex items-center space-x-2 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Clear Form</span>
                  </Button>
                )}

                <div className="flex space-x-3">
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
                    <span>{isLoading ? "Saving..." : isEditing ? "Update Buyer" : "Create Buyer"}</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 rounded-lg">
              <Card className="w-full max-w-md bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Delete Buyer</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete this buyer? This action cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                      className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
