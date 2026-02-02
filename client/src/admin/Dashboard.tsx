

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { User, KeyRound, LogOut, LayoutDashboard, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { useLocation } from "wouter";
import { apiFetch } from "@/lib/apiClient";
import type { Article } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /* ================= FETCH ARTICLES ================= */
  const { data: articles = [], isLoading, isFetching } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    queryFn: () => apiFetch<Article[]>("/api/articles"),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  /* ================= DELETE ARTICLE ================= */
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/api/admin/articles/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Deleted successfully", description: "Article removed" });
    },
  });

  const handleDelete = (id: number) => {
    if (!confirm("Delete permanently?")) return;
    deleteMutation.mutate(id);
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({ title: "Logged out" });
    navigate("/admin/login");
  };

  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-muted/20 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-bold flex gap-2 items-center">
            <LayoutDashboard className="text-primary" />
            Admin Dashboard
            {isFetching && <Loader2 className="animate-spin w-4 h-4 ml-2" />}
          </h1>

          {/* 🔥 RIGHT SIDE BUTTONS */}
          <div className="flex gap-3 items-center">

            {/* New Article */}
            <Button onClick={() => navigate("/admin/articles/new")}>
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>

            {/* 🔥 PROFILE DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">

                {/* Edit Profile */}
                <DropdownMenuItem
                  onClick={() => navigate("/")}
                  className="cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>

                {/* Change Password */}
                <DropdownMenuItem
                  onClick={() => navigate("/admin/change-password")}
                  className="cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  Change Password
                </DropdownMenuItem>

                {/* Logout */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card>
            <CardHeader>
              <CardTitle>Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{articles.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {new Set(articles.map(a => a.category)).size}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalViews}</p>
            </CardContent>
          </Card>
        </div>

        {/* ================= TABLE ================= */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>{article.title}</TableCell>
                    <TableCell>
                      <Badge>{article.category}</Badge>
                    </TableCell>
                    <TableCell>{article.views || 0}</TableCell>
                    <TableCell>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="flex gap-2 justify-end">

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          navigate(`/admin/articles/edit/${article.id}`)
                        }
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(Number(article.id))}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
