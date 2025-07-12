import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, FileText, Users, Shield, AlertTriangle, Scale } from "lucide-react"

export default function TermsPage() {
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

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600 text-lg">Last updated: January 1, 2024</p>
          <p className="text-gray-600 mt-2">Please read these terms carefully before using ReWear.</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                By accessing and using ReWear, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Platform Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                ReWear is a community-driven platform that facilitates the exchange of clothing items between users. Our
                service includes:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Item listing and browsing functionality</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>User-to-user messaging and swap coordination</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Points-based redemption system</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Community features and user profiles</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Security</h4>
                <p className="text-gray-600 text-sm">
                  You are responsible for maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Accurate Information</h4>
                <p className="text-gray-600 text-sm">
                  You must provide accurate, current, and complete information when listing items and creating your
                  profile.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Item Condition</h4>
                <p className="text-gray-600 text-sm">
                  You must accurately represent the condition, size, and other details of items you list for exchange.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Respectful Behavior</h4>
                <p className="text-gray-600 text-sm">
                  You agree to interact respectfully with other users and follow our community guidelines.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">The following activities are strictly prohibited:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Listing counterfeit, stolen, or illegal items</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Harassment, bullying, or inappropriate behavior toward other users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Creating multiple accounts to manipulate the points system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Using the platform for commercial purposes without authorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Attempting to circumvent security measures or access unauthorized areas</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Safety and Exchanges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Exchange Safety</h4>
                <p className="text-gray-600 text-sm">
                  ReWear facilitates connections between users but is not responsible for the actual exchange of items.
                  Users are responsible for their own safety during exchanges.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Meeting Guidelines</h4>
                <p className="text-gray-600 text-sm">
                  We strongly recommend meeting in public places, bringing a friend, and trusting your instincts. Never
                  share personal financial information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dispute Resolution</h4>
                <p className="text-gray-600 text-sm">
                  While we provide tools for reporting issues, users are primarily responsible for resolving disputes
                  related to item exchanges.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Points System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Our points system is designed to facilitate fair exchanges within the community:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Points have no monetary value and cannot be exchanged for cash</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Point values are determined by our algorithm based on item condition and demand</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>We reserve the right to adjust point values and system rules as needed</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Points may expire after extended periods of inactivity</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Platform Content</h4>
                <p className="text-gray-600 text-sm">
                  The ReWear platform, including its design, features, and content, is owned by ReWear and protected by
                  intellectual property laws.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">User Content</h4>
                <p className="text-gray-600 text-sm">
                  You retain ownership of content you post but grant ReWear a license to use, display, and distribute
                  your content on the platform.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-green-600" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                ReWear provides the platform "as is" and makes no warranties about its availability, accuracy, or
                reliability. We are not liable for any damages arising from your use of the platform or interactions
                with other users. Our liability is limited to the maximum extent permitted by law.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful
                behavior. You may also delete your account at any time through your account settings.
              </p>
              <p className="text-gray-600">
                Upon termination, your access to the platform will cease, and any unused points will be forfeited.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We may update these Terms of Service from time to time. We will notify users of material changes by
                posting the updated terms on this page and updating the "Last updated" date. Continued use of the
                platform after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                These terms are governed by the laws of the State of California, United States. Any disputes will be
                resolved in the courts of San Francisco County, California.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Email:</strong> legal@rewear.com
                </p>
                <p>
                  <strong>Address:</strong> 123 Sustainable Street, San Francisco, CA 94102
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
