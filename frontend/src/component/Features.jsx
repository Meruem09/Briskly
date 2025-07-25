// src/components/FeaturePage.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const features = [
  {
    title: "Personalized Learning",
    description: "Briskly adapts to your learning style and pace for maximum results.",
    icon: "🎯",
  },
  {
    title: "All Content in One Place",
    description: "Easily access all your study material including PDFs and text files in a single content hub.",
    icon: "📚",
  },
  {
    title: "Key Points Extraction",
    description: "Get key points from any uploaded file to focus on what really matters.",
    icon: "🔑",
  },
  {
    title: "Quiz Generator",
    description: "Generate quizzes from your files to test and reinforce your knowledge instantly.",
    icon: "❓",
  },
  {
    title: "Smart Notes",
    description: "Take important notes as you learn and keep them organized.",
    icon: "📝",
  },
  {
    title: "One-Click Notion Access",
    description: "Open your Notion files directly with a single click—no more switching tabs.",
    icon: "⚡",
  },
  {
    title: "Super Modern Design",
    description: "Briskly boasts a sleek, vibrant UI that makes last-minute learning feel exciting and fun.",
    icon: "✨",
  },
];

export default function FeaturePage() {
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">Briskly</h1>
        <p className="text-xl text-white">Your Last Minute Learning App</p>
        <p className="text-md text-white mt-2">
          An AI-driven app that adapts to your needs and helps you master topics quickly.
        </p>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-lg text-white hover:scale-105 transition-transform"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
