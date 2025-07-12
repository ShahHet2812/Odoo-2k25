"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, Package, Users, AlertTriangle, Check, X, Eye, TrendingUp, Calendar } from "lucide-react"

const pendingItems = [
  {
    id: 1,
    title: "Designer Handbag",
    uploader: "Jane Smith",
    category: "Accessories",
    condition: "Like New",
    submittedDate: "2024-01-15",
    image: "/placeholder.svg?height=100&width=100",
    flagged: false,
  },
  {
    id: 2,
    title: "Vintage Band T-Shirt",
    uploader: "Mike Johnson",
    category: "Tops",
    condition: "Good",
    submittedDate: "2024-01-14",
    image: "/placeholder.svg?height=100&width=100",
    flagged: true,
  },
  {
    id: 3,
    title: "Winter Coat",
    uploader: "Sarah Wilson",
    category: "Outerwear",
    condition: "Excellent",
    submittedDate: "2024-01-13",
    image: "/placeholder.svg?height=100&width=100",
    flagged: false,
  },
]

const reportedItems = [
  {
    id: 4,
    title: "Suspicious Designer Item",
    uploader: "Unknown User",
    reporter: "Community Member",
    reason: "Potentially counterfeit",
    reportDate: "2024-01-12",
    image: "/placeholder.svg?height=100&width=100",
  },
]

const stats = {
  totalUsers: 10247,
  activeListings: 3456,
  pendingReviews: 23,
  completedSwaps: 8934,
  monthlyGrowth: 12.5,
}

export default function AdminPage() {
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const handleApprove = (itemId: number) => {
    console.log("Approving item:", itemId)
    // Handle approval logic
  }

  const handleReject = (itemId: number) => {
    console.log("Rejecting item:", itemId)
    // Handle rejection logic
  }

  const handleRemove = (itemId: number) => {
    console.log("Removing item:", itemId)
    // Handle removal logic
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            <span className="text-xl font-bold">ReWear Admin</span>
          </div>
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <Package className="h-5 w-5" />
            Back to ReWear
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold">{stats.activeListings.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Swaps</p>
                  <p className="text-2xl font-bold">{stats.completedSwaps.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Items ({pendingItems.length})</TabsTrigger>
            <TabsTrigger value="reported">Reported Items ({reportedItems.length})</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Items Pending Review</CardTitle>
                <CardDescription>Review and moderate new item listings before they go live</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Uploader</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={50}
                              height={50}
                              className="rounded-lg object-cover"
                            />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.uploader}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.condition}</Badge>
                        </TableCell>
                        <TableCell>{item.submittedDate}</TableCell>
                        <TableCell>
                          {item.flagged ? (
                            <Badge variant="destructive">Flagged</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Review Item: {item.title}</DialogTitle>
                                  <DialogDescription>Detailed view for moderation review</DialogDescription>
                                </DialogHeader>
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.title}
                                      width={300}
                                      height={300}
                                      className="rounded-lg object-cover w-full"
                                    />
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold mb-2">Item Details</h3>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <strong>Title:</strong> {item.title}
                                        </div>
                                        <div>
                                          <strong>Category:</strong> {item.category}
                                        </div>
                                        <div>
                                          <strong>Condition:</strong> {item.condition}
                                        </div>
                                        <div>
                                          <strong>Uploader:</strong> {item.uploader}
                                        </div>
                                        <div>
                                          <strong>Submitted:</strong> {item.submittedDate}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button onClick={() => handleApprove(item.id)} className="flex-1">
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleReject(item.id)}
                                        className="flex-1"
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(item.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reported" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reported Items</CardTitle>
                <CardDescription>Items reported by the community for review</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Uploader</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Report Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={50}
                              height={50}
                              className="rounded-lg object-cover"
                            />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.uploader}</TableCell>
                        <TableCell>{item.reporter}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{item.reason}</Badge>
                        </TableCell>
                        <TableCell>{item.reportDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>User management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
