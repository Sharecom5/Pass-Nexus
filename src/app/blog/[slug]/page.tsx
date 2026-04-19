import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, ChevronRight } from "lucide-react";
import { blogs } from "@/lib/blogs";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find(b => b.slug === slug);
  if (!blog) return { title: "Not Found" };
  return {
    title: `${blog.title} | PassNexus Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
    }
  };
}

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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find(b => b.slug === slug);
  if (!blog) notFound();

  const relatedPosts = blogs.filter(b => b.slug !== blog.slug && b.category === blog.category).slice(0, 2);
  const otherPosts = relatedPosts.length < 2 
    ? [...relatedPosts, ...blogs.filter(b => b.slug !== blog.slug && !relatedPosts.find(r => r.slug === b.slug)).slice(0, 2 - relatedPosts.length)]
    : relatedPosts;

  const renderContent = (text: string) => {
    return text.trim().split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) return (
        <h1 key={i} className="text-4xl font-black text-slate-900 mt-10 mb-5 leading-tight">{trimmed.replace('# ', '')}</h1>
      );
      if (trimmed.startsWith('## ')) return (
        <h2 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-4 pb-2 border-b border-slate-100">{trimmed.replace('## ', '')}</h2>
      );
      if (trimmed.startsWith('- [ ] ')) return (
        <div key={i} className="flex items-start gap-3 mb-2 ml-4">
          <div className="w-4 h-4 mt-1 border-2 border-slate-300 rounded flex-shrink-0" />
          <p className="text-slate-600" dangerouslySetInnerHTML={{__html: trimmed.replace('- [ ] ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">$1</code>')}} />
        </div>
      );
      if (trimmed.match(/^\d+\.\s\*\*/)) return (
        <div key={i} className="flex items-start gap-3 mb-3 ml-2">
          <span className="w-7 h-7 bg-blue-600 text-white rounded-full text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
            {trimmed.match(/^(\d+)\./)?.[1]}
          </span>
          <p className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{__html: trimmed.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">$1</code>')}} />
        </div>
      );
      if (trimmed.startsWith('- ')) return (
        <li key={i} className="text-slate-700 mb-2 ml-6 list-disc leading-relaxed"
          dangerouslySetInnerHTML={{__html: trimmed.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">$1</code>')}} />
      );
      if (trimmed === '') return <div key={i} className="h-2" />;
      return (
        <p key={i} className="text-slate-700 mb-4 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{__html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">$1</code>')}} />
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-500 hover:text-blue-600 transition-colors">
            <img src="/passnexus_logo.png" alt="PassNexus" className="w-6 h-6 object-contain" />
            PassNexus
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/blog" className="text-slate-500 hover:text-blue-600 font-medium transition-colors">Blog</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-800 font-bold truncate max-w-xs">{blog.title}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col lg:flex-row gap-14">
          {/* Article */}
          <article className="flex-1 min-w-0">
            {/* Header */}
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-[10px] font-black uppercase tracking-widest border px-2.5 py-1 rounded-full ${categoryColors[blog.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {blog.category}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />{blog.readTime}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">{blog.title}</h1>
              <p className="text-xl text-slate-500 leading-relaxed mb-6">{blog.excerpt}</p>
              <div className="flex items-center gap-4 pt-5 border-t border-slate-200">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{blog.author}</p>
                  <p className="text-slate-400 text-xs">{new Date(blog.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12 prose-custom">
              {renderContent(blog.content)}
            </div>

            {/* CTA */}
            <div className="mt-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-10 text-center">
              <h3 className="text-2xl font-black mb-3">Ready to manage your event smarter?</h3>
              <p className="text-blue-100 mb-6">Create your first event for free — no credit card required.</p>
              <Link href="/admin/signup" className="inline-block bg-white text-blue-700 font-black px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                Start Free on PassNexus →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
              <h3 className="font-black text-slate-900 mb-5 text-sm uppercase tracking-widest">Related Articles</h3>
              <div className="space-y-5">
                {otherPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <span className={`text-[9px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-full ${categoryColors[post.category] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {post.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-2 group-hover:text-blue-600 transition-colors leading-snug">{post.title}</h4>
                    <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{post.readTime}
                    </p>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="mt-6 block text-center text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors border-t border-slate-100 pt-5">
                View all articles →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
