import type { Testimonial } from "./schemas";

/**
 * Kosong dengan sengaja. Tambahkan HANYA testimoni asli yang sudah disetujui pelanggan:
 * { id, quote, name, role?, business?, consent: true, givenAt: "YYYY-MM-DD" }
 * Selama kosong, bagian testimoni tidak ditampilkan.
 */
export const testimonials: Testimonial[] = [];
