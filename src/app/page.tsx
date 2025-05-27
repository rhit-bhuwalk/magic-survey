"use client"

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hasText, setHasText] = useState(false);
  const [userGoal, setUserGoal] = useState("");
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-25 to-blue-25 font-sans" style={{background: 'linear-gradient(135deg, #fef7f7 0%, #f0f9ff 100%)'}}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-300 to-purple-300 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">✨</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Magic Surveys</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/pricing" className="text-gray-500 hover:text-pink-400 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/login" className="bg-rose-300 hover:bg-rose-400 text-white px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 font-medium">
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-6xl md:text-7xl font-bold text-gray-700 mb-8 leading-tight">
            Create <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Magical Surveys</span> 
            <br />in Minutes ✨
          </h2>
          <p className="text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            Build delightful surveys that people actually want to fill out. 
          </p>
          
          {/* Enhanced Text Box */}
          <div className="max-w-2xl mx-auto mb-12">
            <label htmlFor="survey-question" className="block text-2xl font-light text-gray-600 mb-8 mt-15 font-serif">
              What would you like to discover?
            </label>
            <div className="relative">
              <textarea
                id="survey-question"
                placeholder="I want to know what my users think about my product"
                rows={3}
                value={userGoal}
                className="w-full px-8 py-6 text-xl border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-300 text-gray-700 placeholder-gray-400 bg-white shadow-lg hover:shadow-xl transition-all resize-y min-h-[100px]"
                onChange={(e) => {
                  const value = e.target.value;
                  setUserGoal(value);
                  setHasText(value.trim().length > 0);
                }}
              />
              <div className="absolute right-4 top-6 text-2xl">
                💭
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-20">
            <Link 
              href={`/create${userGoal ? `?goal=${encodeURIComponent(userGoal)}` : ''}`} 
              className={`${hasText ? 'bg-rose-400' : 'bg-rose-300'} hover:bg-rose-400 text-white px-12 py-5 rounded-full text-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform`}
            >
              Start Creating Magic →
            </Link>
          </div>


        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-pink-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">✨</span>
            </div>
            <span className="text-gray-500 font-medium text-lg">Magic Surveys</span>
          </div>
          <div className="flex items-center space-x-8 text-gray-400">
            <Link href="/privacy" className="hover:text-pink-400 transition-colors font-medium">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-pink-400 transition-colors font-medium">
              Terms
            </Link>
            <Link href="/support" className="hover:text-pink-400 transition-colors font-medium">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
