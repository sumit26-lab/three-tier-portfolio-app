import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/apiClient";

export default function ChangePassword() {
  const [, navigate] = useLocation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      await apiFetch("/api/admin/change-password", {
        method: "PUT",
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      toast.success("Password updated successfully ✅");

      setOldPassword("");
      setNewPassword("");

      setTimeout(() => navigate("/admin"), 800);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">

      <Card className="w-full max-w-md shadow-xl rounded-2xl">

        <CardHeader className="text-center space-y-2">
          <KeyRound className="mx-auto w-8 h-8 text-primary" />
          <CardTitle className="text-2xl">Change Password</CardTitle>
        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

          </form>

        </CardContent>
      </Card>
    </div>
  );
}
