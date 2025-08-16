"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Palette,
  Zap,
  Menu,
  X,
  Send,
  MapPin,
  Phone,
  Heart,
} from "lucide-react"
import type * as THREE from "three"

function FloatingCube({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  )
}

function AnimatedSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.5
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
    </mesh>
  )
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 100
  const [positions, setPositions] = useState<Float32Array | null>(null)

  useEffect(() => {
    const newPositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const seed = i * 0.1
      newPositions[i * 3] = Math.sin(seed) * Math.cos(seed * 2) * 10
      newPositions[i * 3 + 1] = Math.cos(seed) * Math.sin(seed * 3) * 10
      newPositions[i * 3 + 2] = Math.sin(seed * 2) * Math.cos(seed) * 10
    }
    setPositions(newPositions)
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  if (!positions) return null

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={particleCount} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#0891b2" size={0.05} />
    </points>
  )
}

function Footer3DElements() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#0891b2" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#f97316" />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-3, 0, 0]}>
          <torusGeometry args={[0.8, 0.3, 16, 100]} />
          <meshStandardMaterial color="#164e63" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
        <mesh position={[3, 0, -1]}>
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial color="#f97316" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh position={[0, 1, -2]}>
          <dodecahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#7c3aed" metalness={0.7} roughness={0.3} />
        </mesh>
      </Float>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      <Environment preset="night" />
    </>
  )
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f97316" />
      <FloatingCube position={[-4, 2, 0]} color="#164e63" />
      <FloatingCube position={[4, -1, -2]} color="#f97316" />
      <FloatingCube position={[0, 3, -1]} color="#0891b2" />
      <AnimatedSphere position={[-2, -2, 1]} color="#7c3aed" />
      <AnimatedSphere position={[3, 2, -3]} color="#dc2626" />
      <ParticleField />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      <Environment preset="night" />
    </>
  )
}

function Card3D({ children, className, ...props }: any) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      ref={cardRef}
      className={`${className} transform-gpu transition-all duration-500 ${
        isHovered ? "scale-105 rotate-y-12 shadow-2xl" : ""
      }`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div
        className="relative transition-transform duration-500"
        style={{
          transform: isHovered ? "rotateY(10deg) rotateX(5deg)" : "rotateY(0deg) rotateX(0deg)",
        }}
      >
        {children}
      </div>
    </div>
  )
}

const projects = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack React application with payment integration",
    tech: ["React", "Node.js", "Stripe", "MongoDB"],
    image: "/modern-ecommerce-interface.png",
    link: "#",
  },
  {
    title: "3D Visualization Tool",
    description: "Interactive 3D data visualization using Three.js",
    tech: ["Three.js", "WebGL", "D3.js", "TypeScript"],
    image: "/3d-data-dashboard.png",
    link: "#",
  },
  {
    title: "Mobile App Design",
    description: "UI/UX design for fitness tracking mobile application",
    tech: ["Figma", "React Native", "Animation", "Prototyping"],
    image: "/mobile-fitness-app-mockup.png",
    link: "#",
  },
]

const skills = [
  { name: "Frontend Development", icon: Code, level: 95 },
  { name: "3D Graphics", icon: Zap, level: 85 },
  { name: "UI/UX Design", icon: Palette, level: 90 },
]

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [animationTime, setAnimationTime] = useState(0)

  useEffect(() => {
    setIsClient(true)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      const sections = document.querySelectorAll("section")
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          const sectionNames = ["hero", "projects", "skills", "about"]
          setActiveSection(sectionNames[index] || "hero")
        }
      })
    }

    const animateLoop = () => {
      setAnimationTime(Date.now() * 0.001)
      requestAnimationFrame(animateLoop)
    }
    animateLoop()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
    setActiveSection("contact")
  }
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
    setActiveSection("projects")
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-xl font-heading font-black text-cyan-400 cursor-pointer relative overflow-hidden"
              style={{
                transform: isClient ? `translateY(${Math.sin(scrollY * 0.01) * 2}px)` : "translateY(0px)",
              }}
            >
              <span className="relative z-10 animate-pulse hover:scale-110 transition-transform duration-300">
                {"Hussain"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-orange-500 opacity-20 blur-sm animate-pulse" />
            </h1>

            <div className="hidden md:flex items-center gap-6">
              {["Home", "Projects", "Skills", "About"].map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    const sectionNames = ["hero", "projects", "skills", "about"]
                    setActiveSection(sectionNames[index])
                    const sections = document.querySelectorAll("section")
                    sections[index]?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className={`text-sm font-medium transition-all duration-500 hover:scale-110 relative group ${
                    activeSection === ["hero", "projects", "skills", "about"][index]
                      ? "text-cyan-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                  style={{
                    transform: isClient
                      ? `translateY(${Math.sin(scrollY * 0.01 + index * 0.5) * 1}px)`
                      : "translateY(0px)",
                  }}
                >
                  {item}
                  <div
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-orange-500 transition-all duration-300 ${
                      activeSection === ["hero", "projects", "skills", "about"][index]
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              ))}
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                onClick={scrollToContact}
                style={{
                  transform: isClient
                    ? `translateY(${Math.sin(scrollY * 0.01 + 1.5) * 1}px) scale(${1 + Math.sin(scrollY * 0.02) * 0.02})`
                    : "translateY(0px) scale(1)",
                }}
              >
                <span className="animate-pulse">Contact</span>
              </Button>
            </div>

            <button
              className="md:hidden text-white transform hover:scale-110 transition-all duration-300 relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                transform: `rotate(${isMobileMenuOpen ? 180 : 0}deg)`,
              }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 animate-spin" /> : <Menu className="h-6 w-6 animate-pulse" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800 animate-fade-in">
              <div className="flex flex-col gap-4 pt-4">
                {["Home", "Projects", "Skills", "About", "Contact"].map((item, index) => (
                  <button
                    key={item}
                    onClick={() => {
                      if (item === "Contact") {
                        scrollToContact()
                      } else {
                        const sectionNames = ["hero", "projects", "skills", "about"]
                        setActiveSection(sectionNames[index])
                        const sections = document.querySelectorAll("section")
                        sections[index]?.scrollIntoView({ behavior: "smooth" })
                      }
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-left text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-4 hover:scale-105 relative group"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <span className="relative z-10">{item}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-orange-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        {isClient && (
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
              <Suspense fallback={null}>
                <Scene3D />
              </Suspense>
            </Canvas>
          </div>
        )}

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-heading font-black text-white mb-6 animate-pulse">
            A Creative 
            <span className="text-cyan-400 block animate-bounce">Developer</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto italic">
            Blending creativity and technology to build digital experiences that inspire
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600 text-white transform hover:scale-105 transition-all"
              onClick={scrollToProjects}
            >
              View Projects
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 transform hover:scale-105 transition-all bg-transparent"
            >
              Download CV
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8">
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800 transform hover:scale-110 transition-all"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <Github className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800 transform hover:scale-110 transition-all"
              onClick={() => window.open("https://linkedin.com", "_blank")}
            >
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800 transform hover:scale-110 transition-all bg-transparent"
              onClick={() => window.open("mailto:contact@example.com", "_blank")}
            >
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section id="projects"  className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black text-white mb-4 animate-fade-in">Featured Projects</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in">
              A showcase of my latest work combining creativity with technical excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card3D
                key={index}
                className="group bg-gray-900 border-gray-700 hover:border-cyan-400 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader>
                  <CardTitle className="font-heading font-bold text-white">{project.title}</CardTitle>
                  <CardDescription className="text-gray-300">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="secondary"
                        className="text-xs bg-gray-700 text-gray-300 hover:bg-cyan-500 hover:text-white transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="w-full group bg-cyan-500 hover:bg-cyan-600 text-white transform hover:scale-105 transition-all"
                  >
                    View Project
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black text-white mb-4 animate-fade-in">About Me</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in">
              Passionate developer with a love for creating immersive digital experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-orange-500/20 rounded-full animate-pulse blur-xl"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-orange-500 rounded-full opacity-20 animate-spin-slow blur-sm"></div>

                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gray-700 group-hover:border-cyan-400 transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-3">
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                    <div className="text-6xl text-gray-500 animate-pulse">👤</div>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm text-center px-4">
                       <img src=" " />
                        <br />
                        <span className="text-cyan-400">Add your image here</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-500 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute top-1/2 -left-8 w-4 h-4 bg-purple-500 rounded-full animate-ping opacity-40"></div>
              </div>
            </div>

            <div className="transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-heading font-bold text-white mb-4 relative">
                Hello, I'm <span className="text-cyan-400 animate-pulse">Hussain</span>
                <div className="absolute -bottom-1 left-0 w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-orange-500"></div>
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                A passionate full-stack developer and 3D enthusiast with over 5 years of experience creating innovative
                digital solutions. I specialize in modern web technologies and love bringing creative visions to life
                through code.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold text-cyan-400 animate-pulse">10+</div>
                <div className="text-sm text-gray-300">Projects Completed</div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold text-orange-500 animate-pulse">2+</div>
                <div className="text-sm text-gray-300">Years Experience</div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold text-purple-500 animate-pulse">30+</div>
                <div className="text-sm text-gray-300">Happy Clients</div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold text-green-500 animate-pulse">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white transform hover:scale-105 transition-all duration-300">
                Download Resume
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 transform hover:scale-105 transition-all bg-transparent"
                onClick={scrollToContact}
              >
                Let's Talk
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-orange-500 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-purple-500 rounded-full animate-pulse opacity-50"></div>
      </section>

      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black text-white mb-4 animate-bounce">Skills & Expertise</h2>
            <p className="text-lg text-gray-300">Technologies and tools I use to bring ideas to life</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <Card
                key={index}
                className="text-center p-8 bg-gray-800 border-gray-700 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
              >
                <CardContent className="pt-6">
                  <skill.icon className="h-12 w-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-heading font-bold mb-4 text-white">{skill.name}</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-orange-500 h-2 rounded-full transition-all duration-1000 animate-pulse"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-300">{skill.level}%</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black text-white mb-4 animate-bounce">Get In Touch</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Have a project in mind? Let's discuss how we can bring your vision to life with cutting-edge technology
              and creative design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-4 p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <Mail className="h-8 w-8 text-cyan-400 animate-pulse" />
                <div>
                  <h3 className="font-heading font-bold text-white">Email</h3>
                  <p className="text-gray-300">hussainajmal6780@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <Phone className="h-8 w-8 text-cyan-400 animate-pulse" />
                <div>
                  <h3 className="font-heading font-bold text-white">Phone</h3>
                  <p className="text-gray-300">+92 3024843779</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <MapPin className="h-8 w-8 text-cyan-400 animate-pulse" />
                <div>
                  <h3 className="font-heading font-bold text-white">Location</h3>
                  <p className="text-gray-300">Lahore ,Pakistan</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800 transform hover:scale-110 transition-all duration-300 animate-bounce"
                  onClick={() => window.open("https://github.com", "_blank")}
                >
                  <Github className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800 transform hover:scale-110 transition-all duration-300 animate-bounce"
                  onClick={() => window.open("https://linkedin.com", "_blank")}
                >
                  <Linkedin className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800 transform hover:scale-110 transition-all duration-300 animate-bounce"
                  onClick={() => window.open("mailto:hello@portfolio.dev", "_blank")}
                >
                  <Mail className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-all duration-500 transform hover:scale-105">
              <CardHeader>
                <CardTitle className="font-heading font-bold text-white">Send Message</CardTitle>
                <CardDescription className="text-gray-300">
                  Fill out the form below and I'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block"></label>
                    <Input
                      placeholder="Your name"
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Subject</label>
                  <Input
                    placeholder="Project inquiry"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Message</label>
                  <Textarea
                    placeholder="Tell me about your project..."
                    rows={5}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 transition-all duration-300 resize-none"
                  />
                </div>

                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white transform hover:scale-105 transition-all duration-300 animate-pulse">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="relative bg-gray-950 border-t border-gray-800 py-12 px-6 overflow-hidden">
        {isClient && (
          <div className="absolute inset-0 h-64 opacity-30">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <Suspense fallback={null}>
                <Footer3DElements />
              </Suspense>
            </Canvas>
          </div>
        )}

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-heading font-black text-cyan-400 mb-4 relative">
                <span className="animate-pulse">Portfolio</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-orange-500/20 blur-sm animate-pulse" />
              </h3>
              <p className="text-gray-300 mb-4 max-w-md">
                Creating innovative digital experiences through the perfect blend of design and technology. Let's build
                something amazing together.
              </p>
              <div className="flex gap-4">
                {[Github, Linkedin, Mail].map((Icon, index) => (
                  <Button
                    key={index}
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-cyan-400 hover:bg-gray-800 transform hover:scale-110 transition-all duration-300 relative group"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      transform: isClient
                        ? `translateY(${Math.sin(animationTime + index * 0.5) * 2}px)`
                        : "translateY(0px)",
                    }}
                  >
                    <Icon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-transparent rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </Button>
                ))}
              </div>
            </div>

            <div className="transform hover:scale-105 transition-all duration-300">
              <h4 className="font-heading font-bold text-white mb-4 relative">
                Quick Links
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-orange-500" />
              </h4>
              <ul className="space-y-2">
                {["Home", "Projects", "Skills", "About", "Contact"].map((item, index) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        if (item === "Contact") {
                          scrollToContact()
                        } else {
                          const sectionNames = ["hero", "projects", "skills", "about"]
                          const sections = document.querySelectorAll("section")
                          sections[index]?.scrollIntoView({ behavior: "smooth" })
                        }
                      }}
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:translate-x-2 relative group"
                    >
                      {item}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="transform hover:scale-105 transition-all duration-300">
              <h4 className="font-heading font-bold text-white mb-4 relative">
                Services
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-orange-500" />
              </h4>
              <ul className="space-y-2 text-gray-400">
                {["Web Development", "3D Visualization", "UI/UX Design", "Consulting"].map((service, index) => (
                  <li
                    key={service}
                    className="hover:text-cyan-400 transition-all duration-300 cursor-pointer relative group hover:translate-x-1"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {service}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm animate-fade-in">© 2024 Portfolio. All rights reserved.</p>
            <div className="flex items-center gap-2 text-gray-400 text-sm group">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse group-hover:scale-125 transition-transform duration-300" />
              <span>and lots of coffee</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
