import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

/**
 * Login form component with email/password authentication
 * Follows the app's design language with speech-green colors and Bricolage font
 */
export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle form submission for login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!email || !password) {
      return;
    }

    try {
      await signIn(email, password);
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by useAuth hook
      console.error('Login failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md border-speech-green/20 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-bricolage text-2xl font-bold text-speech-green">
          Welcome Back
        </CardTitle>
        <CardDescription className="font-bricolage text-speech-green/70">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="font-bricolage">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className="font-bricolage text-speech-green font-medium"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-bricolage border-speech-green/30 focus:border-speech-green focus:ring-speech-green/20"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor="password" 
              className="font-bricolage text-speech-green font-medium"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-bricolage border-speech-green/30 focus:border-speech-green focus:ring-speech-green/20 pr-10"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-speech-green/60" />
                ) : (
                  <Eye className="h-4 w-4 text-speech-green/60" />
                )}
              </Button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full font-bricolage bg-speech-green hover:bg-speech-green/90 text-white font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <p className="font-bricolage text-sm text-speech-green/70">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="font-medium text-speech-green hover:underline"
              disabled={loading}
            >
              Sign up here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}