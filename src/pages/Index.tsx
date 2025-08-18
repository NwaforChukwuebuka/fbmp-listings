import { useState } from "react";
import { ListingForm } from "@/components/ListingForm";
import { ListingsList } from "@/components/ListingsList";
import { Facebook } from "lucide-react";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleListingAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-8 pb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Facebook className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">FBMP Listings</h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto px-4">
            Organize and manage your Facebook Marketplace listings in one beautiful place
          </p>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 space-y-16">
          {/* Form Section */}
          <section className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl max-w-4xl mx-auto">
              <ListingForm onListingAdded={handleListingAdded} />
            </div>
          </section>

          {/* Listings Section */}
          <section className="relative">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl max-w-6xl mx-auto">
              <ListingsList refreshTrigger={refreshTrigger} />
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="pt-16 pb-8 text-center">
          <p className="text-white/60">Built with ❤️ for marketplace enthusiasts</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
