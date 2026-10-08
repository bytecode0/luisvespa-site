import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-32">
      <p className="label">Error / 404</p>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink">No route to this page.</h1>
      <p className="mt-4 text-muted">
        Try the <Link href="/" className="text-accent hover:text-ink">home page</Link>, or press ⌘K to search.
      </p>
    </Container>
  );
}
