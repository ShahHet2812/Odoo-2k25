"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { apiClient } from "@/lib/api"
import { demoStorage } from "@/lib/demo-storage"
import { useAuth } from "@/lib/auth"
import {
  Package,
  Star,
  MapPin,
  Calendar,
  Heart,
  Eye,
  ArrowUpDown,
  User,
  Activity,
  MessageSquare,
} from "lucide-react"

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<any>(null)
  const [userItems, setUserItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("items")

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      setError("")
      try {
        console.log('Fetching user profile for ID:', params.id)
        
        // Try to fetch user profile from API
        const profileResponse = await apiClient.getUserProfile(params.id)
        const itemsResponse = await apiClient.getUserItems(params.id)
        
        if (profileResponse.success && profileResponse.data) {
          setProfileUser(profileResponse.data)
        } else {
          // Fallback to demo data
          const demoItems = demoStorage.getItems()
          const demoUser = {
            _id: params.id,
            firstName: "Demo",
            lastName: "User",
            avatar: "/placeholder-user.jpg",
            location: "Demo City",
            joinDate: "2024",
            rating: 4.8,
            totalSwaps: 15,
            points: 250,
            itemsListed: demoItems.filter(item => item.userId === params.id).length
          }
          setProfileUser(demoUser)
        }
        
        if (itemsResponse.success && itemsResponse.data) {
          setUserItems(itemsResponse.data.items || [])
        } else {
          // Fallback to demo items
          const demoItems = demoStorage.getItems()
          const userDemoItems = demoItems.filter(item => item.userId === params.id)
          setUserItems(userDemoItems)
        }
        
      } catch (err) {
        console.error('Error fetching user profile:', err)
        setError("Failed to load user profile.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-green-700 text-xl font-semibold">Loading profile...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 text-xl font-semibold">{error || "User not found."}</div>
          </div>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser && currentUser.id === params.id

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileUser.avatar} />
                <AvatarFallback className="text-2xl">
                  {profileUser.firstName?.[0]}{profileUser.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profileUser.firstName} {profileUser.lastName}
                  </h1>
                  {isOwnProfile && (
                    <Badge variant="outline">You</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{profileUser.rating}</span>
                  <span className="text-gray-600">({profileUser.totalSwaps} swaps)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{profileUser.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Member since {profileUser.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{profileUser.itemsListed || userItems.length} items listed</span>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <div className="flex gap-3">
                    <Link href="/settings">
                      <Button variant="outline">
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href="/add-item">
                      <Button>
                        <Package className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">Items ({userItems.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            {userItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userItems.map((item: any) => (
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
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg truncate flex-1 group-hover:text-green-700 transition-colors duration-300">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">Size {item.size}</Badge>
                        <Badge variant="outline" className="text-xs">{item.condition}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No items listed</h3>
                  <p className="text-gray-600 mb-4">
                    {isOwnProfile ? "You haven't listed any items yet." : "This user hasn't listed any items yet."}
                  </p>
                  {isOwnProfile && (
                    <Link href="/add-item">
                      <Button>
                        <Package className="h-4 w-4 mr-2" />
                        Add Your First Item
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Listed a new item</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed a swap</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Received a review</p>
                      <p className="text-xs text-gray-500">2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">John Doe</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      "Great experience swapping with this user! The item was exactly as described and shipping was fast."
                    </p>
                    <p className="text-xs text-gray-500 mt-2">1 week ago</p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">Jane Smith</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 text-gray-300" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      "Very reliable trader. Communication was excellent throughout the swap process."
                    </p>
                    <p className="text-xs text-gray-500 mt-2">2 weeks ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 