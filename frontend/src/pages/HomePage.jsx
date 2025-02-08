import React, { useEffect, useState } from 'react';
import { ChevronRight, HelpCircle, Users, Zap, Shield, Check } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';  
const backend_url = "https://help-desk-bfld.onrender.com";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    // Check if the user is logged in by checking localStorage for role
    const role = localStorage.getItem('role');
    if (role) {
      setIsLoggedIn(true);
    }
  }, []);

  // Navigate to login or signup page
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSignupRedirect = () => {
    navigate('/register');
  };

  // Handle logout and redirect to home page
  const handleLogout = async () => {
    try {
      const response = await fetch(`${backend_url}/logout`, {
        method: 'GET',
        credentials: 'include', 
      });

      if (response.ok) {
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate('/');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <HelpCircle className="text-blue-600 mr-2" size={32} />
            <span className="text-2xl font-bold text-blue-600">HelpDesk Pro</span>
          </div>
          <div className="space-x-6">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>

            {/* Conditionally render "Dashboard" and logout button based on login status */}
            {isLoggedIn ? (
              <div className="inline-flex space-x-4">
                <a href="/dashboard" className="hover:text-blue-600 transition">Dashboard</a>
                <button 
                  onClick={handleLogout}
                  className=" text-gray-800 px-4  rounded-md hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="inline-flex space-x-4">
                <button 
                  onClick={handleLoginRedirect}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  Login
                </button>
                <button 
                  onClick={handleSignupRedirect}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-16 container mx-auto px-4 text-center">
        <div data-aos="fade-up">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Streamline Your Customer Support <br />with HelpDesk Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Effortlessly manage customer tickets, track resolutions, and provide exceptional support with our intuitive platform.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center">
              Get Started <ChevronRight className="ml-2" />
            </button>
            <button className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
              Watch Demo
            </button>
          </div>
        </div>
      </header>
       {/* Ticket Lifecycle Roadmap */}
      <section id="how-it-works" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How HelpDesk Works</h2>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 bg-blue-200 h-full absolute"></div>
            </div>
            <div className="relative grid md:grid-cols-3 gap-8">
              {[ 
                { icon: <Users size={48} className="text-blue-600" />, title: 'Create Ticket', description: 'Customers easily submit support requests' },
                { icon: <Zap size={48} className="text-green-600" />, title: 'Agent Review', description: 'Support team analyzes and responds quickly' },
                { icon: <Check size={48} className="text-purple-600" />, title: 'Resolution', description: 'Ticket resolved and customer satisfied' }
              ].map((step, index) => (
                <div 
                  key={step.title} 
                  data-aos="fade-up" 
                  data-aos-delay={index * 200}
                  className="bg-white p-6 rounded-lg shadow-md flex items-center z-10 relative"
                >
                  <div className="mr-6">{step.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[ 
              { icon: <Shield size={48} className="text-blue-600" />, title: 'Secure', description: 'safe and data protection' },
              { icon: <HelpCircle size={48} className="text-green-600" />, title: 'Intuitive', description: 'User-friendly interface for quick ticket management' },
              { icon: <Zap size={48} className="text-purple-600" />, title: 'Efficient', description: 'Automated workflows and smart routing' }
            ].map((feature, index) => (
              <div 
                key={feature.title} 
                data-aos="zoom-in" 
                data-aos-delay={index * 200}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div 
          data-aos="fade-up"
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Support?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of businesses improving their customer support with HelpDesk Pro
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <HelpCircle className="text-blue-400 mr-2" size={32} />
              <span className="text-xl font-bold">HelpDesk Pro</span>
            </div>
            <p className="text-gray-400">Simplifying customer support for businesses worldwide</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
