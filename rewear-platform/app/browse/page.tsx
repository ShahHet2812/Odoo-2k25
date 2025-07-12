"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import { Navigation } from "@/components/navigation"
import { demoStorage } from "@/lib/demo-storage"
import {
  Package,
  Search,
  Filter,
  Heart,
  Eye,
  MapPin,
  Calendar,
  Star,
  User,
  ArrowUpDown,
} from "lucide-react"

export default function BrowsePage() {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getItems({
        page: 1,
        limit: 50,
        search: searchTerm,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        size: selectedSize !== "all" ? selectedSize : undefined,
        sort: sortBy,
      })

      if (response.success && response.data) {
        const data = response.data as any
        setItems(data.items || [])
      } else {
        // Fallback to demo storage
        let demoItems = demoStorage.getItems()
        
        // Apply filters
        if (searchTerm) {
          demoItems = demoStorage.searchItems(searchTerm)
        }
        
        if (selectedCategory !== "all") {
          demoItems = demoItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase())
        }
        
        if (selectedSize !== "all") {
          demoItems = demoItems.filter(item => item.size === selectedSize)
        }
        
        setItems(demoItems)
      }
    } catch (error) {
      console.error('Error loading items:', error)
      // Fallback to demo storage
      let demoItems = demoStorage.getItems()
      
      // Apply filters
      if (searchTerm) {
        demoItems = demoStorage.searchItems(searchTerm)
      }
      
      if (selectedCategory !== "all") {
        demoItems = demoItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase())
      }
      
      if (selectedSize !== "all") {
        demoItems = demoItems.filter(item => item.size === selectedSize)
      }
      
      setItems(demoItems)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadItems()
  }

  const handleFilterChange = () => {
    loadItems()
  }

  const handleLike = async (itemId: string) => {
    if (!user) return

    try {
      await apiClient.likeItem(itemId)
      // Refresh items to update like status
      loadItems()
    } catch (error) {
      console.error('Error liking item:', error)
    }
  }

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "tops", label: "Tops" },
    { value: "bottoms", label: "Bottoms" },
    { value: "dresses", label: "Dresses" },
    { value: "outerwear", label: "Outerwear" },
    { value: "shoes", label: "Shoes" },
    { value: "accessories", label: "Accessories" },
  ]

  const sizes = [
    { value: "all", label: "All Sizes" },
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "points", label: "Points (High to Low)" },
    { value: "points-asc", label: "Points (Low to High)" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value)
              handleFilterChange()
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={(value) => {
              setSelectedSize(value)
              handleFilterChange()
            }}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value)
              handleFilterChange()
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            {loading ? "Loading..." : `${items.length} items found`}
          </h2>
          <p className="text-green-600">
            Discover sustainable fashion items from our community
          </p>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item: any) => (
              <Card key={item._id} className="overflow-hidden hover:shadow-xl hover:scale-105 hover:border-green-500 transition-all duration-300 cursor-pointer group">
                <div className="aspect-square relative bg-gray-100">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">{item.points} pts</Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => handleLike(item._id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg truncate flex-1 group-hover:text-green-700 transition-colors duration-300">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">Size {item.size}</Badge>
                    <Badge variant="outline" className="text-xs">{item.condition}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location || "Unknown"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-3 pt-3 border-t">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.user?.avatar} />
                      <AvatarFallback className="text-xs">
                        {item.user?.firstName?.[0]}{item.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Link 
                      href={`/profile/${item.user?._id}`}
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 truncate"
                    >
                      {item.user?.firstName} {item.user?.lastName}
                    </Link>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">4.8</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/item/${item._id}`} className="flex-1">
                      <Button className="w-full group-hover:bg-green-600 transition-colors duration-300" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="group-hover:border-green-500 group-hover:text-green-600 transition-colors duration-300">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                             <h3 className="text-lg font-semibold text-green-800 mb-2">No items found</h3>
               <p className="text-green-600 mb-4">
                 Try adjusting your search criteria or browse all items.
               </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedSize("all")
                  loadItems()
                }}>
                  Clear Filters
                </Button>
                {user && (
                  <Link href="/add-item">
                    <Button>
                      Add Your First Item
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
