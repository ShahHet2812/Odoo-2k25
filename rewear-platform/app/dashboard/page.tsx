"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import { Navigation } from "@/components/navigation"
import { demoStorage } from "@/lib/demo-storage"
import {
  Package,
  ArrowUpDown,
  TrendingUp,
  Star,
  Settings,
  Plus,
  Eye,
  Heart,
  MessageSquare,
  Award,
  Calendar,
  MapPin,
  Edit,
  Coins,
} from "lucide-react"

// Helper function to format date safely
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Unknown date"
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return "Unknown date"
  }
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalItems: 0,
    totalViews: 0,
    totalLikes: 0,
    totalSwaps: 0,
    points: user?.points || 0
  })
  const [recentItems, setRecentItems] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    setLoading(true)
    try {
      // Load user items
      const itemsResponse = await apiClient.getUserItems(user!.id)
      
      if (itemsResponse.success && itemsResponse.data) {
        const data = itemsResponse.data as any
        setItems(data.items || [])
        setStats(prev => ({
          ...prev,
          totalItems: data.items?.length || 0,
          totalViews: data.items?.reduce((sum: number, item: any) => sum + (item.views || 0), 0) || 0,
          totalLikes: data.items?.reduce((sum: number, item: any) => sum + (item.likes || 0), 0) || 0,
          points: user?.points || 0
        }))
      } else {
        // Fallback to demo storage
        const demoItems = demoStorage.getUserItems(user!.id)
        setItems(demoItems)
        setStats(prev => ({
          ...prev,
          totalItems: demoItems.length,
          totalViews: demoItems.reduce((sum, item) => sum + ((item as any).views || 0), 0),
          totalLikes: demoItems.reduce((sum, item) => sum + ((item as any).likes || 0), 0),
          points: user?.points || 0
        }))
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      // Fallback to demo storage
      const demoItems = demoStorage.getUserItems(user!.id)
      setItems(demoItems)
      setStats(prev => ({
        ...prev,
        totalItems: demoItems.length,
        totalViews: demoItems.reduce((sum, item) => sum + ((item as any).views || 0), 0),
        totalLikes: demoItems.reduce((sum, item) => sum + ((item as any).likes || 0), 0),
        points: user?.points || 0
      }))
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Required</h2>
              <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
              <Link href="/login">
                <Button>Go to Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getLevelProgress = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-green-800 mb-2">
                  Welcome back, {user?.firstName || 'User'}!
                </h1>
                <p className="text-green-600">
                  Here's what's happening with your sustainable fashion journey.
                </p>
              </div>
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>

            {/* User Info Card */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-lg">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-green-800 mb-1">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-green-600 mb-2">{user?.email}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {user?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {user.location}
                        </div>
                      )}
                                              <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Member since {user?.joinDate ? formatDate(user.joinDate) : 'Recently'}
                        </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {user?.points || 0} pts
                    </div>
                    <Badge variant="secondary">{user?.level || 'Bronze Swapper'}</Badge>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Level Progress</span>
                    <span>{Math.round(getLevelProgress())}%</span>
                  </div>
                  <Progress value={getLevelProgress()} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Items Listed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Likes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Coins className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Your Points</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.points}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                                 <CardTitle className="flex items-center gap-2 text-green-800">
                   <TrendingUp className="h-5 w-5" />
                   Recent Activity
                 </CardTitle>
                 <CardDescription className="text-green-600">
                   Your latest items and interactions
                 </CardDescription>
              </CardHeader>
              <CardContent>
                {recentItems.length > 0 ? (
                  <div className="space-y-4">
                    {recentItems.map((item: any) => (
                      <div key={item._id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                          {item.images?.[0] && (
                            <Image
                              src={item.images[0]}
                              alt={item.title}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{item.points} pts</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                       <h3 className="text-lg font-semibold text-green-800 mb-2">No items yet</h3>
                   <p className="text-green-600 mb-4">Start by adding your first item to the platform.</p>
                    <Link href="/add-item">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Item
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                                 <CardTitle className="flex items-center gap-2 text-green-800">
                   <Award className="h-5 w-5" />
                   Quick Actions
                 </CardTitle>
                 <CardDescription className="text-green-600">
                   Common tasks and shortcuts
                 </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/add-item">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-3" />
                      Add New Item
                    </Button>
                  </Link>
                  
                  <Link href="/browse">
                    <Button className="w-full justify-start" variant="outline">
                      <Eye className="h-4 w-4 mr-3" />
                      Browse Items
                    </Button>
                  </Link>
                  
                  <Link href="/settings">
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-3" />
                      Account Settings
                    </Button>
                  </Link>
                  
                  <Button className="w-full justify-start" variant="outline" disabled>
                    <MessageSquare className="h-4 w-4 mr-3" />
                    View Messages
                  </Button>
                </div>

                {/* Stats Summary */}
                                 <div className="mt-6 p-4 bg-green-50 rounded-lg">
                   <h4 className="font-medium mb-3 text-green-800">Your Impact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Items Listed:</span>
                      <span className="font-medium">{stats.totalItems}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
