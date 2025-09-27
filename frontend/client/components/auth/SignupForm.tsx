import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

/**
 * Signup form component with email/password registration
 * Follows the app's design language with speech-green colors and Bricolage font
 */
export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { signUp, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  /**
   * Validate password requirements
   */
  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  /**
   * Handle form submission for signup
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');
    
    if (!email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await signUp(email, password);
      // Redirect to dashboard after successful signup
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by useAuth hook
      console.error('Signup failed:', error);
    }
  };

  const displayError = validationError || error;

  return (
    <Card className="w-full max-w-md border-speech-green/20 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-bricolage text-2xl font-bold text-speech-green">
          Create Account
        </CardTitle>
        <CardDescription className="font-bricolage text-speech-green/70">
          Sign up to get started with your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayError && (
          <Alert variant="destructive">
            <AlertDescription className="font-bricolage">
              {displayError}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label 
              htmlFor="signup-email" 
              className="font-bricolage text-speech-green font-medium"
            >
              Email Address
            </Label>
            <Input
              id="signup-email"
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
              htmlFor="signup-password" 
              className="font-bricolage text-speech-green font-medium"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password (min. 6 characters)"
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
          
          <div className="space-y-2">
            <Label 
              htmlFor="confirm-password" 
              className="font-bricolage text-speech-green font-medium"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="font-bricolage border-speech-green/30 focus:border-speech-green focus:ring-speech-green/20 pr-10"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? (
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <p className="font-bricolage text-sm text-speech-green/70">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-speech-green hover:underline"
              disabled={loading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}