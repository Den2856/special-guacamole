import { Leaf } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = () => {

    console.log("Subscribed with email:", email);
  };

  return (
    <footer className="bg-[#0f1d14] text-white py-12 px-6">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Логотип и описание */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="group flex items-center gap-2 rounded-xl px-2 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-emerald-600/90 text-white shadow-md shadow-emerald-900/30">
                <Leaf className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <span className="block text-sm tracking-wide text-emerald-200">
                  Planto
                </span>
                <span className="block -mt-0.5 text-[10px] text-emerald-400/80">
                  . since 2022
                </span>
              </div>
            </Link>
          </div>
          <p className="text-sm">
             At Planto, we believe in the power of nature to enhance your living spaces. Our plants are carefully selected to help bring life and freshness to your home or office. Join us in embracing a greener, healthier lifestyle!
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TW</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LI</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Link's</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#hero">Home</a></li>
            <li><Link to="/types-of-plants">Types of plant's</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
          </ul>
        </div>

        {/* Subscribe section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">For Every Update</h3>
          <div className="flex items-center">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter Email"
              className="w-full p-2 rounded-l-lg text-black"
            />
            <button
              onClick={handleSubscribe}
              className="bg-background text-white px-4 py-2 rounded-r-lg"
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-sm">
        <p>© planto {new Date().getFullYear()} Planto all right reserve</p>
      </div>
    </footer>
  );
}
