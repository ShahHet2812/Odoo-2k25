import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recycle, Users, Leaf, ArrowRight, Linkedin, Github, Mail, Heart, Target, Eye } from "lucide-react"

const founders = [
  {
    name: "Sarvesh Murlidhar",
    role: "Co-Founder & CEO",
    bio: "Passionate about sustainable technology and circular economy solutions. Sarvesh brings 5+ years of experience in product development and has a background in environmental engineering. He believes in the power of community-driven platforms to create meaningful environmental impact.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "https://linkedin.com/in/sarvesh-murlidhar",
    github: "https://github.com/sarvesh-murlidhar",
    email: "sarvesh@rewear.com",
    expertise: ["Product Strategy", "Sustainability", "Community Building"],
  },
  {
    name: "Het Shah",
    role: "Co-Founder & CTO",
    bio: "Full-stack developer with a passion for creating scalable, user-friendly applications. Het has extensive experience in modern web technologies and has previously worked on several successful marketplace platforms. He's dedicated to building technology that makes sustainable living accessible to everyone.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "https://linkedin.com/in/het-shah",
    github: "https://github.com/het-shah",
    email: "het@rewear.com",
    expertise: ["Full-Stack Development", "System Architecture", "User Experience"],
  },
  {
    name: "Yashraj Rathod",
    role: "Co-Founder & COO",
    bio: "Operations expert with a background in supply chain management and business development. Yashraj has worked with fashion brands to optimize their sustainability practices and understands the challenges of textile waste. He's committed to scaling ReWear's impact across communities.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "https://linkedin.com/in/yashraj-rathod",
    github: "https://github.com/yashraj-rathod",
    email: "yashraj@rewear.com",
    expertise: ["Operations", "Business Development", "Supply Chain"],
  },
]

const stats = [
  { number: "50,000+", label: "Items Exchanged", icon: Recycle },
  { number: "10,000+", label: "Active Members", icon: Users },
  { number: "25 Tons", label: "Textile Waste Saved", icon: Leaf },
]

const values = [
  {
    icon: Heart,
    title: "Community First",
    description:
      "We believe in the power of community to drive positive change. Every feature we build puts our users and their connections at the center.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "Our mission is to reduce textile waste and promote circular fashion. Every swap on our platform contributes to a more sustainable future.",
  },
  {
    icon: Target,
    title: "Accessibility",
    description:
      "Fashion should be accessible to everyone. We're breaking down barriers and making style affordable through community exchange.",
  },
]

export default function AboutPage() {
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
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How It Works
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
            About
            <span className="block text-green-600">ReWear</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're on a mission to revolutionize fashion consumption by creating a community-driven platform where
            clothing gets a second life, waste is reduced, and style becomes sustainable.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-6 w-6 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                A world where fashion is circular, accessible, and sustainable. Where every piece of clothing finds its
                perfect match with someone who will love and wear it, reducing waste and promoting conscious
                consumption.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-6 w-6 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                To build the world's largest community-driven clothing exchange platform that makes sustainable fashion
                accessible, affordable, and enjoyable for everyone while significantly reducing textile waste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-gray-600">Together, we're making a difference</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Founders</h2>
            <p className="text-gray-600">The passionate team behind ReWear's mission</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={founder.image || "/placeholder.svg"} alt={founder.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{founder.name}</h3>
                    <Badge className="bg-green-100 text-green-800">{founder.role}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{founder.bio}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {founder.expertise.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={founder.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      href={`mailto:${founder.email}`}
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            </div>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                ReWear was born from a simple observation: our closets are full of clothes we rarely wear, while the
                fashion industry continues to be one of the world's largest polluters. The three of us, coming from
                different backgrounds in technology, sustainability, and operations, realized we could create a solution
                that addresses both problems simultaneously.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                What started as weekend conversations about sustainable living evolved into late-night coding sessions
                and business planning. We envisioned a platform where clothing could have multiple lives, where
                communities could come together to share resources, and where sustainable choices could be both easy and
                rewarding.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Today, ReWear is more than just a clothing exchange platform—it's a movement toward conscious
                consumption, community building, and environmental responsibility. Every swap on our platform represents
                a small victory against waste and a step toward a more sustainable future.
              </p>
              <p className="text-lg leading-relaxed">
                We're just getting started, and we're excited to have you join us on this journey toward a more
                sustainable and connected world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Mission?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your sustainable fashion journey today and become part of the ReWear community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Join ReWear
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
