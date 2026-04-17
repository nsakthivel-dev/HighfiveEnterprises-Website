import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "../client/src/index.css";
import { Providers } from "@/components/Providers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

// Font optimization
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#6366f1", // Purple/Indigo brand color
  width: "device-width",
  initialScale: 1,
};

// Global SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Lupus Venture | Scalable Web & App Solutions for Startups",
    template: "%s | Lupus Venture",
  },
  description: "Lupus Venture is a premier tech agency specializing in building high-performance web applications, mobile apps, and custom tech solutions for visionaries and growing businesses.",
  keywords: "tech agency, web development, mobile app development, startup solutions, scalable software, Lupus Venture, UI/UX design",
  creator: "Lupus Venture",
  publisher: "Lupus Venture",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://lupusventure.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lupusventure.com",
    siteName: "Lupus Venture",
    title: "Lupus Venture | Scalable Web & App Solutions",
    description: "Engineering high-performance digital ecosystems for startups and businesses.",
    images: [
      {
        url: "/og-image.png", // Ensure this exists in public folder
        width: 1200,
        height: 630,
        alt: "Lupus Venture - Tech Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lupus Venture | Tech Solutions for Visionaries",
    description: "We build scalable web and app solutions that help businesses grow.",
    images: ["/og-image.png"],
    creator: "@lupusventure",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased min-h-screen`}>
        <Providers>
          <div className="relative flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <ChatWidget />
          </div>
        </Providers>
      </body>
    </html>
  );
}
