import { settings } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { PageHeader, Section } from "@/components/layout";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = buildMetadata({
  title: "Syarat dan Ketentuan",
  description: "Pahami ketentuan umum penggunaan situs, pemesanan, pembayaran, revisi, hak atas hasil kerja, dan produksi fisik.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Syarat dan ketentuan", path: "/terms" }]} />
      <PageHeader eyebrow="Legal" title="Syarat dan ketentuan." intro={`Terakhir diperbarui ${formatDate(settings.legalUpdatedAt)}.`} />
      <Section ruled={false}>
        <div className="prose-site">
          <p className="ui border border-rule p-3 text-sm">Draf untuk ditinjau. Ketentuan final setiap proyek tetap mengikuti proposal atau perjanjian tertulis yang disepakati.</p>
          <h2>Informasi di website</h2>
          <p>Konten di website ini bersifat informasi umum dan bukan penawaran yang mengikat. Ruang lingkup, biaya, dan jadwal ditetapkan dalam proposal tertulis yang disepakati kedua pihak.</p>
          <h2>Pemesanan dan pembayaran</h2>
          <p>Pengerjaan dimulai setelah ruang lingkup dan ketentuan pembayaran disepakati. Detail pembayaran tercantum dalam proposal.</p>
          <h2>Revisi</h2>
          <p>Jumlah revisi yang termasuk ditetapkan di proposal. Permintaan di luar ruang lingkup dapat dikenai biaya tambahan yang disepakati lebih dulu.</p>
          <h2>Hak kekayaan intelektual</h2>
          <p>Pengalihan hak atas hasil kerja diatur dalam proposal atau perjanjian. Saya dapat menampilkan karya dalam portofolio hanya dengan persetujuan klien.</p>
          <h2>Produksi fisik</h2>
          <p>Estimasi, kapasitas, dan ketersediaan produksi fisik (cetak, sablon, apparel) dikonfirmasi per pesanan dan dapat berbeda antarpesanan.</p>
          <h2>Perubahan</h2>
          <p>Ketentuan ini dapat diperbarui. Versi terbaru selalu berada di halaman ini.</p>
        </div>
      </Section>
    </>
  );
}
