

import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner"; 
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
   <Toaster
      position="top-center"   
      richColors              
      expand                  
      closeButton
      duration={2500}
    />
  </QueryClientProvider>
);
