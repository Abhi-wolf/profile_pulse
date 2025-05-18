"use client";
import { DataProvider } from "./dataProvider";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./user-provider";

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <DataProvider>{children}</DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
