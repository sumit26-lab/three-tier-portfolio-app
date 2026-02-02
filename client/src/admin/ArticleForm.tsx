// import { useState, useEffect } from "react";
// import { useLocation, useParams } from "wouter";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { apiFetch } from "@/lib/apiClient";
// import { useToast } from "@/hooks/use-toast";
// import { ChevronLeft, Save, Loader2, Upload, ImageIcon, Tag } from "lucide-react";

// export default function ArticleForm() {
//   const { id } = useParams(); 
//   const [, navigate] = useLocation();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const isEdit = !!id;

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     summary: "",
//     content: "",
//     category: "",
//     tags: "", 
//   });

//   const { data: articleData, isLoading: isFetching } = useQuery({
//     queryKey: [`/api/articles/${id}`],
//     queryFn: () => apiFetch<any>(`/api/articles/${id}`),
//     enabled: isEdit,
//   });

//   useEffect(() => {
//     if (articleData && isEdit) {
//       setFormData({
//         title: articleData.title || "",
//         slug: articleData.slug || "",
//         summary: articleData.summary || "",
//         content: articleData.content || "",
//         category: articleData.category || "",
//         tags: Array.isArray(articleData.tags) ? articleData.tags.join(", ") : articleData.tags || "", // Array ko string mein convert kiya
//       });
//       if (articleData.coverImage) setPreviewUrl(articleData.coverImage);
//     }
//   }, [articleData, isEdit]);

//   const mutation = useMutation({
//     mutationFn: async (newData: any) => {
//       const token = localStorage.getItem("token"); 
//       const url = isEdit ? `/api/admin/articles/${id}` : "/api/admin/articles";
      
//       const formPayload = new FormData();
//       formPayload.append("title", newData.title || "");
//       formPayload.append("slug", newData.slug || "");
//       formPayload.append("summary", newData.summary || "");
//       formPayload.append("content", newData.content || "");
//       formPayload.append("category", newData.category || "");
//       formPayload.append("tags", newData.tags || ""); // ✨ Payload mein add kiya

//       if (selectedFile) {
//         formPayload.append("image", selectedFile);
//       }

//       const res = await fetch(url, {
//         method: isEdit ? 'PATCH' : 'POST',
//         headers: { 
//           'Authorization': `Bearer ${token}` 
//         },
//         body: formPayload
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || "Invalid Token!");
//       return result;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
//       toast({ title: "Success", description: "Article with tags saved!" });
//       navigate("/admin");
//     },
//     onError: (error: any) => {
//       toast({ 
//         variant: "destructive", 
//         title: "Error", 
//         description: error?.message || "Something went wrong" 
//       });
//     }
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     mutation.mutate(formData);
//   };

//   if (isFetching) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>;

//   return (
//     <div className="min-h-screen p-4 md:p-10 bg-muted/20">
//       <div className="max-w-4xl mx-auto">
//         <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-6 gap-2">
//           <ChevronLeft className="w-4 h-4" /> Back to Dashboard
//         </Button>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 space-y-6">
//               <Card>
//                 <CardHeader><CardTitle>{isEdit ? "Edit Article" : "New Article"}</CardTitle></CardHeader>
//                 <CardContent className="space-y-4">
//                   <Input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
//                   <Input placeholder="Slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
//                   <Textarea placeholder="Summary" rows={3} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
//                   <Textarea placeholder="Content (Markdown)" className="min-h-[400px]" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="space-y-6">
//               <Card>
//                 <CardHeader><CardTitle className="text-sm">Publishing Options</CardTitle></CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1 mb-1">
//                       Category
//                     </label>
//                     <Input placeholder="e.g. Technology" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
//                   </div>

//                   {/* ✨ TAGS INPUT FIELD */}
//                   <div>
//                     <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1 mb-1">
//                       <Tag className="w-3 h-3" /> Tags
//                     </label>
//                     <Input 
//                       placeholder="react, node, tutorial" 
//                       value={formData.tags} 
//                       onChange={e => setFormData({...formData, tags: e.target.value})} 
//                     />
//                     <p className="text-[10px] text-muted-foreground mt-1">Separate with commas</p>
//                   </div>

//                   <div className="space-y-2 pt-2 border-t">
//                     <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
//                       <ImageIcon className="w-3 h-3" /> Cover Image
//                     </label>
//                     {previewUrl && <img src={previewUrl} className="h-40 w-full object-cover rounded-md border mb-2" />}
//                     <Input type="file" accept="image/*" className="cursor-pointer" onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (file) {
//                         setSelectedFile(file);
//                         setPreviewUrl(URL.createObjectURL(file));
//                       }
//                     }} />
//                   </div>

//                   <Button type="submit" className="w-full" disabled={mutation.isPending}>
//                     {mutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
//                     {isEdit ? "Update Article" : "Publish Article"}
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/apiClient";
import { toast } from "sonner"; // ⭐ use sonner
import { ChevronLeft, Save, Loader2, ImageIcon, Tag } from "lucide-react";

export default function ArticleForm() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "",
    tags: "",
  });

  // ================= FETCH =================
  const { data: articleData, isLoading } = useQuery({
    queryKey: [`/api/articles/${id}`],
    queryFn: () => apiFetch<any>(`/api/articles/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (articleData && isEdit) {
      setFormData({
        title: articleData.title || "",
        slug: articleData.slug || "",
        summary: articleData.summary || "",
        content: articleData.content || "",
        category: articleData.category || "",
        tags: Array.isArray(articleData.tags)
          ? articleData.tags.join(", ")
          : articleData.tags || "",
      });

      if (articleData.coverImage) setPreviewUrl(articleData.coverImage);
    }
  }, [articleData, isEdit]);

  // ================= MUTATION =================
  const mutation = useMutation({
    mutationFn: async (newData: any) => {
      const token = localStorage.getItem("token");
      const url = isEdit
        ? `/api/admin/articles/${id}`
        : "/api/admin/articles";

      const formPayload = new FormData();

      Object.entries(newData).forEach(([k, v]) =>
        formPayload.append(k, String(v ?? ""))
      );

      if (selectedFile) formPayload.append("image", selectedFile);

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      if (!res.ok) throw new Error("Upload failed");

      return res.json();
    },

    // 🔥 LOADING + SUCCESS + ERROR
    onMutate: () => {
      toast.loading(isEdit ? "Updating article..." : "Uploading article...");
    },

    onSuccess: () => {
      toast.dismiss();
      toast.success(isEdit ? "Article updated 🚀" : "Article published 🚀");

      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });

      setTimeout(() => navigate("/admin"), 700);
    },

    onError: (err: any) => {
      toast.dismiss();
      toast.error(err?.message || "Something went wrong ❌");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );

  // ================= UI =================
  return (
    <div className="min-h-screen p-6 md:p-10 bg-muted/20">
      <div className="max-w-4xl mx-auto space-y-6">

        <Button variant="ghost" onClick={() => navigate("/admin")}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isEdit ? "Edit Article" : "Create Article"}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />

                  <Input
                    placeholder="Slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />

                  <Textarea
                    placeholder="Summary"
                    rows={3}
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                  />

                  <Textarea
                    placeholder="Content"
                    className="min-h-[350px]"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    required
                  />
                </CardContent>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Publishing</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  <Input
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />

                  <Input
                    placeholder="react, node, api"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />

                  {previewUrl && (
                    <img
                      src={previewUrl}
                      className="h-40 w-full object-cover rounded-md border"
                    />
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}

                    {isEdit ? "Update" : "Publish"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
