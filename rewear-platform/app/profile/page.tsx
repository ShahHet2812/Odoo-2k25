"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import {
  Package,
  ArrowUpDown,
  Star,
  MapPin,
  Calendar,
  Heart,
  Eye,
  MessageSquare,
  Award,
  Settings,
  Edit,
  Share,
  Flag,
} from "lucide-react"

export default function ProfilePage() {
  const params = useParams()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<any>(null)
  const [userItems, setUserItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("items")

  const userId = params.id as string

  useEffect(() => {
    if (userId) {
      loadProfileData()
    }
  }, [userId])

  const loadProfileData = async () => {
    setLoading(true)
    try {
      // Load user profile
      const userResponse = await apiClient.getUserById(userId)
      if (userResponse.success && userResponse.data) {
        setProfileUser(userResponse.data.user)
      }

      // Load user items
      const itemsResponse = await apiClient.getUserItems(userId, { page: 1, limit: 20 })
      if (itemsResponse.success && itemsResponse.data) {
        const data = itemsResponse.data as any
        setUserItems(data.items || [])
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelProgress = (user: any) => {
    if (!user) return 0
    
    const levels: Record<string, { min: number; max: number }> = {
      'Bronze Swapper': { min: 0, max: 50 },
      'Silver Swapper': { min: 50, max: 200 },
      'Gold Swapper': { min: 200, max: 500 },
      'Platinum Swapper': { min: 500, max: 1000 },
      'Diamond Swapper': { min: 1000, max: Infinity },
    }
    
    const currentLevel = levels[user.level || 'Bronze Swapper'] || levels['Bronze Swapper']
    const progress = Math.min(100, ((user.points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100)
    
    return progress
  }

  const isOwnProfile = currentUser && profileUser && currentUser.id === profileUser.id

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
              <p className="text-gray-600 mb-4">The user profile you're looking for doesn't exist.</p>
              <Link href="/browse">
                <Button>Browse Items</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/browse" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <Package className="h-5 w-5" />
            Back to Browse
          </Link>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={profileUser.avatar} />
              <AvatarFallback>
                {profileUser.firstName?.[0]}{profileUser.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-xl font-bold">{profileUser.firstName} {profileUser.lastName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            {!isOwnProfile && (
              <Button variant="ghost" size="sm">
                <Flag className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileUser.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profileUser.firstName?.[0]}{profileUser.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {profileUser.firstName} {profileUser.lastName}
                      </h1>
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        {profileUser.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {profileUser.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Member since {profileUser.joinDate || 'Recently'}
                        </div>
                      </div>
                      {profileUser.bio && (
                        <p className="text-gray-700 mb-4">{profileUser.bio}</p>
                      )}
                    </div>
                    
                    {isOwnProfile && (
                      <Link href="/settings">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{profileUser.points || 0}</div>
                      <div className="text-sm text-gray-600">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{userItems.length}</div>
                      <div className="text-sm text-gray-600">Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-sm text-gray-600">Swaps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">4.8</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>

                  {/* Level Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">{profileUser.level || 'Bronze Swapper'}</span>
                      <span>{Math.round(getLevelProgress(profileUser))}%</span>
                    </div>
                    <Progress value={getLevelProgress(profileUser)} className="h-2" />
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {profileUser.level || 'Bronze Swapper'}
                    </Badge>
                    <Badge variant="outline">Verified</Badge>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="items" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Items ({userItems.length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Items Tab */}
            <TabsContent value="items" className="space-y-6">
              {userItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userItems.map((item: any) => (
                    <Card key={item._id} className="overflow-hidden">
                      <div className="aspect-square relative bg-gray-100">
                        {item.images?.[0] ? (
                          <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">{item.points} pts</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 truncate">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Size {item.size}</span>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-500">0</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
                    <p className="text-gray-600">
                      {isOwnProfile 
                        ? "You haven't listed any items yet. Start by adding your first item!"
                        : "This user hasn't listed any items yet."
                      }
                    </p>
                    {isOwnProfile && (
                      <Link href="/add-item">
                        <Button className="mt-4">
                          Add Your First Item
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardContent className="p-8 text-center">
                  <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
                  <p className="text-gray-600">
                    {isOwnProfile 
                      ? "Your swap activity will appear here once you start trading items."
                      : "This user hasn't completed any swaps yet."
                    }
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardContent className="p-8 text-center">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">
                    {isOwnProfile 
                      ? "Reviews from other users will appear here after you complete swaps."
                      : "This user hasn't received any reviews yet."
                    }
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 