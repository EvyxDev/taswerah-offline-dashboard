"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type ExportStatsResponse = {
  photographers: { id: number; name: string; total_photos: number }[];
  daily_stats: {
    date: string;
    total_paid: number;
    shifts: { shift_id: number; amount_paid: number }[];
  }[];
};

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10, color: "#0f172a" },
  header: { marginBottom: 16 },
  brand: { fontSize: 18, fontWeight: 700 },
  subtitle: { marginTop: 4, fontSize: 11, color: "#64748b" },
  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  th: { fontSize: 10, fontWeight: 700, color: "#374151" },
  tableRow: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10 },
  tableRowAlt: { backgroundColor: "#fafafa" },
  td: { fontSize: 10, color: "#111827" },
  colLeft: { flex: 2 },
  colRight: { flex: 1, textAlign: "right" },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  dayTitle: { fontSize: 11, fontWeight: 700 },
  dayAmount: { fontSize: 11, fontWeight: 700 },
  shiftsHeader: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
  },
  footer: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    color: "#64748b",
    fontSize: 9,
    textAlign: "center",
  },
});

export default function ExportDocument({
  data,
  periodLabel,
}: {
  data: ExportStatsResponse;
  periodLabel?: string;
}) {
  const totalPhotos = data.photographers.reduce(
    (sum, p) => sum + (p.total_photos || 0),
    0
  );
  const totalPaid = data.daily_stats.reduce(
    (sum, d) => sum + (d.total_paid || 0),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Taswera — Branch Export</Text>
          <Text style={styles.subtitle}>
            {periodLabel ? periodLabel : "All time"} • Total Paid: {totalPaid} •
            Total Photos: {totalPhotos}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photographers</Text>
          <View style={styles.card}>
            <View style={styles.tableHeader}>
              <View style={styles.colLeft}>
                <Text style={styles.th}>Name</Text>
              </View>
              <View style={styles.colRight}>
                <Text style={styles.th}>Total Photos</Text>
              </View>
            </View>
            {data.photographers.map((p, idx) => (
              <View
                key={p.id}
                style={[
                  styles.tableRow,
                  idx % 2 === 0 ? styles.tableRowAlt : null,
                ]}
              >
                <View style={styles.colLeft}>
                  <Text style={styles.td}>{p.name}</Text>
                </View>
                <View style={styles.colRight}>
                  <Text style={styles.td}>{p.total_photos}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Stats</Text>
          <View style={styles.card}>
            {data.daily_stats.map((d, i) => (
              <View key={d.date}>
                <View
                  style={[
                    styles.dayHeader,
                    i !== 0
                      ? { borderTopWidth: 1, borderTopColor: "#e5e7eb" }
                      : null,
                  ]}
                >
                  <Text style={styles.dayTitle}>{d.date}</Text>
                  <Text style={styles.dayAmount}>
                    Total Paid: {d.total_paid}
                  </Text>
                </View>
                <View style={styles.shiftsHeader}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.th}>Shift</Text>
                  </View>
                  <View style={{ flex: 1, textAlign: "right" }}>
                    <Text style={styles.th}>Amount Paid</Text>
                  </View>
                </View>
                {d.shifts.map((s, idx) => (
                  <View
                    key={s.shift_id}
                    style={[
                      styles.tableRow,
                      idx % 2 === 0 ? styles.tableRowAlt : null,
                    ]}
                  >
                    <View style={styles.colLeft}>
                      <Text style={styles.td}>#{s.shift_id}</Text>
                    </View>
                    <View style={styles.colRight}>
                      <Text style={styles.td}>{s.amount_paid}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Generated by Taswera Dashboard</Text>
        </View>
      </Page>
    </Document>
  );
}
