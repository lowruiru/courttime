
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-tennis-yellow">
            <span className="text-black font-bold text-sm">T</span>
          </div>
          <span className="text-base font-bold text-tennis-green">TennisPro</span>
        </Link>
        
        <Button variant="outline" size="sm" className="border-tennis-green text-tennis-green hover:bg-tennis-green hover:text-white">
          Sign Up for Tennis Instructors
        </Button>
      </div>
    </header>
  );
};

export default Header;
