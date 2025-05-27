"use client"

import React from 'react';
import Link from 'next/link';

export default function SurveyGeneration() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-25 to-blue-25 font-serif" style={{background: 'linear-gradient(135deg, #fef7f7 0%, #f0f9ff 100%)'}}>
      {/* Header */}
      <header className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">✨</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Magic Surveys</h1>
          </Link>
          <div className="text-gray-500 font-medium text-sm">
            Survey Generation
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Survey Generation</h1>
              <p className="text-gray-600 text-lg">
                This is where the magic happens! We&apos;ll generate your perfect survey based on the requirements you provided.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Coming Soon</h2>
              <p className="text-gray-600">
                The survey generation functionality is currently being developed. 
                Your requirements have been saved and will be used to create your custom survey.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Link 
                href="/create"
                className="bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
              >
                ← Back to Requirements
              </Link>
              <Link 
                href="/"
                className="bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 