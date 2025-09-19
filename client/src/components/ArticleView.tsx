import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, ArrowLeft, Share2, BookOpen, Tag } from "lucide-react";
import { useLocation } from "wouter";
import type { Article } from "@shared/schema";

interface ArticleViewProps {
  articleSlug: string;
}

export default function ArticleView({ articleSlug }: ArticleViewProps) {
  const [, navigate] = useLocation();

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ['/api/articles', articleSlug],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleSlug}`);
      if (!response.ok) throw new Error('Article not found');
      return response.json();
    }
  });

  const handleBack = () => {
    console.log('Navigating back to articles list');
    navigate('/articles');
  };

  const handleShare = () => {
    console.log('Share article clicked');
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Article URL copied to clipboard!');
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Convert markdown content to safe HTML
  const formatContent = (content: string) => {
    // Using DOMPurify and marked for safe HTML rendering
    const marked = require('marked');
    const createDOMPurify = require('dompurify');
    const DOMPurify = createDOMPurify(window);
    
    // Configure marked for safe rendering
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    
    // Convert markdown to HTML and sanitize
    const html = marked.parse(content);
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['class']
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-24 mb-8"></div>
            <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack} data-testid="button-back-to-articles">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mb-8 hover-elevate"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Button>

        {/* Article Header */}
        <Card className="mb-8">
          <CardHeader className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" data-testid="badge-category">
                {article.category}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span data-testid="text-publish-date">
                    {formatDate(article.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span data-testid="text-reading-time">
                    {getReadingTime(article.content)}
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-serif font-bold text-foreground leading-tight" data-testid="text-article-title">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-article-summary">
              {article.summary}
            </p>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2" data-testid="article-tags">
                <Tag className="w-4 h-4 text-muted-foreground mr-2" />
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Share Button */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleShare} data-testid="button-share">
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card>
          <CardContent className="prose prose-lg max-w-none pt-8">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
              data-testid="article-content"
            />
          </CardContent>
        </Card>

        {/* Article Footer */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {article.updatedAt !== article.createdAt && (
                <p>Last updated: {formatDate(article.updatedAt)}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack} data-testid="button-back-footer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Button>
              <Button variant="outline" onClick={handleShare} data-testid="button-share-footer">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}