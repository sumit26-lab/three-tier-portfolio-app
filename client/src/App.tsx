import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Portfolio from "@/pages/Portfolio";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import CreateArticle from "@/pages/CreateArticle";
import EditArticle from "@/pages/EditArticle";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/articles" component={Articles} />
      <Route path="/articles/:slug" component={ArticleDetail} />
      <Route path="/admin/articles/new" component={CreateArticle} />
      <Route path="/admin/articles/:id/edit" component={EditArticle} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
