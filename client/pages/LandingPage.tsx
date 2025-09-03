// pages/LandingPage.tsx
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { History, SunMoon, Languages, Zap, Bug, Save } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 font-bold text-xl text-indigo-600">
            <span>💻</span>
            <span>DevTranslate</span>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <History size={16} /> History
            </Button>
            <Button variant="outline" size="icon">
              <SunMoon size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#76add4] flex flex-col md:flex-row items-center justify-center w-full pt-28 pb-16 px-6">
        {/* Left Text */}
        <div className="max-w-lg bg-white p-8 rounded-2xl shadow-lg md:mr-12 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">DevTranslate</h1>
          <h2 className="text-xl font-semibold mb-2">Convert code between programming languages</h2>
          <p className="text-gray-700 mb-6">
            Easy code translation with AI. Just paste your code, pick a language, and get it converted instantly.
          </p>
          <div className="flex gap-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md">
              Get Started
            </Button>
            <Button variant="outline" className="px-5 py-2 rounded-lg shadow-md">
              View History
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="/hero.png"
            alt="DevTranslate Hero"
            className="max-w-md w-full rounded-xl shadow-2xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-700">Why Use DevTranslate?</h2>
          <p className="text-gray-600 mt-2">Smart AI that converts your code perfectly</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
            <CardContent className="flex flex-col items-center text-center">
              <Languages size={36} className="mb-3" />
              <h3 className="font-bold text-lg mb-2">All Languages</h3>
              <p className="text-sm">Convert between Python, Java, JavaScript, and C#</p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
            <CardContent className="flex flex-col items-center text-center">
              <Zap size={36} className="mb-3" />
              <h3 className="font-bold text-lg mb-2">Super Fast</h3>
              <p className="text-sm">Get code converted in seconds with accurate results</p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
            <CardContent className="flex flex-col items-center text-center">
              <Bug size={36} className="mb-3" />
              <h3 className="font-bold text-lg mb-2">Fixes Errors</h3>
              <p className="text-sm">Automatically find errors and fix codes</p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
            <CardContent className="flex flex-col items-center text-center">
              <Save size={36} className="mb-3" />
              <h3 className="font-bold text-lg mb-2">Save History</h3>
              <p className="text-sm">Keep track of conversions and go back anytime</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
