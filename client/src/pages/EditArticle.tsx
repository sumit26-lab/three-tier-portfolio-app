import { useRoute } from "wouter";
import ArticleEditor from "@/components/ArticleEditor";

export default function EditArticle() {
  const [match, params] = useRoute("/admin/articles/:id/edit");
  
  if (!match || !params?.id) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground">Invalid article URL.</p>
        </div>
      </div>
    );
  }

  return <ArticleEditor mode="edit" articleId={params.id} />;
}