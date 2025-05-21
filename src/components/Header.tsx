
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-tennis-yellow">
            <span className="text-black font-bold text-xs">T</span>
          </div>
          <span className="text-sm font-bold text-tennis-green">Court Time</span>
        </Link>
        
<Link to="/instructor-signup">
  <Button
    variant="outline"
    size="sm"
    className="border-tennis-green text-tennis-green hover:bg-tennis-green hover:text-white text-xs h-7"
  >
    Sign Up for Tennis Instructors
  </Button>
</Link>
      </div>
    </header>
  );
};

export default Header;
