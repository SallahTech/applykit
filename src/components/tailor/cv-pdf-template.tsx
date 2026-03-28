import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CVData } from "@/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a2e" },
  name: { fontSize: 22, fontWeight: "bold", color: "#1e293b", marginBottom: 4 },
  contact: { fontSize: 9, color: "#64748b", marginBottom: 16 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#3b82f6",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#334155",
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#f8fafc",
  },
  expContainer: { marginBottom: 12 },
  expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  expCompany: { fontSize: 11, fontWeight: "bold", color: "#1e293b" },
  expDate: { fontSize: 9, color: "#94a3b8" },
  expTitle: { fontSize: 10, color: "#64748b", marginBottom: 4 },
  bullet: { fontSize: 10, color: "#334155", lineHeight: 1.5, marginBottom: 3, paddingLeft: 12 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skill: { fontSize: 9, color: "#3b82f6", padding: "3 8", backgroundColor: "#eff6ff", borderRadius: 4 },
});

interface CVPdfTemplateProps {
  cv: CVData;
}

export function CVPdfTemplate({ cv }: CVPdfTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{cv.name}</Text>
        <Text style={styles.contact}>{cv.contact}</Text>
        <Text style={styles.summary}>{cv.summary}</Text>

        <Text style={styles.sectionTitle}>Experience</Text>
        {cv.experience.map((exp, i) => (
          <View key={i} style={styles.expContainer}>
            <View style={styles.expHeader}>
              <Text style={styles.expCompany}>{exp.company}</Text>
              <Text style={styles.expDate}>{exp.dateRange}</Text>
            </View>
            <Text style={styles.expTitle}>{exp.title}</Text>
            {exp.bullets.map((b, j) => (
              <Text key={j} style={styles.bullet}>• {b.text}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsRow}>
          {cv.skills.map((s, i) => (
            <Text key={i} style={styles.skill}>{s.name}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
