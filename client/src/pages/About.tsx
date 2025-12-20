import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Heart, Users, Award, Globe, Sparkles, Shield } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const { isAuthenticated } = useAuth();

  const values = [
    {
      icon: Heart,
      title: "Passion for Art",
      description: "We believe in the transformative power of art and its ability to connect people across cultures and experiences."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our platform is built on relationships—between artists and clients, creativity and commerce, vision and reality."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We curate only the finest talent, ensuring every artist on our platform meets our rigorous standards of quality."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Art knows no boundaries. We connect creative professionals with clients worldwide, fostering a global creative community."
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "We continuously evolve our platform to provide cutting-edge tools that empower artists and delight clients."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Every transaction is protected, every artist is verified, and every client's vision is respected and safeguarded."
    }
  ];

  const stats = [
    { value: "1,000+", label: "Curated Artists" },
    { value: "50+", label: "Art Categories" },
    { value: "10,000+", label: "Completed Commissions" },
    { value: "98%", label: "Client Satisfaction" }
  ];

  const team = [
    {
      name: "Kristen Blanks",
      role: "Founder & CEO",
      bio: "Visionary entrepreneur with a passion for connecting exceptional artists with discerning clients worldwide."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/brand/logo-circle-text.svg" 
              alt="Solely Art" 
              className="h-16 w-auto transition-transform group-hover:scale-105" 
            />
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Browse Artists
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Dashboard
              </Link>
            ) : (
              <Button asChild className="btn-cta">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section with Diamond Logo */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <img 
              src="/brand/logo-diamond-full.svg" 
              alt="Solely Art - Curated Connections" 
              className="h-40 w-auto mx-auto mb-8"
            />
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto">
              Solely Art was born from a simple belief: that exceptional art deserves exceptional connections. 
              We bridge the gap between visionary artists and discerning clients, creating a curated marketplace 
              where creativity flourishes and meaningful collaborations begin.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                We're on a mission to transform how the world discovers and commissions art. By creating 
                a platform that values quality over quantity, we ensure that every artist showcased meets 
                our exacting standards of excellence.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                For clients, this means access to a carefully curated selection of creative professionals 
                who can bring any vision to life. For artists, it means a supportive community and the 
                tools needed to build a thriving creative practice.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                <img 
                  src="/brand/logo-diamond-icon.svg" 
                  alt="Solely Art" 
                  className="h-48 w-auto opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-foreground/60 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Our Values</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              These principles guide everything we do, from how we curate our artists to how we serve our clients.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-elegant hover-lift">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Meet the passionate individuals driving our mission to connect artists with the world.
            </p>
          </div>
          <div className="flex justify-center">
            {team.map((member, index) => (
              <div key={index} className="text-center max-w-md">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl font-serif font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary font-medium text-lg mb-4">{member.role}</p>
                <p className="text-foreground/60 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Join Our Creative Community
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Whether you're an artist looking to showcase your work or a client seeking exceptional talent, 
              Solely Art is your gateway to meaningful creative connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-cta">
                <Link href="/become-artist">Apply as Artist</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/30 hover:bg-primary/5">
                <Link href="/browse">Explore Artists</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <img 
              src="/brand/logo-circle-full.svg" 
              alt="Solely Art - Curated Connections" 
              className="h-16 w-auto" 
            />
            <p className="text-sm text-foreground/60">
              © 2025 Solely Art™. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
