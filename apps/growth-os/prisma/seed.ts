/**
 * Seed data DEMO. Semua baris ditandai isDemo = true dan dapat dihapus lewat
 * Settings → "Hapus data demo". Akun demo: demo@growthos.app / demo12345
 */
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, subDays, startOfDay } from "date-fns";
import { DEFAULT_30_DAY_PHASES } from "../lib/constants/campaign-template";

const db = new PrismaClient();
const D = (n: number) => new Prisma.Decimal(n);
const today = startOfDay(new Date());
const ago = (days: number) => subDays(today, days);
const ahead = (days: number) => addDays(today, days);

async function main() {
  const email = "demo@growthos.app";
  await db.user.deleteMany({ where: { email } });

  const user = await db.user.create({
    data: {
      email,
      name: "Demo User",
      passwordHash: await bcrypt.hash("demo12345", 12),
      currency: "IDR",
      isDemo: true,
      settings: {
        create: {
          averageOrderValue: D(1_500_000),
          conversionRate: D(0.25),
          qualificationRate: D(0.4),
          responseRate: D(0.3),
        },
      },
      strategy: {
        create: {
          vision: "[DEMO] Menjadi studio desain & cetak pilihan UMKM lokal.",
          mission: "[DEMO] Membantu UMKM tampil profesional dengan harga terjangkau.",
          positioning: "[DEMO] Desain + produksi satu pintu untuk UMKM kuliner dan fashion.",
          valueProposition: "[DEMO] Dari ide sampai barang jadi tanpa repot koordinasi banyak vendor.",
          idealCustomer: "[DEMO] Pemilik UMKM dengan omzet menengah yang butuh branding konsisten.",
          acquisitionChannels: "[DEMO] Instagram, referral pelanggan, WhatsApp.",
          growthStrategy: "[DEMO] Naikkan nilai pesanan lewat paket, lalu bangun produk digital.",
          competitiveEdge: "[DEMO] Proses cepat dan revisi jelas.",
        },
      },
    },
  });
  const userId = user.id;

  // Offers
  const offerData = [
    { name: "Logo Design", category: "Design", price: 1_500_000, cost: 300_000, deliveryDays: 5, revisionLimit: 3 },
    { name: "Brand Identity Package", category: "Design", price: 6_000_000, cost: 1_200_000, deliveryDays: 14, revisionLimit: 5 },
    { name: "Social Media Content Pack (12 post)", category: "Content", price: 2_500_000, cost: 500_000, deliveryDays: 7, revisionLimit: 2 },
    { name: "Landing Page", category: "Digital", price: 4_500_000, cost: 800_000, deliveryDays: 10, revisionLimit: 3 },
    { name: "Custom Apparel (50 pcs)", category: "Production", price: 5_000_000, cost: 4_100_000, deliveryDays: 12, revisionLimit: 1 },
    { name: "Packaging Design", category: "Design", price: 3_000_000, cost: 600_000, deliveryDays: 8, revisionLimit: 3 },
  ];
  const offers = [];
  for (const o of offerData) {
    offers.push(
      await db.offer.create({
        data: {
          userId, isDemo: true, name: o.name, category: o.category,
          price: D(o.price), cost: D(o.cost), deliveryDays: o.deliveryDays,
          revisionLimit: o.revisionLimit, targetCustomer: "UMKM",
          description: "[DEMO] Contoh penawaran.",
          salesMessage: `[DEMO] Hai kak, untuk kebutuhan ${o.name.toLowerCase()} kami punya paket yang pas.`,
        },
      }),
    );
  }

  // Content
  const contentData = [
    { title: "5 kesalahan logo UMKM", platform: "INSTAGRAM", pillar: "EDUCATION", status: "PUBLISHED", day: 20, reach: 18400, visits: 920, dms: 41 },
    { title: "Before–after rebrand kedai kopi", platform: "INSTAGRAM", pillar: "CASE_STUDY", status: "PUBLISHED", day: 14, reach: 25600, visits: 1500, dms: 63 },
    { title: "Proses desain kemasan", platform: "TIKTOK", pillar: "BEHIND_THE_SCENES", status: "PUBLISHED", day: 9, reach: 41000, visits: 800, dms: 22 },
    { title: "Paket branding bulan ini", platform: "INSTAGRAM", pillar: "SELLING", status: "PUBLISHED", day: 5, reach: 9800, visits: 610, dms: 30 },
    { title: "Kenapa konsistensi visual penting", platform: "LINKEDIN", pillar: "THOUGHT_LEADERSHIP", status: "PUBLISHED", day: 3, reach: 6200, visits: 240, dms: 9 },
    { title: "Katalog portofolio terbaru", platform: "WEBSITE", pillar: "PORTFOLIO", status: "SCHEDULED", day: -2, reach: 0, visits: 0, dms: 0 },
    { title: "Cerita di balik studio", platform: "INSTAGRAM", pillar: "PERSONAL_BRAND", status: "DRAFT", day: -4, reach: 0, visits: 0, dms: 0 },
  ] as const;
  const contents = [];
  for (const c of contentData) {
    contents.push(
      await db.content.create({
        data: {
          userId, isDemo: true, title: c.title, platform: c.platform, pillar: c.pillar,
          status: c.status, publishDate: c.day >= 0 ? ago(c.day) : ahead(-c.day),
          reach: c.reach, profileVisits: c.visits, dms: c.dms, cta: "DM untuk konsultasi gratis",
          format: c.platform === "TIKTOK" ? "reel" : "carousel",
          offerId: offers[c.pillar === "SELLING" ? 1 : 0].id,
        },
      }),
    );
  }

  // Customers
  const customerNames = [
    ["Kedai Kopi Senja", "Rina Wijaya"],
    ["Batik Lestari", "Sari Lestari"],
    ["Toko Roti Manis", "Budi Santoso"],
    ["Fit Gear Store", "Dimas Pratama"],
    ["Warung Nusantara", "Ayu Kartika"],
  ];
  const customers = [];
  for (const [i, [biz, name]] of customerNames.entries()) {
    customers.push(
      await db.customer.create({
        data: {
          userId, isDemo: true, name, businessName: biz,
          email: `demo.customer${i + 1}@example.com`,
          referralSource: i === 4 ? "Referral" : "Instagram",
          referredById: i === 4 ? undefined : undefined,
          notes: "[DEMO] Pelanggan contoh.",
        },
      }),
    );
  }
  // Referral: pelanggan ke-5 direkomendasikan pelanggan ke-1
  await db.customer.update({ where: { id: customers[4].id }, data: { referredById: customers[0].id } });
  await db.referral.create({
    data: { userId, isDemo: true, referrerId: customers[0].id, referredName: "Ayu Kartika", resultingRevenue: D(3_000_000) },
  });
  await db.testimonial.createMany({
    data: [
      { userId, isDemo: true, customerId: customers[0].id, quote: "[DEMO] Hasilnya rapi dan cepat, pelanggan kami jadi lebih percaya.", rating: 5, isPublic: true },
      { userId, isDemo: true, customerId: customers[1].id, quote: "[DEMO] Komunikasinya enak, revisi jelas.", rating: 5, isPublic: false },
    ],
  });

  // Prospects & deals
  const stages = ["LEAD", "CONTACTED", "QUALIFIED", "DISCOVERY", "PROPOSAL", "PROPOSAL", "NEGOTIATION", "LOST"] as const;
  const prospectStatus: Record<(typeof stages)[number], "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL_SENT" | "NEGOTIATION" | "LOST" | "RESPONDED"> = {
    LEAD: "NEW", CONTACTED: "CONTACTED", QUALIFIED: "QUALIFIED", DISCOVERY: "RESPONDED",
    PROPOSAL: "PROPOSAL_SENT", NEGOTIATION: "NEGOTIATION", LOST: "LOST",
  } as never;
  const prospectBiz = [
    "Studio Yoga Asri", "Bakery Pagi", "Katering Bu Tini", "Barber Klasik",
    "Distro Urban", "Klinik Gigi Ceria", "Toko Herbal Sehat", "Kopi Gunung",
  ];
  const probs = [5, 10, 25, 40, 55, 50, 75, 0];
  for (const [i, stage] of stages.entries()) {
    const prospect = await db.prospect.create({
      data: {
        userId, isDemo: true, name: `Kontak ${prospectBiz[i]}`, businessName: prospectBiz[i],
        whatsapp: `+62812000000${i}`, source: i % 2 === 0 ? "Instagram" : "Cold outreach",
        isColdOutreach: i % 2 === 1, industry: "UMKM", location: "Indonesia",
        potentialValue: D(offerData[i % offerData.length].price), probability: probs[i],
        status: prospectStatus[stage] ?? "CONTACTED",
        lastContactAt: ago(i + 1), nextFollowUpAt: i < 3 ? ago(1) : ahead(i),
        offerId: offers[i % offers.length].id, contentId: contents[i % 5].id,
        notes: "[DEMO] Prospek contoh.",
      },
    });
    await db.deal.create({
      data: {
        userId, isDemo: true, name: `${prospectBiz[i]} — ${offerData[i % offerData.length].name}`,
        prospectId: prospect.id, offerId: offers[i % offers.length].id, contentId: contents[i % 5].id,
        stage, value: D(offerData[i % offerData.length].price), probability: probs[i],
        expectedCloseDate: ahead(5 + i * 3),
        lostReason: stage === "LOST" ? "Budget belum tersedia" : undefined,
        nextAction: stage === "LOST" ? undefined : "Follow-up via WhatsApp",
      },
    });
  }

  // Won deals + projects + revenue (3 bulan terakhir)
  const wonPlan = [
    { c: 0, o: 1, days: 75, status: "PAID" }, { c: 1, o: 4, days: 60, status: "PAID" },
    { c: 2, o: 0, days: 48, status: "PAID" }, { c: 0, o: 2, days: 40, status: "PAID" },
    { c: 3, o: 4, days: 30, status: "PAID" }, { c: 1, o: 5, days: 22, status: "PAID" },
    { c: 4, o: 3, days: 12, status: "PARTIAL" }, { c: 2, o: 2, days: 6, status: "PENDING" },
    { c: 3, o: 1, days: 2, status: "OVERDUE" },
  ] as const;
  for (const [i, w] of wonPlan.entries()) {
    const offer = offers[w.o];
    const prospect = await db.prospect.create({
      data: {
        userId, isDemo: true, name: customers[w.c].name, businessName: customers[w.c].businessName,
        status: "WON", probability: 100, potentialValue: offer.price, source: "Instagram",
        contentId: contents[i % 4].id, offerId: offer.id,
      },
    });
    const deal = await db.deal.create({
      data: {
        userId, isDemo: true, name: `${customers[w.c].businessName} — ${offer.name}`,
        prospectId: prospect.id, customerId: customers[w.c].id, offerId: offer.id,
        contentId: contents[i % 4].id, stage: "WON", value: offer.price, probability: 100,
        closedAt: ago(w.days), createdAt: ago(w.days + 9),
      },
    });
    const completed = w.days > 14;
    const project = await db.project.create({
      data: {
        userId, isDemo: true, name: `${offer.name} — ${customers[w.c].businessName}`,
        customerId: customers[w.c].id, dealId: deal.id, offerId: offer.id,
        status: completed ? "COMPLETED" : w.days > 5 ? "IN_PROGRESS" : "PLANNING",
        deadline: completed ? ago(w.days - 10) : ahead(7), value: offer.price, cost: offer.cost,
        completion: completed ? 100 : w.days > 5 ? 60 : 10, hoursSpent: D(8 + i * 3),
        revisions: i % 3, completedAt: completed ? ago(w.days - 10) : undefined,
      },
    });
    const revenue = await db.revenue.create({
      data: {
        userId, isDemo: true, date: ago(w.days), customerId: customers[w.c].id, offerId: offer.id,
        dealId: deal.id, projectId: project.id, grossRevenue: offer.price, cost: offer.cost,
        paymentStatus: w.status, paymentMethod: "Transfer bank", channel: "Instagram",
        reference: `INV-DEMO-${String(i + 1).padStart(3, "0")}`,
        dueDate: w.status === "OVERDUE" ? ago(1) : ahead(7),
      },
    });
    if (w.status === "PAID" || w.status === "PARTIAL") {
      await db.payment.create({
        data: {
          userId, revenueId: revenue.id, paidAt: ago(Math.max(0, w.days - 1)), method: "Transfer bank",
          amount: w.status === "PARTIAL" ? offer.price.div(2) : offer.price,
        },
      });
    }
  }

  await db.expense.createMany({
    data: [
      { userId, isDemo: true, date: ago(50), category: "Iklan", amount: D(750_000) },
      { userId, isDemo: true, date: ago(25), category: "Tools & software", amount: D(450_000) },
      { userId, isDemo: true, date: ago(8), category: "Iklan", amount: D(600_000) },
    ],
  });

  // Campaign 30 hari + goals
  const campaign = await db.campaign.create({
    data: {
      userId, isDemo: true, name: "[DEMO] Kampanye 30 Hari", durationDays: 30,
      startDate: ago(12), endDate: ahead(17), status: "ACTIVE",
      goalSummary: "Contoh kampanye berbasis template 30 hari.",
      revenueTarget: D(30_000_000), salesTarget: 12, contentTarget: 20, prospectTarget: 100,
      milestones: DEFAULT_30_DAY_PHASES as unknown as Prisma.InputJsonValue,
      kpis: [
        { key: "prospects", label: "Prospek", target: 100 },
        { key: "proposals", label: "Proposal", target: 20 },
        { key: "sales", label: "Penjualan", target: 12 },
      ],
    },
  });
  const goalData = [
    { name: "Pendapatan kampanye", category: "REVENUE", metric: "IDR", target: 30_000_000, current: 17_500_000 },
    { name: "Profit kampanye", category: "PROFIT", metric: "IDR", target: 12_000_000, current: 6_400_000 },
    { name: "Pelanggan baru", category: "CUSTOMERS", metric: "pelanggan", target: 8, current: 4 },
    { name: "Prospek baru", category: "LEADS", metric: "prospek", target: 100, current: 46 },
    { name: "Konten terbit", category: "CONTENT", metric: "konten", target: 20, current: 9 },
    { name: "Proyek selesai", category: "PROJECTS", metric: "proyek", target: 10, current: 5 },
  ] as const;
  for (const g of goalData) {
    await db.goal.create({
      data: {
        userId, isDemo: true, campaignId: campaign.id, name: g.name, category: g.category,
        metric: g.metric, targetValue: D(g.target), currentValue: D(g.current),
        startDate: ago(12), endDate: ahead(17), priority: g.category === "REVENUE" ? "HIGH" : "MEDIUM",
      },
    });
  }

  // Tugas harian + scorecard
  const taskData = [
    { title: "Follow-up 3 prospek panas", category: "FOLLOW_UP", priority: "HIGH", status: "TODO", min: 45 },
    { title: "Terbitkan 1 konten edukasi", category: "CONTENT", priority: "MEDIUM", status: "IN_PROGRESS", min: 60 },
    { title: "Kirim proposal ke Distro Urban", category: "SALES", priority: "HIGH", status: "TODO", min: 30 },
    { title: "Hubungi 10 prospek baru", category: "PROSPECTING", priority: "HIGH", status: "DONE", min: 60 },
    { title: "Kirim revisi logo ke Toko Roti Manis", category: "DELIVERY", priority: "MEDIUM", status: "DONE", min: 40 },
    { title: "Rapikan price list", category: "STRATEGIC", priority: "LOW", status: "SKIPPED", min: 30 },
  ] as const;
  for (const t of taskData) {
    await db.task.create({
      data: {
        userId, isDemo: true, campaignId: campaign.id, campaignDay: 13, title: t.title,
        category: t.category, priority: t.priority, status: t.status,
        estimatedMinutes: t.min, dueDate: today,
        completedAt: t.status === "DONE" ? new Date() : undefined,
      },
    });
  }
  for (let i = 1; i <= 10; i++) {
    await db.dailyActivity.create({
      data: {
        userId, isDemo: true, date: ago(i), prospectsContacted: 6 + (i % 5), responses: 2 + (i % 3),
        qualifiedLeads: i % 3, followUps: 3 + (i % 4), proposals: i % 2, dealsWon: i % 5 === 0 ? 1 : 0,
        contentPublished: i % 2, hoursWorked: D(5 + (i % 4)),
      },
    });
  }

  console.log("Seed demo selesai. Login: demo@growthos.app / demo12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
