

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Tag, Plus, ArrowLeft, Clock } from "lucide-react"; 
import { useLocation } from "wouter";
import type { Article } from "@shared/schema";
import { apiFetch } from "@/lib/apiClient";

export default function ArticlesList() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const isAdmin = !!localStorage.getItem("token");

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    queryFn: () => apiFetch<Article[]>('/api/articles'),
  });

  const calculateReadTime = (content: string | undefined) => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // --- TAGS EXTRACTOR (SAFE TYPES) ---
  const allTags = Array.from(new Set(articles.flatMap(a => {
    const rawTags = a.tags as any;
    if (!rawTags) return [];
    if (typeof rawTags === 'string') {
      return rawTags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
    if (Array.isArray(rawTags)) {
      return rawTags.map((t: any) => String(t).trim()).filter(Boolean);
    }
    return [];
  })));

  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));

  // --- FILTERING LOGIC ---
  const filteredArticles = articles.filter(article => {
    const title = article.title?.toLowerCase() || "";
    const summary = article.summary?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch = searchTerm === "" || title.includes(search) || summary.includes(search);
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    let articleTags: string[] = [];
    const rawTags = article.tags as any;
    if (rawTags) {
      if (typeof rawTags === 'string') {
        articleTags = rawTags.split(',').map((t: string) => t.trim()).filter(Boolean);
      } else if (Array.isArray(rawTags)) {
        articleTags = rawTags.map((t: any) => String(t).trim()).filter(Boolean);
      }
    }
    const matchesTag = selectedTag === "all" || articleTags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  if (isLoading) return <div className="p-10 text-center text-muted-foreground font-serif italic">Loading insights...</div>;

  return (
    <div className="min-h-screen py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')} 
          className="mb-6 -ml-2 text-muted-foreground hover:text-primary gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2 tracking-tight">Articles & Insights</h1>
            <p className="text-muted-foreground text-lg">Exploring economics and professional excellence</p>
          </div>
          {isAdmin && (
            <Button onClick={() => navigate('/admin/articles/new')} className="hover-elevate">
              <Plus className="w-4 h-4 mr-2" /> Write Article
            </Button>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-card rounded-xl p-6 mb-12 border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 focus-visible:ring-primary"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => <SelectItem key={cat} value={cat!}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger>
              <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => {
              const rawTags = article.tags as any;
              const tagsToShow = typeof rawTags === 'string' 
                ? rawTags.split(',').map((t: string) => t.trim()).filter(Boolean)
                : (Array.isArray(rawTags) ? rawTags : []);

              return (
                <Card key={article.id} className="flex flex-col h-full overflow-hidden transition-all border-muted/50 hover:shadow-xl group bg-card">
                  <div 
                    className="h-48 bg-muted cursor-pointer relative overflow-hidden"
                    onClick={() => navigate(`/articles/${article.id}`)}
                  >
                    {article.coverImage && (
                      <img 
                        src={article.coverImage} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={article.title}
                      />
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-none">
                        {article.category}
                      </Badge>
                      <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm border-none flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {calculateReadTime(article.content)} min
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle 
                      className="text-xl font-serif leading-tight cursor-pointer hover:text-primary line-clamp-2 transition-colors"
                      onClick={() => navigate(`/articles/${article.id}`)}
                    >
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{article.summary}</p>
                    
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {tagsToShow.map((tag: string) => (
                        <span key={tag} className="text-[10px] font-semibold bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md uppercase tracking-wider">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed border-muted">
              <p className="text-muted-foreground mb-4 font-medium">No articles found matching your criteria.</p>
              {/* FIXED RESET BUTTON WITHOUT VARIANT="LINK" ERROR */}
              <Button 
                variant="outline" 
                className="text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => {setSearchTerm(""); setSelectedCategory("all"); setSelectedTag("all");}}
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}