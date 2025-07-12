import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Recycle, Search, HelpCircle, MessageCircle, Shield, Package, Users, ArrowRight } from "lucide-react"

const helpCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics of using ReWear",
    icon: Users,
    articles: [
      "How to create your account",
      "Setting up your profile",
      "Understanding the points system",
      "Your first item listing",
    ],
  },
  {
    title: "Listing Items",
    description: "Tips for successful item listings",
    icon: Package,
    articles: [
      "Taking great photos",
      "Writing effective descriptions",
      "Pricing and condition guidelines",
      "Managing your listings",
    ],
  },
  {
    title: "Swapping & Trading",
    description: "How to exchange items safely",
    icon: MessageCircle,
    articles: ["Making swap requests", "Negotiating exchanges", "Meeting safely in person", "Shipping guidelines"],
  },
  {
    title: "Safety & Security",
    description: "Stay safe while swapping",
    icon: Shield,
    articles: [
      "Safety guidelines",
      "Reporting inappropriate behavior",
      "Protecting your personal information",
      "Dispute resolution",
    ],
  },
]

const popularArticles = [
  "How do I earn points on ReWear?",
  "What should I do if an item doesn't match the description?",
  "How can I increase my chances of successful swaps?",
  "Is it safe to meet strangers for clothing exchanges?",
  "How do I report a problem with another user?",
  "Can I cancel a swap request after it's been sent?",
]

export default function HelpPage() {
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
            Help
            <span className="block text-green-600">Center</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find answers to your questions and get the most out of your ReWear experience.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input placeholder="Search for help articles..." className="pl-12 h-14 text-lg" />
            <Button className="absolute right-2 top-2 bg-green-600 hover:bg-green-700">Search</Button>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Help Topics</h2>
            <p className="text-gray-600">Find detailed guides and tutorials for every aspect of ReWear</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <category.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Link
                          href={`/help/article/${article.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-sm text-green-600 hover:text-green-700 hover:underline"
                        >
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/help/category/${category.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View All Articles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Articles</h2>
            <p className="text-gray-600">Most frequently asked questions from our community</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {popularArticles.map((article, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <Link
                        href={`/help/article/${article.toLowerCase().replace(/[?]/g, "").replace(/\s+/g, "-")}`}
                        className="text-gray-900 hover:text-green-600 flex-1"
                      >
                        <div className="flex items-center gap-3">
                          <HelpCircle className="h-5 w-5 text-gray-400" />
                          {article}
                        </div>
                      </Link>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-gray-600">Can't find what you're looking for? Our support team is here to help.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Get instant help from our support team</p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>

                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Send us a detailed message and we'll respond within 24 hours</p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full bg-transparent">
                    Send Email
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <HelpCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Community Forum</h3>
                <p className="text-gray-600 mb-4">Ask questions and get help from other users</p>
                <Button variant="outline" className="w-full bg-transparent">
                  Visit Forum
                </Button>
              </CardContent>
            </Card>
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
            <p>&copy; 2025 ReWear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
