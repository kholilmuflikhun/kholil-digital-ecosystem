import { settings } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { PageHeader, Section } from "@/components/layout";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = buildMetadata({
  title: "Kebijakan Privasi",
  description: "Pelajari data yang diterima melalui situs ini, tujuan penggunaannya, penyimpanan, serta cara meminta akses, koreksi, atau penghapusan.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Kebijakan privasi", path: "/privacy" }]} />
      <PageHeader eyebrow="Legal" title="Kebijakan privasi." intro={`Terakhir diperbarui ${formatDate(settings.legalUpdatedAt)}.`} />
      <Section ruled={false}>
        <div className="prose-site">
          <p className="ui border border-border p-3 text-sm">Draf untuk ditinjau. Dokumen ini belum menjadi nasihat hukum; tinjau bersama penasihat hukum sebelum dipublikasikan sebagai kebijakan final.</p>
          <h2>Data yang dikumpulkan</h2>
          <p>Lewat formulir kontak, saya menerima nama, email dan/atau nomor WhatsApp, nama bisnis (opsional), kebutuhan, perkiraan anggaran, target waktu, dan pesan yang Anda tulis.</p>
          <p>Saya juga menyimpan sementara di browser Anda (sessionStorage) sumber kunjungan: parameter UTM, situs perujuk, dan halaman pertama yang dibuka. Data ini dikirim bersama formulir agar saya tahu dari mana Anda datang. Tidak ada cookie pelacak yang dipasang oleh situs ini.</p>
          <h2>Tujuan penggunaan</h2>
          <ul>
            <li>Membalas pertanyaan dan menyusun penawaran.</li>
            <li>Mencatat prospek di sistem internal agar tindak lanjut tidak terlewat.</li>
            <li>Memahami saluran mana yang membawa pengunjung.</li>
          </ul>
          <h2>Analitik</h2>
          <p>Bila analitik diaktifkan, situs memakai layanan analitik yang berfokus pada privasi. Isi formulir, nama, email, dan nomor telepon tidak dikirim ke layanan analitik.</p>
          <h2>Penyimpanan dan pembagian</h2>
          <p>Data formulir dikirim ke email dan sistem internal saya. Saya tidak menjual data Anda. Penyedia layanan teknis (hosting dan pengiriman email) dapat memprosesnya sebatas untuk menjalankan layanan tersebut.</p>
          <h2>Hak Anda</h2>
          <p>Anda dapat meminta akses, koreksi, atau penghapusan data Anda dengan menghubungi saya lewat halaman kontak.</p>
        </div>
      </Section>
    </>
  );
}
