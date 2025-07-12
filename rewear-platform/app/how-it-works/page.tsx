import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recycle, Upload, Search, ArrowUpDown, Coins, Users, CheckCircle, ArrowRight } from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Create Your Account",
    description: "Sign up for free and join our sustainable fashion community",
    icon: Users,
    details: [
      "Quick and easy registration process",
      "Verify your email to get started",
      "Set up your profile and preferences",
      "Start with 10 welcome points",
    ],
  },
  {
    number: 2,
    title: "List Your Items",
    description: "Upload photos and details of clothing you no longer wear",
    icon: Upload,
    details: [
      "Take clear photos of your items",
      "Add detailed descriptions and measurements",
      "Set categories, sizes, and condition",
      "Items are reviewed within 24 hours",
    ],
  },
  {
    number: 3,
    title: "Browse & Discover",
    description: "Explore thousands of items from our community",
    icon: Search,
    details: [
      "Filter by size, category, and condition",
      "Save items to your wishlist",
      "View detailed item information",
      "Check uploader profiles and ratings",
    ],
  },
  {
    number: 4,
    title: "Swap or Redeem",
    description: "Exchange directly with others or use points to claim items",
    icon: ArrowUpDown,
    details: [
      "Send swap requests with personal messages",
      "Negotiate terms with other users",
      "Use earned points for instant redemption",
      "Track all your active exchanges",
    ],
  },
  {
    number: 5,
    title: "Earn Points",
    description: "Get points when others claim your items",
    icon: Coins,
    details: [
      "Earn points based on item condition and demand",
      "Bonus points for high-quality listings",
      "Build your reputation in the community",
      "Use points to get items you love",
    ],
  },
  {
    number: 6,
    title: "Complete Exchange",
    description: "Arrange pickup/delivery and enjoy your new-to-you items",
    icon: CheckCircle,
    details: [
      "Coordinate exchange details safely",
      "Meet in public places or use shipping",
      "Rate your exchange experience",
      "Build lasting community connections",
    ],
  },
]

const benefits = [
  {
    title: "Save Money",
    description: "Get designer and quality clothing at a fraction of retail prices",
    icon: "💰",
  },
  {
    title: "Reduce Waste",
    description: "Keep clothing out of landfills and give items a second life",
    icon: "🌱",
  },
  {
    title: "Discover Unique Pieces",
    description: "Find vintage, rare, and unique items you won't see everywhere",
    icon: "✨",
  },
  {
    title: "Build Community",
    description: "Connect with like-minded people who share your values",
    icon: "🤝",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">ReWear</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-gray-600 hover:text-gray-900">
              Browse Items
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            How ReWear
            <span className="block text-green-600">Works</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of fashion-conscious individuals who are making sustainable choices. Here's how easy it is to
            start swapping and earning points.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Steps to Start Swapping</h2>
            <p className="text-gray-600">Follow these easy steps to join our sustainable fashion community</p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="lg:w-1/2">
                  <Card className="p-8">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                          {step.number}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center gap-2 text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                  <div className="bg-green-100 p-8 rounded-full">
                    <step.icon className="h-16 w-16 text-green-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ReWear?</h2>
            <p className="text-gray-600">The benefits of joining our sustainable fashion community</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Points System */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Understanding Our Points System</h2>
            <p className="text-gray-600">Earn and spend points to make swapping even more flexible</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Coins className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Earning Points</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <Badge className="bg-green-600">+10</Badge>
                    <span>Welcome bonus for new members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge className="bg-green-600">+15-50</Badge>
                    <span>When someone claims your item</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge className="bg-green-600">+5</Badge>
                    <span>For each successful swap completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge className="bg-green-600">+2</Badge>
                    <span>For rating and reviewing exchanges</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <ArrowUpDown className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Using Points</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">15-50 pts</Badge>
                    <span>Redeem items instantly without swapping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">5 pts</Badge>
                    <span>Boost your item's visibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">10 pts</Badge>
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">25 pts</Badge>
                    <span>Early access to premium features</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is ReWear free to use?</h3>
                <p className="text-gray-600">
                  Yes! Creating an account and listing items is completely free. We only succeed when our community
                  thrives.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I ensure safe exchanges?</h3>
                <p className="text-gray-600">
                  We recommend meeting in public places, checking user ratings, and using our messaging system to
                  communicate. We also provide safety guidelines for all users.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What if I'm not satisfied with an exchange?
                </h3>
                <p className="text-gray-600">
                  We have a community-driven rating system and dispute resolution process. Our support team is always
                  available to help resolve any issues.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I ship items instead of meeting in person?
                </h3>
                <p className="text-gray-600">
                  Many of our users prefer shipping for convenience. You can arrange shipping details directly with
                  other community members.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Sustainable Fashion Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already making a difference through conscious fashion choices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                Browse Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Recycle className="h-6 w-6" />
                <span className="text-xl font-bold">ReWear</span>
              </div>
              <p className="text-gray-400">Building a sustainable future through community-driven fashion exchange.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/browse" className="hover:text-white transition-colors">
                    Browse Items
                  </Link>
                </li>
                <li>
                  <Link href="/add-item" className="hover:text-white transition-colors">
                    List an Item
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ReWear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
