"use client";
import React from "react";
import {
  Code2,
  Zap,
  Shield,
  Globe,
  Layers,
  Sparkles,
  Lock,
  Users,
  Rocket,
  Database,
  GitBranch,
  Palette,
} from "lucide-react";

function FeaturesShowcase() {
  const features = [
    {
      icon: Code2,
      title: "AI Code Generation",
      description:
        "Describe your app idea and let AI generate production-ready code with best practices",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Generate full-stack applications in minutes, not weeks. Deploy instantly.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Layers,
      title: "Full Stack Included",
      description:
        "Frontend, backend, database schema, and API endpoints - all generated automatically.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Palette,
      title: "Beautiful UI",
      description:
        "Modern, responsive designs with Tailwind CSS and shadcn components built-in.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Database,
      title: "Smart Database Design",
      description:
        "Automatic schema generation, relationships, and optimization for your data.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description:
        "Push your generated projects directly to GitHub repositories instantly.",
      color: "from-slate-600 to-slate-800",
    },
    {
      icon: Shield,
      title: "Security First",
      description:
        "Built-in authentication, password hashing, and security best practices.",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: Users,
      title: "Collaboration Ready",
      description:
        "Share workspaces, manage team members, and collaborate in real-time.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Rocket,
      title: "One-Click Deploy",
      description:
        "Deploy to Vercel, Netlify, or your own servers with a single click.",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: Sparkles,
      title: "Prompt Enhancement",
      description:
        "AI-powered prompt refinement to get better results with smarter suggestions.",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: Lock,
      title: "Version Control",
      description:
        "Track changes, roll back versions, and maintain full project history.",
      color: "from-amber-500 to-yellow-500",
    },
    {
      icon: Globe,
      title: "Multi-Framework Support",
      description:
        "React, Vue, Svelte, Next.js - choose your preferred tech stack.",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Powerful Features for Modern Development
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale web applications
            with AI-powered efficiency
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 overflow-hidden"
              >
                {/* Animated gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`inline-block p-3 rounded-lg mb-4 bg-gradient-to-br ${feature.color}`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-6">
            Ready to transform your development workflow?
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/50">
            Start Building Free
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturesShowcase;
