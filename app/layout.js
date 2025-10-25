import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppContextProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ModelProvider } from "@/context/ModelContext";
import { ReasoningProvider } from "@/context/ReasoningContext";
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
        <ThemeProvider>
          <ReasoningProvider>
            <ModelProvider>
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
            </ModelProvider>
          </ReasoningProvider>
        </ThemeProvider>
      </AppContextProvider>
    </AuthProvider>
  );
}
