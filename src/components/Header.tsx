
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast({
        title: "Information required",
        description: "Please provide both name and email.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you for signing up!",
      description: "We will contact you soon with more information.",
    });

    setName("");
    setEmail("");
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-tennis-yellow">
            <span className="text-black font-bold text-xs">T</span>
          </div>
          <span className="text-sm font-bold text-tennis-green">Court Time</span>
        </Link>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-tennis-green text-tennis-green hover:bg-tennis-green hover:text-white text-xs h-7 z-50"
            >
              List your classes with us
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>List your classes with us</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Join our platform and start teaching tennis. We'll help you connect with students in your area.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor-name">Full Name</Label>
                  <Input
                    id="instructor-name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor-email">Email</Label>
                  <Input
                    id="instructor-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    Sign Up
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;
