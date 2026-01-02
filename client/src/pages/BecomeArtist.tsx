import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { ThemeSelector } from "@/components/ThemeToggle";
import { HeaderLogo } from "@/components/ResponsiveLogo";
import { ArrowLeft, ArrowRight, Check, Palette, User, Settings } from "lucide-react";

type SetupStep = "theme" | "profile" | "categories";

export default function BecomeArtist() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<SetupStep>("theme");
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    location: "",
    hourlyRate: "",
    categories: [] as number[],
  });

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: existingProfile } = trpc.artists.getMyProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createProfileMutation = trpc.artists.create.useMutation({
    onSuccess: () => {
      toast.success("Artist profile created successfully!");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (form.categories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    createProfileMutation.mutate({
      displayName: form.displayName,
      bio: form.bio || undefined,
      location: form.location || undefined,
      hourlyRate: form.hourlyRate ? parseInt(form.hourlyRate) * 100 : undefined,
      categories: form.categories,
    });
  };

  const toggleCategory = (categoryId: number) => {
    setForm({
      ...form,
      categories: form.categories.includes(categoryId)
        ? form.categories.filter(id => id !== categoryId)
        : [...form.categories, categoryId],
    });
  };

  const steps: { id: SetupStep; title: string; icon: React.ReactNode }[] = [
    { id: "theme", title: "Appearance", icon: <Settings className="h-4 w-4" /> },
    { id: "profile", title: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "categories", title: "Categories", icon: <Palette className="h-4 w-4" /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const goToNextStep = () => {
    if (currentStep === "theme") setCurrentStep("profile");
    else if (currentStep === "profile") {
      if (!form.displayName.trim()) {
        toast.error("Please enter a display name");
        return;
      }
      setCurrentStep("categories");
    }
  };

  const goToPrevStep = () => {
    if (currentStep === "profile") setCurrentStep("theme");
    else if (currentStep === "categories") setCurrentStep("profile");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mb-8">
            <HeaderLogo className="mx-auto" />
          </div>
          <h2 className="mb-4 text-2xl font-medium">Please Sign In</h2>
          <p className="mb-6 text-muted-foreground">You need to sign in to create an artist profile</p>
          <Button variant="brand" size="lg" asChild>
            <a href={getLoginUrl()}>Sign In to Continue</a>
          </Button>
        </div>
      </div>
    );
  }

  if (existingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mb-8">
            <HeaderLogo className="mx-auto" />
          </div>
          <h2 className="mb-4 text-2xl font-medium">You Already Have an Artist Profile</h2>
          <p className="mb-6 text-muted-foreground">View or manage your profile from the dashboard</p>
          <div className="flex gap-4 justify-center">
            <Button variant="brand" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="brand-outline" asChild>
              <Link href={`/artist/${existingProfile.id}`}>View Public Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <HeaderLogo />
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="container max-w-3xl py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (index < currentStepIndex) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : index < currentStepIndex
                      ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                  disabled={index > currentStepIndex}
                >
                  {index < currentStepIndex ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                  <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    index < currentStepIndex ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-border/50 shadow-elegant">
          {/* Step 1: Theme Selection */}
          {currentStep === "theme" && (
            <>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl">Choose Your Theme</CardTitle>
                <CardDescription className="text-base">
                  Select your preferred appearance for the SolelyArt platform
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ThemeSelector className="mb-8" />
                
                <div className="flex justify-end">
                  <Button variant="brand" onClick={goToNextStep} className="gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Profile Information */}
          {currentStep === "profile" && (
            <>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl">Create Your Profile</CardTitle>
                <CardDescription className="text-base">
                  Tell us about yourself and your artistic work
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      data-testid="artist-display-name-input"
                      value={form.displayName}
                      onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                      placeholder="Your artist name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      data-testid="artist-bio-input"
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Tell clients about yourself and your work..."
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        data-testid="artist-location-input"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="City, State"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                      <Input
                        id="hourlyRate"
                        data-testid="artist-hourly-rate-input"
                        type="number"
                        value={form.hourlyRate}
                        onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                        placeholder="50"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={goToPrevStep} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button variant="brand" onClick={goToNextStep} className="gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Categories */}
          {currentStep === "categories" && (
            <>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl">Select Your Categories</CardTitle>
                <CardDescription className="text-base">
                  Choose the categories that best describe your artistic work
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} data-testid="artist-profile-form">
                  <div className="grid gap-4 sm:grid-cols-2 mb-8">
                    {categories?.map((category) => (
                      <label
                        key={category.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          form.categories.includes(category.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          id={`cat-${category.id}`}
                          data-testid="category-checkbox"
                          checked={form.categories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <div>
                          <span className="font-medium">{category.name}</span>
                          {category.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={goToPrevStep} className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="brand"
                      data-testid="create-profile-button"
                      disabled={createProfileMutation.isPending || form.categories.length === 0}
                      className="gap-2"
                    >
                      {createProfileMutation.isPending ? (
                        "Creating Profile..."
                      ) : (
                        <>
                          Create Profile
                          <Check className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
