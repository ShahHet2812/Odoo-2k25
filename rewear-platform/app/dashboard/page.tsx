"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Star, TrendingUp, Calendar, MapPin, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">ReWear</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/browse">
                <Button variant="ghost">Browse</Button>
              </Link>
              <Link href="/add-item">
                <Button>Add Item</Button>
              </Link>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{user?.firstName[0]}{user?.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-2xl">{user?.firstName[0]}{user?.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{user?.firstName} {user?.lastName}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                  <Badge className="bg-yellow-100 text-yellow-800 mt-2">{user?.level}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{user?.points}</div>
                    <div className="text-sm text-gray-600">Points Available</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Swaps</span>
                      <span className="font-semibold">{user?.totalSwaps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Items Listed</span>
                      <span className="font-semibold">{user?.itemsListed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{user?.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Member Since</span>
                      <span className="font-semibold">{user?.joinDate}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Link href="/settings">
                      <Button variant="outline" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="items">My Items</TabsTrigger>
                  <TabsTrigger value="swaps">Swaps</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Points Earned</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{(user?.points || 0) + 50}</div>
                        <p className="text-xs text-muted-foreground">+15 from this month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Successful Swaps</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{user?.totalSwaps}</div>
                        <p className="text-xs text-muted-foreground">+3 from this month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Items Listed</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{user?.itemsListed}</div>
                        <p className="text-xs text-muted-foreground">+2 from this month</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest swaps and interactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Item listed: Vintage Denim Jacket</p>
                            <p className="text-sm text-gray-500">2 days ago</p>
                          </div>
                          <Badge variant="secondary">Listed</Badge>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Star className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Swap completed: Summer Dress</p>
                            <p className="text-sm text-gray-500">1 week ago</p>
                          </div>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Points earned: +10</p>
                            <p className="text-sm text-gray-500">2 weeks ago</p>
                          </div>
                          <Badge variant="secondary">Points</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Timeline</CardTitle>
                      <CardDescription>Your complete activity history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Activity timeline coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="items" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Listed Items</CardTitle>
                      <CardDescription>Manage your listed clothing items</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No items listed yet</p>
                        <Link href="/add-item">
                          <Button className="mt-4">List Your First Item</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="swaps" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Swap History</CardTitle>
                      <CardDescription>Track all your completed and pending swaps</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-gray-500">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No swaps yet</p>
                        <Link href="/browse">
                          <Button className="mt-4">Start Browsing</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
