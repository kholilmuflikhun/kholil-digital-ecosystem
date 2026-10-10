/**
 * Tanda overprint: dua warna proses cetak yang saling menumpuk. Dekoratif-informatif,
 * bukan data. Label teks menjelaskan makna bagi pembaca layar.
 */
export function OverprintMark({ className = "", label = "Desain dan teknologi bertemu di satu tempat" }: { className?: string; label?: string }) {
  return (
    <div role="img" aria-label={label} className={`overprint ${className}`}>
      <span className="overprint-layer overprint-cyan" aria-hidden="true" />
      <span className="overprint-layer overprint-magenta" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="ui absolute bottom-0 left-0 text-xs font-medium uppercase tracking-[0.16em] text-quiet"
      >
        Desain
      </span>
      <span
        aria-hidden="true"
        className="ui absolute bottom-0 right-0 text-xs font-medium uppercase tracking-[0.16em] text-quiet"
      >
        Teknologi
      </span>
    </div>
  );
}
