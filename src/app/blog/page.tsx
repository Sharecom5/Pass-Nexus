import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { blogs } from "@/lib/blogs";

export const metadata = {
  title: "Blog | PassNexus",
  description: "Read the latest guides and tutorials on mastering event management and digital passes.",
};

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">PassNexus Blog</h1>
          <p className="text-lg text-slate-500">Insights, tutorials, and strategy for modern event organizers.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {blogs.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-xl transition-all group duration-300 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-4 block"><BookOpen className="w-4 h-4 inline mr-2"/>Tutorial</span>
                <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{blog.title}</h2>
                <p className="text-slate-500 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
              </div>
              <div className="mt-8 flex items-center justify-between text-sm font-semibold text-slate-400">
                <span>{new Date(blog.date).toLocaleDateString()}</span>
                <span>{blog.author}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
