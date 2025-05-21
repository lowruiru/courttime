
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-tennis-yellow">
            <span className="text-black font-bold text-lg">T</span>
          </div>
          <span className="text-lg font-bold text-tennis-green">TennisPro</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-tennis-green transition-colors">Find Instructors</Link>
          <Link to="/" className="hover:text-tennis-green transition-colors">How It Works</Link>
          <Link to="/" className="hover:text-tennis-green transition-colors">For Coaches</Link>
          <Button variant="outline" className="border-tennis-green text-tennis-green hover:bg-tennis-green hover:text-white">
            Sign Up
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 animate-fade-in">
          <div className="container mx-auto px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 hover:text-tennis-green transition-colors">Find Instructors</Link>
            <Link to="/" className="block py-2 hover:text-tennis-green transition-colors">How It Works</Link>
            <Link to="/" className="block py-2 hover:text-tennis-green transition-colors">For Coaches</Link>
            <Button className="w-full mt-2 btn-tennis-primary">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
