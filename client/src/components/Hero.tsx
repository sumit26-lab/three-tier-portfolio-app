// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Mail, Phone, MapPin, Loader2, Edit3, Save, X, LogOut, Download } from "lucide-react";
// import { toast } from "sonner"; // Assuming you use Sonner for notifications

// export default function Hero() {
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   const [formData, setFormData] = useState<any>({});
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   // Check for admin status and fetch data on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) setIsAdmin(true);
//     fetchHeroData();
//   }, []);

//   /* ================= FETCH DATA ================= */
//   const fetchHeroData = async () => {
//     try {
//       // Standardized relative path - uses Vite Proxy
//       const response = await fetch('/api/hero');
//       if (!response.ok) throw new Error("Failed to fetch hero data");

//       const result = await response.json();
//       setData(result);
//       setFormData(result); 
//     } catch (error) {
//       console.error("Fetch error:", error);
//       toast.error("Could not load profile data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= LOGOUT ================= */
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsAdmin(false);
//     setIsEditing(false);
//     toast.info("Logged out successfully");
//     window.location.reload(); 
//   };

//   /* ================= UPDATE DATA ================= */
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);

//     const token = localStorage.getItem("token");

//     // Using FormData to handle both text and image uploads
//     const formPayload = new FormData();
//     formPayload.append("name", formData.name || "");
//     formPayload.append("title", formData.title || "");
//     formPayload.append("description", formData.description || "");
//     formPayload.append("phone", formData.phone || "");
//     formPayload.append("email", formData.email || "");
//     formPayload.append("location", formData.location || "");
//     if (selectedFile) formPayload.append("image", selectedFile);

//     try {
//       // Standardized relative path - uses Vite Proxy
//       const res = await fetch('/api/admin/hero', {
//         method: 'PUT',
//         headers: { 
//           'Authorization': `Bearer ${token}` 
//           // Note: Do NOT set 'Content-Type' when sending FormData
//         },
//         body: formPayload
//       });

//       if (res.ok) {
//         await fetchHeroData();
//         setIsEditing(false);
//         setSelectedFile(null);
//         toast.success("Profile updated successfully!");
//       } else {
//         const errData = await res.json();
//         toast.error(errData.message || "Update failed");
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       toast.error("Error connecting to server.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center">
//       <Loader2 className="animate-spin text-primary w-10 h-10" />
//     </div>
//   );

//   if (!data) return null;

//   return (
//     <section className="min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-background to-primary/5 relative">

//       {/* Admin Quick Controls */}
//       {isAdmin && (
//         <div className="absolute top-6 right-6 flex gap-3 z-50">
//           <Button 
//             variant={isEditing ? "destructive" : "secondary"} 
//             onClick={() => {
//               setIsEditing(!isEditing);
//               if (isEditing) setFormData(data); // Reset form on cancel
//             }}
//           >
//             {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
//             {isEditing ? "Cancel" : "Edit Hero"}
//           </Button>
//           <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
//             <LogOut className="w-4 h-4 mr-2" /> Logout
//           </Button>
//         </div>
//       )}

//       <div className="max-w-6xl mx-auto px-4 w-full">
//         {isEditing ? (
//           /* --- ADMIN EDITING VIEW --- */
//           <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-12 bg-card p-8 rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-bottom-4">
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Update Hero Section</h2>

//               <div className="space-y-1">
//                 <Label>Full Name</Label>
//                 <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
//               </div>

//               <div className="space-y-1">
//                 <Label>Professional Title</Label>
//                 <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
//               </div>

//               <div className="space-y-1">
//                 <Label>Description</Label>
//                 <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={5} />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <Label>Phone</Label>
//                   <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Email</Label>
//                   <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <Label>Location</Label>
//                 <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
//               </div>

//               <Button type="submit" className="w-full mt-4" disabled={isSaving}>
//                 {isSaving ? (
//                   <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
//                 ) : (
//                   <><Save className="w-4 h-4 mr-2" /> Save Changes</>
//                 )}
//               </Button>
//             </div>

//             {/* Image Preview & Upload Section */}
//             <div className="flex flex-col items-center justify-center bg-muted/50 rounded-xl p-6 border-2 border-dashed">
//                <img 
//                 src={selectedFile ? URL.createObjectURL(selectedFile) : data.profileImage} 
//                 className="w-56 h-56 rounded-lg object-cover mb-4 shadow-md border-4 border-white" 
//                 alt="Preview"
//                />
//                <Label className="mb-2 font-semibold">Change Profile Image</Label>
//                <Input 
//                 type="file" 
//                 accept="image/*"
//                 className="cursor-pointer bg-background" 
//                 onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
//                />
//                <p className="text-xs text-muted-foreground mt-2">Recommended: Square aspect ratio</p>
//             </div>
//           </form>
//         ) : (
//           /* --- PUBLIC VISITOR VIEW --- */
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-foreground">
//                   {data.name}
//                 </h1>
//                 <p className="text-xl md:text-2xl text-primary font-medium">
//                   {data.title}
//                 </p>
//               </div>

//               <p className="text-lg text-muted-foreground leading-relaxed">
//                 {data.description}
//               </p>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
//                 <div className="flex items-center gap-3 text-muted-foreground">
//                   <Phone className="w-5 h-5 text-primary" /> 
//                   <span>{data.phone}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-muted-foreground">
//                   <Mail className="w-5 h-5 text-primary" /> 
//                   <span>{data.email}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-muted-foreground">
//                   <MapPin className="w-5 h-5 text-primary" /> 
//                   <span>{data.location}</span>
//                 </div>
//               </div>

//               <div className="flex gap-4 pt-6">
//                 <Button size="lg" className="px-8">
//                   Get In Touch
//                 </Button>
//                 <Button variant="outline" size="lg">
//                   <Download className="w-4 h-4 mr-2"/> Download Resume
//                 </Button>
//               </div>
//             </div>

//             <div className="flex justify-center md:justify-end">
//               <Card className="p-2 overflow-hidden shadow-2xl bg-card border-none rotate-3 hover:rotate-0 transition-transform duration-500">
//                 <img 
//                   src={data.profileImage} 
//                   alt={data.name} 
//                   className="w-80 h-80 rounded-lg object-cover grayscale hover:grayscale-0 transition-all duration-500" 
//                 />
//               </Card>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
// 

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Loader2, Edit3, Save, X, LogOut, Download, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Hero() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAdmin(true);
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/hero');
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setData(result);
      setFormData(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const toastId = toast.loading("Syncing with Cloudinary and Database...");
    const token = localStorage.getItem("token");
    const formPayload = new FormData();

    // Text fields
    formPayload.append("name", formData.name || "");
    formPayload.append("title", formData.title || "");
    formPayload.append("description", formData.description || "");
    formPayload.append("phone", formData.phone || "");
    formPayload.append("email", formData.email || "");
    formPayload.append("location", formData.location || "");

    // File fields
    if (selectedImage) formPayload.append("image", selectedImage);
    if (selectedResume) formPayload.append("resume", selectedResume);

    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formPayload
      });

      const result = await res.json();

      if (res.ok) {
        await fetchHeroData();
        setIsEditing(false);
        setSelectedImage(null);
        setSelectedResume(null);
        toast.success("Portfolio Updated Successfully!", { id: toastId, icon: <CheckCircle2 className="text-green-500" /> });
      } else {
        toast.error(result.message || "Update failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Connection error", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (data?.resumeUrl) {
      window.open(data.resumeUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Resume file not found");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  if (!data) return null;

  return (
    <section className="min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-background to-primary/5 relative">

      {/* Admin Quick Actions */}
      {isAdmin && (
        <div className="absolute top-6 right-6 flex gap-3 z-50">
          <Button
            variant={isEditing ? "destructive" : "secondary"}
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) {
                setFormData(data);
                setSelectedImage(null);
                setSelectedResume(null);
              }
            }}
          >
            {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
          <Button variant="outline" onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} className="text-red-600 border-red-100 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 w-full">
        {isEditing ? (
          /* --- ADMIN EDIT MODE --- */
          <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-12 bg-card p-8 rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Update Information</h2>

              <div className="grid gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
                  <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Bio</label>
                  <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Phone</label>
                  <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Email</label>
                  <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <label className="flex items-center gap-2 text-sm font-bold mb-2">
                  <FileText className="w-4 h-4 text-primary" /> Resume (PDF)
                </label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedResume(e.target.files?.[0] || null)}
                  className="bg-background cursor-pointer"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold shadow-lg" disabled={isSaving}>
                {isSaving ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Updating...</> : <><Save className="mr-2 h-5 w-5" /> Publish Changes</>}
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 bg-muted/20 rounded-2xl border p-8">
              <img
                src={selectedImage ? URL.createObjectURL(selectedImage) : data.profileImage}
                className="w-56 h-56 rounded-2xl object-cover shadow-xl border-4 border-background"
                alt="Preview"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
            </div>
          </form>
        ) : (
          /* --- VISITOR VIEW --- */
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-6xl font-serif font-extrabold text-foreground tracking-tight">{data.name}</h1>
              <p className="text-2xl text-primary font-semibold tracking-wide uppercase">{data.title}</p>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">{data.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="bg-primary/10 p-2 rounded-full"><Phone className="w-4 h-4 text-primary" /></div>
                  {data.phone}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="bg-primary/10 p-2 rounded-full"><Mail className="w-4 h-4 text-primary" /></div>
                  {data.email}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="bg-primary/10 p-2 rounded-full"><MapPin className="w-4 h-4 text-primary" /></div>
                  {data.location}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                {/* FIXED: Contact Button now opens the email app */}
                <Button
                  size="lg"
                  // 'rounded-full' makes it round, 'px-10' adds extra width for a better pill shape
                  className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      toast.error("Contact section not found!");
                    }
                  }}
                >
                  Contact Me
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleDownload}
                  className="h-14 rounded-full px-8 border-2 border-primary/20 hover:bg-primary/5 transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" /> Resume
                </Button>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <Card className="relative p-2 overflow-hidden shadow-2xl bg-card border-none rounded-3xl -rotate-2 group-hover:rotate-0 transition-all duration-700">
                  <img
                    src={data.profileImage}
                    alt={data.name}
                    className="w-80 h-[420px] rounded-2xl object-cover"
                  />
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}