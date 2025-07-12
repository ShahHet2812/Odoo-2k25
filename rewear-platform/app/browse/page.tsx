"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Package, Grid3X3, List, SlidersHorizontal } from "lucide-react"

const allItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    category: "Outerwear",
    size: "M",
    condition: "Excellent",
    points: 25,
    image: "/placeholder.svg?height=300&width=300",
    uploader: "Sarah M.",
    location: "Portland, OR",
  },
  {
    id: 2,
    title: "Designer Silk Blouse",
    category: "Tops",
    size: "S",
    condition: "Like New",
    points: 35,
    image: "/placeholder.svg?height=300&width=300",
    uploader: "Emma K.",
    location: "Seattle, WA",
  },
  {
    id: 3,
    title: "Casual Summer Dress",
    category: "Dresses",
    size: "L",
    condition: "Good",
    points: 20,
    image: "/placeholder.svg?height=300&width=300",
    uploader: "Lisa R.",
    location: "San Francisco, CA",
  },
  {
    id: 4,
    title: "Wool Winter Coat",
    category: "Outerwear",
    size: "M",
    condition: "Very Good",
    points: 45,
    image: "/placeholder.svg?height=300&width=300",
    uploader: "Anna T.",
    location: "Denver, CO",
  },
  {
    id: 5,
    title: "Athletic Sneakers",
    category: "Shoes",
    size: "9",
    condition: "Excellent",
    points: 30,
    image: "/placeholder.svg?height=300&width=300",
    uploader: "Mike J.",
    location: "Austin, TX",
  },
  {
    id: 6,
    title: "Leather Handbag",
    category: "Accessories",
    size: "One Size",
    condition: "Like New",
    points: 40,
    image: "/placeholder.svg?height=300&width=300",
    uploader: "Rachel S.",
    location: "New York, NY",
  },
]

const categories = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"]
const sizes = ["All", "XS", "S", "M", "L", "XL", "XXL", "One Size"]
const conditions = ["All", "Like New", "Excellent", "Very Good", "Good", "Fair"]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSize, setSelectedSize] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSize = selectedSize === "All" || item.size === selectedSize
    const matchesCondition = selectedCondition === "All" || item.condition === selectedCondition

    return matchesSearch && matchesCategory && matchesSize && matchesCondition
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">ReWear</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/add-item" className="text-gray-600 hover:text-gray-900">
              List Item
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          <div className={`grid md:grid-cols-4 gap-4 ${showFilters ? "block" : "hidden md:grid"}`}>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="points-low">Points: Low to High</SelectItem>
                <SelectItem value="points-high">Points: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Browse Items</h1>
            <p className="text-gray-600">{filteredItems.length} items found</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Items Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  <Badge className="absolute top-2 right-2 bg-green-600">{item.points} pts</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {item.uploader}</p>
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-gray-500">Size {item.size}</span>
                    <Badge variant="outline">{item.condition}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{item.location}</p>
                  <Link href={`/item/${item.id}`}>
                    <Button className="w-full" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="w-32 h-32 relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 p-4 flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {item.uploader}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>Size {item.size}</span>
                        <Badge variant="outline">{item.condition}</Badge>
                        <span>{item.location}</span>
                      </div>
                      <Badge className="bg-green-600">{item.points} points</Badge>
                    </div>
                    <div className="flex items-center">
                      <Link href={`/item/${item.id}`}>
                        <Button>View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
