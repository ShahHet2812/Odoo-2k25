"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import {
  User,
  Settings,
  Shield,
  Bell,
  Camera,
  MapPin,
  Edit,
  Save,
  X,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"

export default function SettingsPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    location: "",
    bio: "",
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState(false)

  // Preferences state
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
    },
    privacy: {
      showLocation: true,
      showStats: true,
    },
  })

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        location: user.location || "",
        bio: user.bio || "",
      })
      setAvatarUrl(user.avatar || "")
    }
  }, [user])

  const handleProfileUpdate = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await apiClient.updateProfile(profileForm)
      
      if (response.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
          variant: "default",
        })
      } else {
        toast({
          title: "Update Failed",
          description: response.message || "Failed to update profile.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      if (response.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
          variant: "default",
        })
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "Password Change Failed",
          description: response.message || "Failed to change password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while changing your password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return

    setLoading(true)
    try {
      // In a real app, you'd upload to Cloudinary first
      const fakeUploadUrl = URL.createObjectURL(avatarFile)
      
      const response = await apiClient.updateAvatar(user.id, fakeUploadUrl)
      
      if (response.success) {
        setAvatarUrl(fakeUploadUrl)
        toast({
          title: "Avatar Updated",
          description: "Your avatar has been updated successfully.",
          variant: "default",
        })
      } else {
        toast({
          title: "Avatar Update Failed",
          description: response.message || "Failed to update avatar.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your avatar.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await apiClient.updatePreferences(user.id, preferences)
      
      if (response.success) {
        toast({
          title: "Preferences Updated",
          description: "Your preferences have been updated successfully.",
          variant: "default",
        })
      } else {
        toast({
          title: "Preferences Update Failed",
          description: response.message || "Failed to update preferences.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your preferences.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAccountDeactivation = async () => {
    if (!user) return

    if (!confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.deactivateAccount(user.id)
      
      if (response.success) {
        toast({
          title: "Account Deactivated",
          description: "Your account has been deactivated successfully.",
          variant: "default",
        })
        // Redirect to home page
        window.location.href = "/"
      } else {
        toast({
          title: "Deactivation Failed",
          description: response.message || "Failed to deactivate account.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deactivating your account.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-4">Please log in to access your settings.</p>
              <Link href="/login">
                <Button>Go to Login</Button>
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
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <User className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">Settings</span>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
            <p className="text-gray-600">Manage your profile, security, and preferences.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="danger" className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and avatar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarUrl || user.avatar} />
                        <AvatarFallback>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setAvatarFile(file)
                            setAvatarUrl(URL.createObjectURL(file))
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Profile Picture</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Upload a new profile picture. Recommended size: 200x200 pixels.
                      </p>
                      {avatarFile && (
                        <Button onClick={handleAvatarUpload} disabled={loading}>
                          {loading ? "Uploading..." : "Save Avatar"}
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Form */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter your location"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleProfileUpdate} disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter your current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter your new password"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handlePasswordChange} disabled={loading}>
                      {loading ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                  <CardDescription>
                    Manage your account security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Login Sessions</h4>
                        <p className="text-sm text-gray-600">Manage your active login sessions</p>
                      </div>
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.email}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.push}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control what information is visible to other users.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Location</h4>
                      <p className="text-sm text-gray-600">Allow others to see your location</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showLocation}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, showLocation: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Statistics</h4>
                      <p className="text-sm text-gray-600">Allow others to see your swap statistics</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showStats}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, showStats: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handlePreferencesUpdate} disabled={loading}>
                      {loading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger" className="space-y-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Deactivate Account</h4>
                    <p className="text-sm text-red-700 mb-4">
                      This will deactivate your account and hide your profile from other users. 
                      You can reactivate your account by logging in again.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleAccountDeactivation}
                      disabled={loading}
                    >
                      {loading ? "Deactivating..." : "Deactivate Account"}
                    </Button>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Delete Account</h4>
                    <p className="text-sm text-yellow-700 mb-4">
                      This will permanently delete your account and all associated data. 
                      This action cannot be undone.
                    </p>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 