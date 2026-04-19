import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const BRAND = {
  primary: "#bb4d00",
  primaryLight: "#f5e6dc",
  dark: "#1a1a2e",
  gray: "#6b7280",
  lightGray: "#f3f4f6",
  white: "#ffffff",
  accent: "#ff6b35",
};

const drawRoundedRect = (doc, x, y, w, h, r, fillColor) => {
  doc.setFillColor(fillColor);
  doc.roundedRect(x, y, w, h, r, r, "F");
};

export const generatePdf = (campaign, contributors) => {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // ── Header Banner ──────────────────────────────────────────────
  doc.setFillColor(BRAND.primary);
  doc.rect(0, 0, pageW, 48, "F");

  // Decorative circle top-right
  doc.setFillColor(BRAND.accent);
  doc.setGState(new doc.GState({ opacity: 0.18 }));
  doc.circle(pageW - 10, 0, 38, "F");
  doc.setGState(new doc.GState({ opacity: 1 }));

  // Logo / brand name
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.white);
  doc.setCharSpace(2);
  doc.text("mmoa", 14, 13);
  doc.setCharSpace(0);

  // Campaign title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.white);
  doc.text(campaign.title, 14, 28, { maxWidth: pageW - 28 });

  // Sub-label
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#ffd4b8");
  doc.text("Contributors Report", 14, 38);

  // Date — top right
  doc.setFontSize(8);
  doc.setTextColor("#ffd4b8");
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`,
    pageW - 14,
    38,
    { align: "right" },
  );

  // ── Summary Cards ──────────────────────────────────────────────
  const cardY = 56;
  const cardH = 28;
  const cardW = (pageW - 28 - 8) / 2;

  const totalRaised =
    typeof campaign.totalRaised === "number"
      ? campaign.totalRaised
      : parseFloat(String(campaign.totalRaised).replace(/[^0-9.]/g, "")) || 0;
  const target =
    typeof campaign.targetAmount === "number"
      ? campaign.targetAmount
      : parseFloat(String(campaign.targetAmount).replace(/[^0-9.]/g, "")) || 1;
  const progress = Math.min(100, Math.round((totalRaised / target) * 100));

  // Card 1 – Total Raised
  drawRoundedRect(doc, 14, cardY, cardW, cardH, 3, BRAND.primaryLight);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(BRAND.primary);
  doc.text("TOTAL RAISED", 20, cardY + 9);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.dark);
  doc.text(`GHS ${Number(totalRaised).toLocaleString()}`, 20, cardY + 20);

  // Card 2 – Target
  const card2X = 14 + cardW + 8;
  drawRoundedRect(doc, card2X, cardY, cardW, cardH, 3, BRAND.lightGray);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(BRAND.gray);
  doc.text("TARGET AMOUNT", card2X + 6, cardY + 9);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.dark);
  doc.text(`GHS ${Number(target).toLocaleString()}`, card2X + 6, cardY + 20);

  // ── Progress Bar ───────────────────────────────────────────────
  const barY = cardY + cardH + 8;
  const barH = 5;
  const barW = pageW - 28;

  // Track
  doc.setFillColor("#e5e7eb");
  doc.roundedRect(14, barY, barW, barH, 2, 2, "F");

  // Fill
  doc.setFillColor(BRAND.primary);
  doc.roundedRect(14, barY, (barW * progress) / 100, barH, 2, 2, "F");

  // Label
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(BRAND.gray);
  doc.text(`${progress}% of goal reached`, 14, barY + barH + 5);

  doc.setTextColor(BRAND.gray);
  doc.text(
    `${contributors.length} contributor${contributors.length !== 1 ? "s" : ""}`,
    pageW - 14,
    barY + barH + 5,
    { align: "right" },
  );

  // ── Contributors Table ─────────────────────────────────────────
  const tableStartY = barY + barH + 13;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.dark);
  doc.text("Contributors", 14, tableStartY);

  autoTable(doc, {
    startY: tableStartY + 4,
    head: [["#", "Name", "Amount (GHS)", "Date"]],
    body: contributors.map((c, i) => [
      i + 1,
      c.contributorName || "Anonymous",
      Number(c.amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      new Date(c.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    ]),
    headStyles: {
      fillColor: BRAND.primary,
      textColor: BRAND.white,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center", textColor: BRAND.gray },
      2: { halign: "right" },
      3: { halign: "center" },
    },
    alternateRowStyles: {
      fillColor: BRAND.lightGray,
    },
    bodyStyles: {
      fontSize: 8.5,
      cellPadding: 4,
      textColor: BRAND.dark,
    },
    tableLineColor: "#e5e7eb",
    tableLineWidth: 0.2,
    margin: { left: 14, right: 14 },
  });

  // ── Footer ─────────────────────────────────────────────────────
  const footerY = pageH - 12;
  doc.setDrawColor("#e5e7eb");
  doc.setLineWidth(0.3);
  doc.line(14, footerY - 4, pageW - 14, footerY - 4);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(BRAND.gray);
  doc.text("Generated by mmoa", 14, footerY);
  doc.text(`Page 1`, pageW - 14, footerY, { align: "right" });

  doc.save(`mmoa-${campaign.title}-contributors.pdf`);
};
