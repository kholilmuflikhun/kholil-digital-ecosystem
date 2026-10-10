/** Menyisipkan JSON-LD. `<` di-escape agar string konten tidak bisa menutup tag script. */
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
