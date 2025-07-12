"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Recycle, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DemoResetLinkPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [resetLink, setResetLink] = useState("")

  const generateResetLink = () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('rewear_users') || '[]')
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      toast({
        title: "Error",
        description: "No account found with this email address",
        variant: "destructive",
      })
      return
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('reset_token', resetToken)
    localStorage.setItem('reset_email', email)

    const link = `${window.location.origin}/reset-password?token=${resetToken}`
    setResetLink(link)

    toast({
      title: "Reset link generated!",
      description: "You can now test the password reset functionality.",
    })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resetLink)
      toast({
        title: "Copied!",
        description: "Reset link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Recycle className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold">ReWear</span>
          </div>
          <CardTitle>Demo: Password Reset Link Generator</CardTitle>
          <CardDescription>
            This page helps you test the password reset functionality. Enter an email address of an existing user to generate a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email of existing user"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={generateResetLink}>
                  Generate Link
                </Button>
              </div>
            </div>

            {resetLink && (
              <div className="space-y-4">
                <div>
                  <Label>Reset Link</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={resetLink}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Link href={resetLink} target="_blank">
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">How to test:</p>
                    <ol className="space-y-1 text-blue-700 list-decimal list-inside">
                      <li>Click the "Open Link" button above or copy the link</li>
                      <li>You'll be taken to the reset password page</li>
                      <li>Enter a new password and confirm it</li>
                      <li>After successful reset, you can login with the new password</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="outline">
                  Back to Login
                </Button>
              </Link>
              <Link href="/forgot-password">
                <Button variant="outline">
                  Forgot Password Page
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 