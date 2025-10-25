import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "NEXA",
  description: "AI-Powered Chat Application",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <AppContextProvider>
        <html lang="en">
          <body className={`${inter.className} antialiased`}>
            <Toaster
              toastOptions={{
                success: { style: { background: "black", color: "white" } },
                error: { style: { background: "black", color: "white" } },
              }}
            />
            {children}
          </body>
        </html>
      </AppContextProvider>
    </AuthProvider>
  );
}
