import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/become-artist" component={BecomeArtist} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/artist/:id" component={ArtistProfile} />
      <Route path="/book/:id" component={BookArtist} />
      <Route path="/availability" component={AvailabilityDashboard} />
      <Route path="/bookings" component={BookingManagement} />
      <Route path="/messages" component={Messages} />
      <Route path="/portfolio-builder" component={PortfolioBuilder} />
      <Route path="/about" component={About} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
