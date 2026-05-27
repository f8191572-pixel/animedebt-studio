import "./globals.css";

export const metadata = {
  title: "AnimeDebt Studio",
  description: "Turn story ideas into production-ready anime trailer plans."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
