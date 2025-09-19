import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, ArrowLeft, X, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { insertArticleSchema, updateArticleSchema, type Article, type InsertArticle, type UpdateArticle } from "@shared/schema";
import { z } from "zod";

interface ArticleEditorProps {
  articleId?: string;
  mode: 'create' | 'edit';
}

const editorFormSchema = insertArticleSchema.extend({
  id: z.string().optional(),
});

type EditorFormData = z.infer<typeof editorFormSchema>;

export default function ArticleEditor({ articleId, mode }: ArticleEditorProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch existing article for edit mode
  const { data: existingArticle, isLoading: isLoadingArticle } = useQuery<Article>({
    queryKey: ['/api/articles', articleId],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleId}`, {
        headers: { 'x-admin-key': 'admin123' }
      });
      if (!response.ok) throw new Error('Failed to fetch article');
      return response.json();
    },
    enabled: mode === 'edit' && !!articleId
  });

  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['/api/categories']
  });

  const form = useForm<EditorFormData>({
    resolver: zodResolver(editorFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      category: "",
      tags: [],
      published: false
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (existingArticle && mode === 'edit') {
      form.reset({
        id: existingArticle.id,
        title: existingArticle.title,
        slug: existingArticle.slug,
        summary: existingArticle.summary,
        content: existingArticle.content,
        category: existingArticle.category,
        tags: existingArticle.tags,
        published: existingArticle.published
      });
    }
  }, [existingArticle, form, mode]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // Auto-generate slug if creating new article
    if (mode === 'create' && title) {
      const slug = generateSlug(title);
      form.setValue('slug', slug);
    }
  };

  const addTag = () => {
    const currentTags = form.getValues('tags') || [];
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      form.setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput("");
      console.log('Tag added:', tagInput.trim());
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
    console.log('Tag removed:', tagToRemove);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Create article mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': 'admin123' 
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create article');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({ title: "Article created successfully!" });
      navigate('/articles');
    },
    onError: (error: any) => {
      toast({ 
        title: "Error creating article", 
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  });

  // Update article mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateArticle) => {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': 'admin123' 
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update article');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/articles', articleId] });
      toast({ title: "Article updated successfully!" });
      navigate('/articles');
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating article", 
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: EditorFormData) => {
    console.log('Form submitted:', data);
    
    if (mode === 'create') {
      const { id, ...createData } = data;
      createMutation.mutate(createData);
    } else {
      const { id, ...updateData } = data;
      updateMutation.mutate(updateData);
    }
  };

  const handleBack = () => {
    console.log('Navigating back to articles');
    navigate('/articles');
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
    console.log('Preview mode toggled:', !previewMode);
  };

  if (mode === 'edit' && isLoadingArticle) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
            <h1 className="text-3xl font-serif font-bold" data-testid="text-editor-title">
              {mode === 'create' ? 'Create New Article' : 'Edit Article'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={togglePreview}
              data-testid="button-preview"
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{form.watch('title') || 'Article Title'}</CardTitle>
              <p className="text-muted-foreground">{form.watch('summary') || 'Article summary...'}</p>
              <div className="flex gap-2">
                <Badge variant="secondary">{form.watch('category') || 'Category'}</Badge>
                {form.watch('published') && <Badge variant="default">Published</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                  {form.watch('content') || 'Article content...'}
                </pre>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Edit Mode */
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    onChange={handleTitleChange}
                    placeholder="Enter article title"
                    data-testid="input-title"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    {...form.register('slug')}
                    placeholder="article-url-slug"
                    data-testid="input-slug"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                  )}
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    {...form.register('summary')}
                    placeholder="Brief summary of the article"
                    rows={3}
                    data-testid="textarea-summary"
                  />
                  {form.formState.errors.summary && (
                    <p className="text-sm text-destructive">{form.formState.errors.summary.message}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <div className="flex gap-2">
                    <Select
                      value={form.watch('category')}
                      onValueChange={(value) => form.setValue('category', value)}
                    >
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Or enter new category"
                      onChange={(e) => form.setValue('category', e.target.value)}
                      className="flex-1"
                      data-testid="input-new-category"
                    />
                  </div>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a tag"
                      data-testid="input-tag"
                    />
                    <Button type="button" onClick={addTag} variant="outline" data-testid="button-add-tag">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2" data-testid="tags-list">
                    {(form.watch('tags') || []).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {tag}
                        <X 
                          className="w-3 h-3 ml-1 hover:text-destructive" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Published Status */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={form.watch('published')}
                    onCheckedChange={(checked) => form.setValue('published', checked)}
                    data-testid="switch-published"
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="content">Article Content (Markdown supported)</Label>
                  <Textarea
                    id="content"
                    {...form.register('content')}
                    placeholder="Write your article content here. You can use markdown formatting."
                    rows={20}
                    className="font-mono text-sm"
                    data-testid="textarea-content"
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleBack} data-testid="button-cancel">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save"
              >
                <Save className="w-4 h-4 mr-2" />
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Article'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}