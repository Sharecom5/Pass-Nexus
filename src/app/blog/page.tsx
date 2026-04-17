import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Tag } from "lucide-react";
import { blogs } from "@/lib/blogs";

export const metadata = {
  title: "Blog | PassNexus",
  description: "Read the latest guides, tutorials, and best practices on modern event management and digital passes.",
};

const categoryColors: Record<string, string> = {
  "Getting Started": "bg-blue-50 text-blue-700 border-blue-100",
  "Design Tips": "bg-purple-50 text-purple-700 border-purple-100",
  "Event Operations": "bg-green-50 text-green-700 border-green-100",
  "Buying Guides": "bg-amber-50 text-amber-700 border-amber-100",
  "Best Practices": "bg-rose-50 text-rose-700 border-rose-100",
  "Email Marketing": "bg-teal-50 text-teal-700 border-teal-100",
  "Compliance": "bg-slate-50 text-slate-700 border-slate-200",
  "Event Planning": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Event Growth": "bg-orange-50 text-orange-700 border-orange-100",
};

export default function BlogListingPage() {
  const [featured, ...rest] = blogs;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon.png" alt="PassNexus" className="w-7 h-7 object-contain" />
            <span className="font-black text-slate-900 text-base tracking-tight">Pass<span className="text-blue-600">Nexus</span></span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-semibold text-sm">Blog</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="inline-block text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">PassNexus Blog</span>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Insights for Event Organizers</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Guides, tutorials, and best practices to help you run flawless events with digital passes.</p>
        </div>

        {/* Featured Post */}
        <Link href={`/blog/${featured.slug}`} className="group block bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-blue-300 hover:shadow-2xl transition-all duration-300 mb-12">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex items-center justify-center min-h-[260px]">
              <BookOpen className="w-20 h-20 text-white/20" />
            </div>
            <div className="flex-1 p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest border px-2.5 py-1 rounded-full ${categoryColors[featured.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {featured.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{featured.title}</h2>
                <p className="text-slate-500 leading-relaxed">{featured.excerpt}</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-400">{new Date(featured.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform inline-block">Read article →</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Rest of Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`}
              className="bg-white border border-slate-200 rounded-3xl p-7 hover:border-blue-300 hover:shadow-xl transition-all group duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest border px-2.5 py-1 rounded-full ${categoryColors[blog.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {blog.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug">{blog.title}</h2>
                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">{blog.excerpt}</p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{new Date(blog.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform inline-block">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
