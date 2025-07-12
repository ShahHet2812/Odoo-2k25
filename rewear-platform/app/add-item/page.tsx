"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { X, Upload, Package, Plus, Camera } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"

const categories = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Accessories",
  "Activewear",
  "Formal Wear",
]

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]

const conditions = ["New with tags", "Like new", "Excellent", "Very good", "Good", "Fair"]

export default function AddItemPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: [] as string[],
    currentTag: "",
  })

  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: "",
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setUploading(true)
      
      // Validate file types and sizes
      const validFiles = Array.from(files).filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
        const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
        
        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: "Please upload JPEG, PNG, or WebP images only.",
            variant: "destructive",
          })
        }
        
        if (!isValidSize) {
          toast({
            title: "File too large",
            description: "Please upload images smaller than 5MB.",
            variant: "destructive",
          })
        }
        
        return isValidType && isValidSize
      })

      // In a real app, you'd upload to a service and get URLs back
      const newImages = validFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages].slice(0, 5)) // Max 5 images
      
      setUploading(false)
      
      if (validFiles.length > 0) {
        toast({
          title: "Images uploaded",
          description: `${validFiles.length} image(s) uploaded successfully.`,
          variant: "default",
        })
      }
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const isSizeRequired = () => {
    return formData.category !== "Accessories" && formData.category !== "Shoes"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || !formData.condition) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (isSizeRequired() && !formData.size) {
      toast({
        title: "Size required",
        description: "Please select a size for this item.",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your item.",
        variant: "destructive",
      })
      return
    }

    console.log("Form submitted:", { ...formData, images })
    
    toast({
      title: "Item listed successfully!",
      description: "Your item has been added to the platform.",
      variant: "default",
    })
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      type: "",
      size: "",
      condition: "",
      tags: [],
      currentTag: "",
    })
    setImages([])
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-green-800 mb-2">List Your Item</h1>
              <p className="text-green-600">
                Share your pre-loved clothing with the ReWear community. Help reduce textile waste while earning points
                for your sustainable choices.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Item Details</CardTitle>
                <CardDescription className="text-green-600">
                  Provide detailed information about your item to help others find the perfect match.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Item Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Vintage Denim Jacket, Designer Silk Blouse"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your item in detail. Include brand, material, style, and any unique features..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="size">
                          Size {isSizeRequired() ? "*" : "(Optional)"}
                        </Label>
                        <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!isSizeRequired() && (
                          <p className="text-sm text-green-600 mt-1">
                            Size is optional for accessories and shoes
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Input
                          id="type"
                          placeholder="e.g., Casual, Formal, Vintage"
                          value={formData.type}
                          onChange={(e) => handleInputChange("type", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="condition">Condition *</Label>
                        <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map((condition) => (
                              <SelectItem key={condition} value={condition}>
                                {condition}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          id="tags"
                          placeholder="Add tags (e.g., vintage, designer, sustainable)"
                          value={formData.currentTag}
                          onChange={(e) => handleInputChange("currentTag", e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                        />
                        <Button type="button" onClick={handleAddTag} variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Image Upload */}
                    <div>
                      <Label>Images *</Label>
                      <div className="mt-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`Item image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {images.length < 5 && (
                            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploading}
                              />
                              <Camera className="h-8 w-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600 text-center">
                                {uploading ? "Uploading..." : "Add Images"}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                {images.length}/5
                              </span>
                            </label>
                          )}
                        </div>
                        <p className="text-sm text-green-600">
                          Upload up to 5 images. JPEG, PNG, or WebP format, max 5MB each.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 transition-all duration-200">
                      <Package className="h-4 w-4 mr-2" />
                      List Item
                    </Button>
                    <Link href="/dashboard">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
