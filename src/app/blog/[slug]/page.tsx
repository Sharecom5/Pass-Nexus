import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { blogs } from "@/lib/blogs";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = blogs.find(b => b.slug === params.slug);
  if (!blog) return { title: "Not Found" };
  return {
    title: `${blog.title} | PassNexus`,
    description: blog.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = blogs.find(b => b.slug === params.slug);
  if (!blog) notFound();

  // Basic markdown-like parser since we're keeping it zero-dependency
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-slate-900 mt-8 mb-4">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-4">{line.replace('## ', '')}</h2>;
      if (line.match(/^\d+\.\s/)) return <p key={i} className="ml-6 mb-4 list-item" dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}}></p>;
      if (line.trim() === '') return <br key={i}/>;
      return <p key={i} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}}></p>;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12">
      <article className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-slate-100">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-10 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <header className="mb-10 border-b border-slate-100 pb-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">{blog.title}</h1>
          <div className="flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <span>{new Date(blog.date).toLocaleDateString()}</span>
            <span>•</span>
            <span className="text-blue-600">{blog.author}</span>
          </div>
        </header>
        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          {renderContent(blog.content)}
        </div>
      </article>
    </div>
  );
}
