import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 border-t mt-2">
      <div className="container flex flex-col items-center justify-around space-y-4 md:flex-row md:space-y-0">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ProfilePulse. All rights reserved.
        </p>
        {/* <nav className="flex space-x-4">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:underline"
          >
            Contact
          </Link>
        </nav> */}

        <div className="flex space-x-1 text-muted-foreground text-sm">
          Made with ❤️ by{" "}
          <Link
            href="https://portfolio-ruby-rho-64.vercel.app/"
            className="text-blue-500 hover:underline ml-1"
            target="_blank"
          >
            {" "}
            @Abhijeet
          </Link>
        </div>
      </div>
    </footer>
  );
}
