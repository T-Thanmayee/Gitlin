import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    const user = window.sessionStorage.getItem('email');
    const pass = window.sessionStorage.getItem('password');

    if (user === email) {
      if (pass === password) {
        window.location.href = "frame.html";
      } else {
        setError('Incorrect Password');
      }
    } else {
      setError('Incorrect Email');
    }
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
    setShowForgotPassword(true);
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      setError('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password does not match the confirm password.');
      return;
    }

    window.sessionStorage.setItem('password', password);
    window.location.href = "frame.html";
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Image with Caption */}
      <div className="w-1/2 bg-gray-100 dark:bg-gray-800 flex flex-col justify-center items-center p-10">
      <h1 className="text-2xl font-semibold italic text-gray-800 dark:text-white mb-4 text-center font-serif">
  Come find your path — do projects, build profiles, grow together.
</h1>

        <img 
          src="https://img.freepik.com/premium-vector/woman-sitting-with-laptop-concept-illustration-working-studying-education-work-from-home-healthy-lifestyle_186332-153.jpg?w=360" 
          alt="Illustration" 
          className="max-w-full h-auto rounded-lg shadow-md" 
        />
      </div>

      {/* Right Side: Login Card */}
      <div className="w-1/2 flex justify-center items-center bg-gray-50">
        {!showForgotPassword ? (
          <Card className="w-96 p-2">
            <CardHeader>
              <CardTitle className="text-success">Sign In</CardTitle>
              <CardDescription className="text-success">Stay Tuned</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  id="username"
                  value={email}
                  className="rounded-full"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  id="password"
                  value={password}
                  className="rounded-full"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-success "
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-full">
                  Login
                </Button>
                <div className="flex justify-around mt-4">
                  <SocialButton icon="facebook" />
                  <SocialButton icon="google" />
                  <SocialButton icon="linkedin" />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-96 p-2">
            <CardHeader>
              <CardTitle className="text-success">Reset Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <label htmlFor="new-password" className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  id="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Confirm Password
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function SocialButton({ icon }) {
  const getIcon = () => {
    switch (icon) {
      case 'facebook':
        return <i className="fab fa-facebook-f"></i>;
      case 'google':
        return <i className="fab fa-google-plus-g"></i>;
      case 'linkedin':
        return <i className="fab fa-linkedin-in"></i>;
      default:
        return null;
    }
  };

  return (
    <a
      href="#"
      className="border border-gray-300 rounded-full h-10 w-10 flex items-center justify-center transition-transform hover:bg-blue-800 hover:text-white hover:scale-110"
    >
      {getIcon()}
    </a>
  );
}
