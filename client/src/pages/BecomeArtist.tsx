import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function BecomeArtist() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
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

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Please Sign In</h2>
          <p className="mb-4 text-muted-foreground">You need to sign in to create an artist profile</p>
          <Button asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  if (existingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">You Already Have an Artist Profile</h2>
          <p className="mb-4 text-muted-foreground">View or manage your profile from the dashboard</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/artist/${existingProfile.id}`}>View Public Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Solely Art
          </Link>
        </div>
      </header>

      <div className="container max-w-2xl py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Become an Artist</h1>
          <p className="text-muted-foreground">
            Create your profile and start connecting with clients
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Artist Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
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
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell clients about yourself and your work..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                  placeholder="50"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Categories *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select all that apply to your work
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories?.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category.id}`}
                        checked={form.categories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <label
                        htmlFor={`cat-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createProfileMutation.isPending}
              >
                {createProfileMutation.isPending ? "Creating Profile..." : "Create Artist Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
