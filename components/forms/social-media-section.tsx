"use client"
import { useFieldArray, type Control } from "react-hook-form"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { BuyerFormData, SocialMediaHandle } from "@/lib/types"

interface SocialMediaSectionProps {
  control: Control<BuyerFormData>
}

const socialPlatforms = [
  { value: "instagram", label: "Instagram", placeholder: "@username" },
  { value: "x", label: "X (Twitter)", placeholder: "@username" },
  { value: "tiktok", label: "TikTok", placeholder: "@username" },
  { value: "youtube", label: "YouTube", placeholder: "channel-name" },
  { value: "facebook", label: "Facebook", placeholder: "profile-name" },
  { value: "linkedin", label: "LinkedIn", placeholder: "profile-name" },
  { value: "whatsapp", label: "WhatsApp", placeholder: "+1234567890" },
] as const

export const SocialMediaSection = ({ control }: SocialMediaSectionProps) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "socialMediaHandles",
  })

  const addSocialMedia = () => {
    append({
      platform: "instagram",
      username: "",
      url: "",
    })
  }

  const generateUrl = (platform: SocialMediaHandle["platform"], username: string): string => {
    const baseUrls = {
      instagram: "https://instagram.com/",
      x: "https://x.com/",
      tiktok: "https://tiktok.com/@",
      youtube: "https://youtube.com/",
      facebook: "https://facebook.com/",
      linkedin: "https://linkedin.com/in/",
      whatsapp: "https://wa.me/",
    }

    return baseUrls[platform] + username.replace(/^[@+]/, "")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium text-gray-900 dark:text-white">Social Media Handles</Label>
        <Button
          type="button"
          onClick={addSocialMedia}
          variant="outline"
          size="sm"
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Social Media
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400 mb-3">No social media handles added yet</p>
          <Button
            type="button"
            onClick={addSocialMedia}
            variant="outline"
            className="bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Handle
          </Button>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {fields.map((field, index) => {
            const platform = socialPlatforms.find((p) => p.value === field.platform)
            return (
              <AccordionItem
                key={field.id}
                value={`social-${index}`}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {platform?.label || "Social Media"}
                      </span>
                      {field.username && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">@{field.username}</span>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        remove(index)
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-700 dark:text-gray-300">Platform</Label>
                      <Select
                        value={field.platform}
                        onValueChange={(value) => {
                          const newPlatform = value as SocialMediaHandle["platform"]
                          const updatedField = {
                            ...field,
                            platform: newPlatform,
                            url: field.username ? generateUrl(newPlatform, field.username) : "",
                          }
                          update(index, updatedField)
                        }}
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                          {socialPlatforms.map((platform) => (
                            <SelectItem
                              key={platform.value}
                              value={platform.value}
                              className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-700 dark:text-gray-300">Username/Handle</Label>
                      <Input
                        placeholder={platform?.placeholder || "@username"}
                        value={field.username}
                        autoComplete="off"
                        onChange={(e) => {
                          const username = e.target.value
                          const updatedField = {
                            ...field,
                            username,
                            url: username ? generateUrl(field.platform, username) : "",
                          }
                          update(index, updatedField)
                        }}
                        className="bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-sm text-gray-700 dark:text-gray-300">Profile URL</Label>
                      <Input
                        placeholder="https://..."
                        value={field.url}
                        autoComplete="off"
                        onChange={(e) => {
                          const updatedField = { ...field, url: e.target.value }
                          update(index, updatedField)
                        }}
                        className="bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
    </div>
  )
}
