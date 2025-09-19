import { useRoute } from "wouter";
import ArticleView from "@/components/ArticleView";

export default function ArticleDetail() {
  const [match, params] = useRoute("/articles/:slug");
  
  if (!match || !params?.slug) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground">Invalid article URL.</p>
        </div>
      </div>
    );
  }

  return <ArticleView articleSlug={params.slug} />;
}