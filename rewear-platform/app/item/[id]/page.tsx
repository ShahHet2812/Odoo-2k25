"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Heart, Share2, Star, MapPin, Calendar, Package, ArrowUpDown, Coins } from "lucide-react"

// Mock data - in real app this would come from API
const itemData = {
  id: 1,
  title: "Vintage Denim Jacket",
  description:
    "Beautiful vintage denim jacket in excellent condition. This classic piece has been well-maintained and shows minimal signs of wear. Perfect for layering and adding a timeless touch to any outfit. Features original buttons and classic fit.",
  category: "Outerwear",
  type: "Jacket",
  size: "M",
  condition: "Excellent",
  points: 25,
  tags: ["vintage", "denim", "classic", "layering"],
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  uploader: {
    name: "Sarah Martinez",
    avatar: "/placeholder-user.jpg",
    rating: 4.9,
    totalSwaps: 34,
    joinDate: "January 2023",
    location: "Portland, OR",
  },
  availability: "Available",
  listedDate: "2024-01-10",
  views: 89,
  likes: 12,
}

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [swapMessage, setSwapMessage] = useState("")

  const handleSwapRequest = () => {
    console.log("Swap request:", { itemId: params.id, message: swapMessage })
    // Handle swap request logic
  }

  const handlePointsRedeem = () => {
    console.log("Points redemption:", { itemId: params.id, points: itemData.points })
    // Handle points redemption logic
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/browse" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            Back to Browse
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">ReWear</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-white rounded-lg overflow-hidden">
              <Image
                src={itemData.images[selectedImage] || "/placeholder.svg"}
                alt={itemData.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-green-600">{itemData.points} points</Badge>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {itemData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-green-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${itemData.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{itemData.category}</Badge>
                <Badge variant={itemData.availability === "Available" ? "default" : "secondary"}>
                  {itemData.availability}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{itemData.title}</h1>
              <p className="text-gray-600 leading-relaxed">{itemData.description}</p>
            </div>

            {/* Item Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Size</span>
                    <p className="font-semibold">{itemData.size}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Condition</span>
                    <p className="font-semibold">{itemData.condition}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Type</span>
                    <p className="font-semibold">{itemData.type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Points Value</span>
                    <p className="font-semibold text-green-600">{itemData.points} pts</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Tags</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {itemData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <ArrowUpDown className="h-5 w-5 mr-2" />
                    Request Swap
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Item Swap</DialogTitle>
                    <DialogDescription>
                      Send a message to {itemData.uploader.name} to request a swap for this item.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Hi! I'm interested in swapping for your vintage denim jacket..."
                        value={swapMessage}
                        onChange={(e) => setSwapMessage(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSwapRequest} className="w-full">
                      Send Swap Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={handlePointsRedeem}>
                <Coins className="h-5 w-5 mr-2" />
                Redeem with {itemData.points} Points
              </Button>
            </div>

            {/* Uploader Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Listed by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={itemData.uploader.avatar || "/placeholder.svg"} />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{itemData.uploader.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{itemData.uploader.rating}</span>
                      <span className="text-sm text-gray-600">({itemData.uploader.totalSwaps} swaps)</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {itemData.uploader.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Member since {itemData.uploader.joinDate}
                      </div>
                    </div>
                  </div>
                  <Link href={`/profile/${itemData.uploader.name}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Item Stats */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Listed on {itemData.listedDate}</span>
              <div className="flex gap-4">
                <span>{itemData.views} views</span>
                <span>{itemData.likes} likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
