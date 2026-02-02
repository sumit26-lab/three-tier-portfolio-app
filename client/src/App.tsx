
import { Switch, Route } from "wouter";
import Portfolio from "@/pages/Portfolio";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import CreateArticle from "@/admin/ArticleForm";
import EditArticle from "@/admin/ArticleForm";
import AdminDashboard from "@/admin/Dashboard";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLogin from "@/pages/login";
import ChangePassword from "@/admin/ChangePassword";



function Router() {
  return (
    <Switch>
      {/* 🌍 Public Routes */}
      <Route path="/admin/login" component={AdminLogin} />

      <Route path="/" component={Portfolio} />
      <Route path="/articles" component={Articles} />
      <Route path="/articles/:id" component={ArticleDetail} />

      {/* 🔑 Login Page (Public) */}



      <Route path="/admin" component={() => (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      )} />
      <Route path="/admin/change-password">
        <ProtectedRoute>
          <ChangePassword />
        </ProtectedRoute>
      </Route>


      {/* 2. Create New Article */}
      <Route path="/admin/articles/new">
        <ProtectedRoute>
          <CreateArticle />
        </ProtectedRoute>
      </Route>

      {/* 3. Edit Existing Article (ID wala path) */}
      <Route path="/admin/articles/edit/:id">
        <ProtectedRoute>
          <EditArticle />
        </ProtectedRoute>
      </Route>

      {/* 🚫 404 Page */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default Router;