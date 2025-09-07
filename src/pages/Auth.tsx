import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { PasswordStrength } from '@/components/ui/password-strength';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { signIn, user, isModerator } = useAuth();

  if (user && isModerator) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting
    if (attempts >= 5) {
      toast({
        variant: "destructive",
        title: "Too many attempts",
        description: "Please wait before trying again",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setAttempts(prev => prev + 1);
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: error.message === 'Invalid login credentials' 
            ? "Invalid email or password" 
            : "An error occurred during sign in",
        });
      } else {
        setAttempts(0);
      }
    } catch (error) {
      setAttempts(prev => prev + 1);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Medical Admin Portal</h1>
          <p className="text-muted-foreground">Secure access for authorized personnel</p>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Access restricted to administrators and moderators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@medical.com"
                  required
                  className="h-11"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 pr-10"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {password && <PasswordStrength password={password} />}
              </div>
              
              {attempts > 0 && (
                <div className="text-sm text-destructive">
                  Failed attempts: {attempts}/5
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={loading || attempts >= 5}
              >
                {loading ? (
                  <>
                    <Lock className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-3">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={async () => {
                  if (email) {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/auth`
                    });
                    if (!error) {
                      toast({
                        title: "Reset link sent",
                        description: "Check your email for password reset instructions",
                      });
                    } else {
                      toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive"
                      });
                    }
                  } else {
                    toast({
                      title: "Enter email first",
                      description: "Please enter your email address to reset password",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Forgot password?
              </button>
              
              <p className="text-xs text-muted-foreground">
                This is a secure system. All access attempts are logged.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;