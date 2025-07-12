"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
import { useState, useEffect } from "react"

export function Navigation() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [activePillPosition, setActivePillPosition] = useState(0)
  const [activePillWidth, setActivePillWidth] = useState(0)

  // Navigation items with their paths
  const navItems = [
    { href: "/browse", label: "Browse" },
    ...(user ? [
      { href: "/add-item", label: "Add Item" },
      { href: "/dashboard", label: "Dashboard" }
    ] : [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/about", label: "About" }
    ])
  ]

  // Update pill position when route changes
  useEffect(() => {
    const updatePillPosition = () => {
      const navContainer = document.querySelector('.nav-container')
      if (!navContainer) return

      const activeItem = navContainer.querySelector(`[href="${pathname}"]`)
      if (activeItem) {
        const containerRect = navContainer.getBoundingClientRect()
        const itemRect = activeItem.getBoundingClientRect()
        
        setActivePillPosition(itemRect.left - containerRect.left)
        setActivePillWidth(itemRect.width)
      } else {
        // Hide pill if no active item
        setActivePillPosition(-100)
        setActivePillWidth(0)
      }
    }

    // Small delay to ensure DOM is updated
    setTimeout(updatePillPosition, 100)
    updatePillPosition()
  }, [pathname])

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 nav-container relative">
            {/* Animated Pill */}
            <div 
              className="absolute bottom-0 h-1 bg-green-600 rounded-full transition-all duration-300 ease-out"
              style={{
                left: `${activePillPosition}px`,
                width: `${activePillWidth}px`,
                opacity: activePillWidth > 0 ? 1 : 0
              }}
            />
            
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant="ghost" 
                  className={`text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 ${
                    pathname === item.href ? 'text-green-600 bg-green-50' : ''
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/settings">
                  <Button variant="ghost" size="sm" className={`text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 ${
                    pathname === '/settings' ? 'text-green-600 bg-green-50' : ''
                  }`}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Link href="/settings">
                    <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-all duration-200 ring-2 ring-transparent hover:ring-green-200">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-green-100 text-green-700 font-medium">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className={`text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 ${
                    pathname === '/login' ? 'text-green-600 bg-green-50' : ''
                  }`}>
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-green-600 hover:bg-green-700 transition-all duration-200">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 ${
                      pathname === item.href ? 'text-green-600 bg-green-50' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              {user ? (
                <>
                  <Link href="/settings">
                    <Button variant="ghost" className={`w-full justify-start text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 ${
                      pathname === '/settings' ? 'text-green-600 bg-green-50' : ''
                    }`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className={`w-full justify-start text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 ${
                      pathname === '/login' ? 'text-green-600 bg-green-50' : ''
                    }`}>
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full justify-start bg-green-600 hover:bg-green-700 transition-all duration-200">
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