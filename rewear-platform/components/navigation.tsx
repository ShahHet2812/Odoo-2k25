"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"
import {
  Package,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse">
              <Button variant="ghost">Browse</Button>
            </Link>
            {user ? (
              <>
                <Link href="/add-item">
                  <Button>Add Item</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/how-it-works">
                  <Button variant="ghost">How It Works</Button>
                </Link>
                <Link href="/about">
                  <Button variant="ghost">About</Button>
                </Link>
              </>
            )}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/settings">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col gap-2">
              <Link href="/browse">
                <Button variant="ghost" className="w-full justify-start">
                  Browse
                </Button>
              </Link>
              {user ? (
                <>
                  <Link href="/add-item">
                    <Button className="w-full justify-start">
                      Add Item
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/how-it-works">
                    <Button variant="ghost" className="w-full justify-start">
                      How It Works
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="ghost" className="w-full justify-start">
                      About
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full justify-start">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 