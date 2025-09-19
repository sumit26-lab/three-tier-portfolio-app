import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Clock, Search, Filter, BookOpen, Tag, Plus } from "lucide-react";
import { useLocation } from "wouter";
import type { Article } from "@shared/schema";

export default function ArticlesList() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Fetch articles using the standard query pattern
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles']
  });

  // Fetch categories using the standard query pattern
  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['/api/categories']
  });

  // Fetch tags using the standard query pattern
  const { data: tags = [] } = useQuery<string[]>({
    queryKey: ['/api/tags']
  });

  // Filter articles based on search and filters
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    const matchesTag = selectedTag === "all" || article.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleArticleClick = (article: Article) => {
    console.log('Navigating to article:', article.slug);
    navigate(`/articles/${article.slug}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('Search term changed:', e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    console.log('Category filter changed:', value);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    console.log('Tag filter changed:', value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedTag("all");
    console.log('Filters cleared');
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

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-4/5"></div>
                    <div className="h-3 bg-muted rounded w-3/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-articles-title">
                Articles & Insights
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore my thoughts on economics, education, and professional development
              </p>
            </div>
            <Button 
              onClick={() => navigate('/admin/articles/new')}
              className="hover-elevate"
              data-testid="button-create-article"
            >
              <Plus className="w-4 h-4 mr-2" />
              Write Article
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 border">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                  data-testid="input-search-articles"
                />
              </div>
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger data-testid="select-category">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedTag} onValueChange={handleTagChange}>
                <SelectTrigger data-testid="select-tag">
                  <Tag className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchTerm || selectedCategory !== "all" || selectedTag !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredArticles.length} of {articles.length} articles
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "all" || selectedTag !== "all"
                ? "Try adjusting your search or filters"
                : "Check back later for new content"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <Card 
                key={article.id} 
                className="hover-elevate cursor-pointer transition-all duration-200 h-full flex flex-col"
                onClick={() => handleArticleClick(article)}
                data-testid={`card-article-${index}`}
              >
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${index}`}>
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span data-testid={`text-reading-time-${index}`}>
                        {getReadingTime(article.content)}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight mb-2" data-testid={`text-article-title-${index}`}>
                    {article.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    <span data-testid={`text-article-date-${index}`}>
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow" data-testid={`text-article-summary-${index}`}>
                    {article.summary}
                  </p>
                  
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto" data-testid={`tags-${index}`}>
                      {article.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}