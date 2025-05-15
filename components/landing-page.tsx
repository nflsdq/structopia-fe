"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BookOpen, Award, BarChart2, Brain, ChevronRight, Code, Zap, Lightbulb, Users } from "lucide-react"

export function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen flex flex-col blob-bg">
      {/* Header */}
      <header className="py-4 px-6 md:px-10 flex justify-between items-center neumorphic mb-8 sticky top-4 z-10 mx-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full neumorphic-primary flex items-center justify-center text-white font-bold">
            S
          </div>
          <h1 className="text-2xl font-bold text-primary">Structopia</h1>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#fitur" className="font-medium hover:text-primary transition-colors">
            Fitur
          </Link>
          <Link href="#tentang" className="font-medium hover:text-primary transition-colors">
            Tentang
          </Link>
          <Link href="#kontak" className="font-medium hover:text-primary transition-colors">
            Kontak
          </Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline" className="neumorphic-btn">
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90 text-white neumorphic-primary">Daftar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-12 gap-8 wave-bg">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 rounded-full bg-accent text-accent-foreground font-medium mb-4"
          >
            Platform Pembelajaran Struktur Data #1
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-primary">Belajar</span> Struktur Data Jadi{" "}
            <span className="text-secondary">Menyenangkan</span>
          </motion.h2>
          <motion.p
            className="text-lg mb-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Platform pembelajaran interaktif yang dirancang khusus untuk membantu siswa SMK memahami konsep struktur
            data dengan cara yang menarik dan mudah dipahami.
          </motion.p>
          <motion.div
            className="flex gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/register">
              <Button
                className="bg-primary hover:bg-primary/90 text-white neumorphic-primary text-lg px-8 py-6"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Mulai Belajar
                {isHovered && (
                  <motion.span
                    className="ml-2"
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.span>
                )}
              </Button>
            </Link>
            <Link href="#fitur">
              <Button variant="outline" className="neumorphic-btn text-lg px-8 py-6">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="flex gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-quaternary flex items-center justify-center text-white">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-sm">1000+ Pengguna</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-white">
                <Lightbulb className="h-4 w-4" />
              </div>
              <span className="text-sm">50+ Materi</span>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative w-full max-w-md h-80 neumorphic overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 z-0"></div>
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Structopia Learning Platform"
              fill
              className="object-cover z-10"
            />
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full neumorphic-accent flex items-center justify-center z-20">
              <Code className="h-8 w-8 text-accent-foreground" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="px-6 md:px-10 py-16 pattern-bg">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-secondary text-secondary-foreground font-medium mb-4">
            Fitur Unggulan
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Fitur <span className="text-secondary">Utama</span> Structopia
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Structopia menawarkan berbagai fitur interaktif untuk membantu Anda memahami struktur data dengan lebih baik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <BookOpen className="w-10 h-10 text-white" />,
              title: "Materi Interaktif",
              description: "Materi pembelajaran yang disajikan secara visual, audio, dan kinestetik",
              color: "neumorphic-primary",
            },
            {
              icon: <Award className="w-10 h-10 text-white" />,
              title: "Sistem Badge",
              description: "Dapatkan badge sebagai penghargaan atas pencapaian Anda",
              color: "neumorphic-secondary",
            },
            {
              icon: <BarChart2 className="w-10 h-10 text-white" />,
              title: "Papan Peringkat",
              description: "Bersaing dengan teman-teman Anda untuk mendapatkan XP tertinggi",
              color: "neumorphic-tertiary",
            },
            {
              icon: <Brain className="w-10 h-10 text-white" />,
              title: "Quiz Interaktif",
              description: "Uji pemahaman Anda dengan quiz yang menantang",
              color: "neumorphic-quaternary",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="neumorphic p-6 flex flex-col items-center text-center card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`mb-4 p-4 rounded-full ${feature.color} flex items-center justify-center`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 md:px-10 py-16">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-tertiary text-tertiary-foreground font-medium mb-4">
            Cara Kerja
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Bagaimana <span className="text-tertiary">Structopia</span> Bekerja?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Proses pembelajaran yang sederhana dan efektif untuk memahami struktur data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: "1",
              title: "Pilih Level",
              description: "Mulai dari level dasar dan tingkatkan pemahaman Anda secara bertahap",
              icon: <Zap className="h-6 w-6 text-white" />,
              color: "neumorphic-primary",
            },
            {
              step: "2",
              title: "Pelajari Materi",
              description: "Akses materi pembelajaran dalam berbagai format yang sesuai dengan gaya belajar Anda",
              icon: <BookOpen className="h-6 w-6 text-white" />,
              color: "neumorphic-secondary",
            },
            {
              step: "3",
              title: "Selesaikan Quiz",
              description: "Uji pemahaman Anda dan dapatkan XP untuk membuka level berikutnya",
              icon: <Award className="h-6 w-6 text-white" />,
              color: "neumorphic-tertiary",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="neumorphic p-6 card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <div className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Langkah {item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-10 py-16 bg-gradient-to-b from-accent/10 to-background">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-accent text-accent-foreground font-medium mb-4">
            Testimoni
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Apa Kata <span className="text-accent-foreground">Mereka</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pendapat dari para siswa yang telah menggunakan Structopia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Budi Santoso",
              role: "Siswa SMK Jurusan TKJ",
              quote:
                "Structopia membuat saya memahami struktur data dengan cara yang menyenangkan. Visualisasinya sangat membantu!",
            },
            {
              name: "Siti Nurhaliza",
              role: "Siswa SMK Jurusan RPL",
              quote:
                "Saya suka sistem badge dan papan peringkat. Membuat belajar jadi lebih menantang dan menyenangkan.",
            },
            {
              name: "Ahmad Rizki",
              role: "Guru SMK Informatika",
              quote:
                "Platform yang sangat membantu untuk mengajarkan struktur data kepada siswa. Materi yang disajikan sangat komprehensif.",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="neumorphic p-6 card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.667 13.333H5.33366C5.33366 8 9.33366 5.333 13.3337 5.333L12.0003 8C10.667 9.333 10.667 11.333 10.667 13.333ZM21.3337 13.333H16.0003C16.0003 8 20.0003 5.333 24.0003 5.333L22.667 8C21.3337 9.333 21.3337 11.333 21.3337 13.333ZM24.0003 16V18.667C24.0003 20 23.3337 21.333 22.0003 22C20.667 22.667 19.3337 22.667 18.0003 22L16.0003 25.333C16.0003 26.667 17.3337 28 18.667 28H21.3337C22.667 28 24.0003 26.667 24.0003 25.333V22.667H26.667C28.0003 22.667 29.3337 21.333 29.3337 20V16C29.3337 14.667 28.0003 13.333 26.667 13.333H24.0003C22.667 13.333 21.3337 14.667 21.3337 16H24.0003ZM13.3337 16V18.667C13.3337 20 12.667 21.333 11.3337 22C10.0003 22.667 8.66699 22.667 7.33366 22L5.33366 25.333C5.33366 26.667 6.66699 28 8.00033 28H10.667C12.0003 28 13.3337 26.667 13.3337 25.333V22.667H16.0003C17.3337 22.667 18.667 21.333 18.667 20V16C18.667 14.667 17.3337 13.333 16.0003 13.333H13.3337C12.0003 13.333 10.667 14.667 10.667 16H13.3337Z"
                      fill="#FFE66D"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-6 flex-grow">{testimonial.quote}</p>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-10 py-16 text-center">
        <div className="max-w-3xl mx-auto neumorphic p-10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full -ml-10 -mb-10"></div>

          <div className="relative z-10">
            <div className="inline-block px-4 py-1 rounded-full bg-quaternary text-quaternary-foreground font-medium mb-4">
              Mulai Sekarang
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Siap untuk <span className="text-quaternary">Memulai</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Bergabunglah dengan ribuan siswa yang telah meningkatkan pemahaman mereka tentang struktur data melalui
              Structopia
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-quaternary hover:bg-quaternary/90 text-white neumorphic-quaternary text-lg px-8 py-6">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="neumorphic-btn text-lg px-8 py-6">
                  Masuk ke Akun
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 md:px-10 neumorphic mx-4 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full neumorphic-primary flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-xl font-bold text-primary">Structopia</span>
          </div>
          <nav className="flex gap-6 mb-4 md:mb-0">
            <Link href="#fitur" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Fitur
            </Link>
            <Link href="#tentang" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Tentang
            </Link>
            <Link href="#kontak" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Kontak
            </Link>
          </nav>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Structopia. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
