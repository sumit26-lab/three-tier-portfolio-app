import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, ArrowLeft, Share2, BookOpen, Tag, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import type { Article } from "@shared/schema";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface ArticleViewProps {
  articleSlug: string;
}

export default function ArticleView({ articleSlug }: ArticleViewProps) {
  const [, navigate] = useLocation();

  // 1. Fetching Logic
  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ['/api/articles', articleSlug],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleSlug}`);
      if (!response.ok) throw new Error('Article not found');
      return response.json();
    }
  });

  // 2. Navigation Logic (Dashboard vs Public List)
  const handleBack = () => {
    if (document.referrer.includes("/admin")) {
      navigate("/admin");
    } else {
      navigate("/articles");
    }
  };

  // 3. Content Formatter
  const formatContent = (content: string) => {
    marked.setOptions({ breaks: true, gfm: true });
    const html = marked.parse(content) as string;
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "h1", "h2", "h3", "h4", "h5", "h6", "p", "strong", "em", "ul", "ol", "li",
        "br", "blockquote", "code", "pre", "a", "img", "table", "thead", "tbody", "tr", "th", "td"
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "class", "src", "alt"]
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );

  if (error || !article) return (
    <div className="min-h-screen py-16 text-center">
      <h1 className="text-2xl font-bold">Article Not Found</h1>
      <Button onClick={handleBack} className="mt-4"><ArrowLeft className="mr-2" /> Go Back</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-background selection:bg-primary/20">
      <div className="max-w-[800px] mx-auto px-6 py-12">

        {/* Navigation Button */}
        <Button variant="ghost" onClick={handleBack} className="mb-10 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {document.referrer.includes("/admin") ? "Back to Dashboard" : "Back to Articles"}
        </Button>

        <article className="space-y-8">
          <header className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-primary-foreground uppercase tracking-widest text-[10px]">
                {article.category}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {new Date(article.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5 min read</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-black leading-tight text-foreground">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-6">
              {article.summary}
            </p>

            {article.coverImage && (
              <div className="rounded-2xl overflow-hidden shadow-xl border">
                <img src={article.coverImage} alt={article.title} className="w-full h-auto" />
              </div>
            )}
          </header>

          {/* Content Section */}
          <section className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:font-serif">
            <div dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />
          </section>

          <footer className="pt-12 border-t mt-16">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(article.tags) ? article.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-sm text-primary font-medium">#{tag}</span>
                )) : null}
              </div>
              <Button variant="outline" size="sm" onClick={() => { }} className="rounded-full shadow-sm">
                <Share2 className="w-4 h-4 mr-2" /> Share Article
              </Button>
            </div>

            {/* ERROR FIXED AREA: Line 152+ in your screenshot */}
            <div className="mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center">
              <h3 className="font-serif font-bold text-xl mb-2">Thanks for reading!</h3>
              <p className="text-muted-foreground mb-6 text-sm">Hope you found this article insightful.</p>
              {/* <Button
                variant="ghost" // "link" ki jagah "ghost" likh dein
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-primary font-bold underline underline-offset-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to top
              </Button> */}
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}