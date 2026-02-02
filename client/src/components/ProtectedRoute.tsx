// import { ReactNode } from "react";
// import { Redirect } from "wouter";

// export default function ProtectedRoute({ children }: { children: ReactNode }) {
//   // 🔑 Backend validation ko bypass karo, sirf token check karo
//   const token = localStorage.getItem("token");

//   // Agar token nahi hai, toh login par bhejo
//   if (!token) {
//     return <Redirect to="/admin/login" />;
//   }

//   // Agar token mil gaya, toh khushi-khushi andar jaane do
//   return <>{children}</>;
// }

// import { ReactNode } from "react";
// import { Redirect } from "wouter";

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const token = localStorage.getItem("token"); // 👈 MUST MATCH login
//  alert(token)
//   if (!token) {
//     return <Redirect to="/admin/login" />;
//   }

//   return <>{children}</>;
// }

import { ReactNode, useEffect } from "react";
import { Redirect } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Session Expired 🔒",
        description: "Please login again to continue.",
      });
    }
  }, [token]);

  if (!token) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}
