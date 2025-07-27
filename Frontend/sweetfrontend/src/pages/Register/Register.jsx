import {useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';


const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
    setPasswordStrength(Math.min(strength, 100));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return '#ff4757';
    if (passwordStrength < 60) return '#ffa726';
    if (passwordStrength < 80) return '#26c6da';
    return '#66bb6a';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (response.status === 201 || response.status === 200) {
      alert("Registration successful!");
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      alert("Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert(error.response?.data?.message || "An error occurred during registration.");
  } finally {
    setIsLoading(false);
  }
};


  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      <button className="back-button" onClick={handleBackToHome}>
        ← Back
      </button>

      <div className="register-card">
        <div className="logo-section">
          <div className="logo">🍭</div>
          <h1 className="welcome-title">Join Sweet Shop</h1>
          <p className="welcome-subtitle">Create your account to get started</p>
        </div>

        <div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Create a strong password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {form.password && (
              <div className="password-strength">
                <div className="password-strength-bar">
                  <div className="password-strength-fill"></div>
                </div>
                <div className="password-strength-text">
                  Password strength: {getPasswordStrengthText()}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-input"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="terms-text">
            By creating an account, you agree to our{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/terms"); }}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }}>
              Privacy Policy
            </a>
          </div>

          <button
            type="button"
            className="register-button"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading && <div className="loading-spinner"></div>}
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        <div className="divider">or</div>

        <div className="login-link">
          Already have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
            Sign in here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;