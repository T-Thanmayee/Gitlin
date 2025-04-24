import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    const user = window.sessionStorage.getItem("email");
    const pass = window.sessionStorage.getItem("password");

    if (user === username) {
      if (pass === password) {
        window.location.href = "frame.html";
      } else {
        setError("Incorrect Password");
      }
    } else {
      setError("Incorrect Email");
    }
  };

  const handleChangePassword = (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      setError("Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    window.sessionStorage.setItem("password", newPassword);
    window.location.href = "frame.html";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        {!isForgotPassword ? (
          <>
            <h4 className="text-2xl font-bold text-green-500 mb-2">Sign In</h4>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  name="username"
                  id="username"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-green-600 mt-2 hover:text-green-800"
              >
                Forgot password?
              </button>
              {error && <ErrorMessage message={error} />}
              <Button type="submit" className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
                Login
              </Button>
              <div className="flex justify-between mt-4 space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  <i className="fab fa-google-plus-g"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </form>
          </>
        ) : (
          <div>
            <h4 className="text-2xl font-bold text-green-500 mb-2">Change Password</h4>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold">New Password</label>
                <Input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              {error && < p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
                Confirm Password
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
