
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotifyMeDialogProps {
  instructorName: string;
  timeSlot: string;
  date: string;
}

const NotifyMeDialog = ({ instructorName, timeSlot, date }: NotifyMeDialogProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      toast({
        title: "Contact information required",
        description: "Please provide either an email or phone number.",
        variant: "destructive",
      });
      return;
    }

    // Simulate notification registration
    toast({
      title: "Notification registered!",
      description: `We'll notify you when ${instructorName}'s ${timeSlot} slot on ${date} becomes available.`,
    });

    setEmail("");
    setPhone("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gray-400 hover:bg-gray-500 py-1 px-3 h-auto text-xs"
        >
          <Bell className="mr-1 h-3 w-3" />
          Notify me
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get notified when this class is available</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share your contact with us. We will notify you when this class is available.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+65 9123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">
                Notify Me
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotifyMeDialog;
