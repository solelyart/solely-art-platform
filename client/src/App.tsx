import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import BecomeArtist from "./pages/BecomeArtist";
import Dashboard from "./pages/Dashboard";
import ArtistProfile from "./pages/ArtistProfile";
import BookArtist from "./pages/BookArtist";
import { AvailabilityDashboard } from "./pages/AvailabilityDashboard";
import { BookingManagement } from "./pages/BookingManagement";
import Messages from "./pages/Messages";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";

// Wrapper components for pages that need specific layout options
function HomeWithLayout() {
  // Home has its own hero section, use hideFooter since it has custom footer
  return (
    <Layout hideFooter>
      <Home />
    </Layout>
  );
}

function BrowseWithLayout() {
  return (
    <Layout>
      <Browse />
    </Layout>
  );
}

function BecomeArtistWithLayout() {
  return (
    <Layout minimalFooter hideNewsletter>
      <BecomeArtist />
    </Layout>
  );
}

function DashboardWithLayout() {
  return (
    <Layout hideNewsletter>
      <Dashboard />
    </Layout>
  );
}

function ArtistProfileWithLayout() {
  return (
    <Layout>
      <ArtistProfile />
    </Layout>
  );
}

function BookArtistWithLayout() {
  return (
    <Layout minimalFooter hideNewsletter>
      <BookArtist />
    </Layout>
  );
}

function AvailabilityWithLayout() {
  return (
    <Layout hideNewsletter>
      <AvailabilityDashboard />
    </Layout>
  );
}

function BookingManagementWithLayout() {
  return (
    <Layout hideNewsletter>
      <BookingManagement />
    </Layout>
  );
}

function MessagesWithLayout() {
  return (
    <Layout hideFooter>
      <Messages />
    </Layout>
  );
}

function PortfolioBuilderWithLayout() {
  return (
    <Layout hideNewsletter>
      <PortfolioBuilder />
    </Layout>
  );
}

function AboutWithLayout() {
  return (
    <Layout>
      <About />
    </Layout>
  );
}

function TermsWithLayout() {
  return (
    <Layout minimalFooter>
      <Terms />
    </Layout>
  );
}

function PrivacyWithLayout() {
  return (
    <Layout minimalFooter>
      <Privacy />
    </Layout>
  );
}

function ContactWithLayout() {
  return (
    <Layout>
      <Contact />
    </Layout>
  );
}

function NotFoundWithLayout() {
  return (
    <Layout minimalFooter>
      <NotFound />
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeWithLayout} />
      <Route path="/browse" component={BrowseWithLayout} />
      <Route path="/become-artist" component={BecomeArtistWithLayout} />
      <Route path="/dashboard" component={DashboardWithLayout} />
      <Route path="/artist/:id" component={ArtistProfileWithLayout} />
      <Route path="/book/:id" component={BookArtistWithLayout} />
      <Route path="/availability" component={AvailabilityWithLayout} />
      <Route path="/bookings" component={BookingManagementWithLayout} />
      <Route path="/messages" component={MessagesWithLayout} />
      <Route path="/portfolio-builder" component={PortfolioBuilderWithLayout} />
      <Route path="/about" component={AboutWithLayout} />
      <Route path="/terms" component={TermsWithLayout} />
      <Route path="/privacy" component={PrivacyWithLayout} />
      <Route path="/contact" component={ContactWithLayout} />
      <Route path="/404" component={NotFoundWithLayout} />
      <Route component={NotFoundWithLayout} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable={true}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
