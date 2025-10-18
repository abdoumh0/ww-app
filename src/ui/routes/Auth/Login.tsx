import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/SessionContext";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshSession } = useSession();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("http://localhost:3000/api/app/auth/login", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      const { success, message } = (await res.json()) as {
        success: boolean;
        message?: string;
      };
      if (!success) {
        toast(message);
      } else {
        refreshSession();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast("error; check dev console");
    }

    setIsLoading(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          name="email"
          placeholder="your@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => console.log("Forgot password clicked")}
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button disabled={isLoading} className="w-full">
        {!isLoading ? (
          "Sign In"
        ) : (
          <LoaderCircle className="animate-spin h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
