import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import { DIMENSION_LABELS } from "@/lib/constants";
import { SubmissionRecord } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f8f5ed",
    color: "#1f2937",
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  hero: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    color: "#f8fafc",
    marginBottom: 18,
    padding: 20,
  },
  eyebrow: {
    color: "#fbbf24",
    fontSize: 9,
    letterSpacing: 1.4,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 11,
    lineHeight: 1.5,
  },
  scoreBadge: {
    alignItems: "center",
    backgroundColor: "#fbbf24",
    borderRadius: 999,
    color: "#111827",
    flexDirection: "row",
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: 190,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
  },
  body: {
    fontSize: 11,
    lineHeight: 1.6,
  },
  cardGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    width: "48%",
  },
  cardLabel: {
    color: "#64748b",
    fontSize: 9,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  cardValue: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  listItem: {
    marginBottom: 6,
    paddingLeft: 10,
  },
  phaseCard: {
    backgroundColor: "#fff7ed",
    borderColor: "#fdba74",
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 10,
    padding: 12,
  },
  phaseTitle: {
    color: "#9a3412",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  footer: {
    borderTopColor: "#cbd5e1",
    borderTopWidth: 1,
    color: "#475569",
    fontSize: 9,
    marginTop: 18,
    paddingTop: 10,
  },
});

function BulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item) => (
        <Text key={item} style={styles.listItem}>
          - {item}
        </Text>
      ))}
    </View>
  );
}

function DiagnosticPdf({ submission }: { submission: SubmissionRecord }) {
  const { input, scores, report } = submission;

  return (
    <Document
      author="AARIAC"
      creator="AARIAC Diagnostico IA"
      title={`Diagnostico IA - ${input.company}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>AARIAC / Diagnostico ejecutivo</Text>
          <Text style={styles.title}>Preparacion para capacitar talento en IA</Text>
          <Text style={styles.subtitle}>
            Reporte generado para {input.company}. Este documento sintetiza el nivel
            de madurez actual, las brechas prioritarias y la ruta sugerida para
            convertir la capacitacion en una ventaja competitiva.
          </Text>
          <View style={styles.scoreBadge}>
            <Text style={{ marginRight: 8 }}>{scores.overallScore}/100</Text>
            <Text>{scores.maturityLevel}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen ejecutivo</Text>
          <Text style={styles.body}>{report.summary}</Text>
          <Text style={[styles.body, { marginTop: 8 }]}>{report.businessImpact}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contexto de la empresa</Text>
          <View style={styles.cardGrid}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Sector</Text>
              <Text style={styles.body}>{input.sector}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Tamano</Text>
              <Text style={styles.body}>{input.companySize}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Cargo</Text>
              <Text style={styles.body}>{input.role}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Prioridad</Text>
              <Text style={styles.body}>{input.businessPriority}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            Generado el {new Date(submission.createdAt).toLocaleDateString("es-MX")}
            {"  "} | {"  "}Modo de redaccion: {report.aiMode}
          </Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resultado por dimension</Text>
          <View style={styles.cardGrid}>
            {Object.entries(scores.dimensionScores).map(([key, score]) => (
              <View key={key} style={styles.card}>
                <Text style={styles.cardLabel}>
                  {DIMENSION_LABELS[key as keyof typeof DIMENSION_LABELS]}
                </Text>
                <Text style={styles.cardValue}>{score}/100</Text>
                <Text style={styles.body}>
                  {report.dimensionInsights[key as keyof typeof report.dimensionInsights]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fortalezas actuales</Text>
          <BulletList items={report.strengths} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brechas prioritarias</Text>
          <BulletList items={report.priorityGaps} />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riesgos de no actuar</Text>
          <BulletList items={report.risks} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ruta sugerida</Text>
          {report.roadmap.map((phase) => (
            <View key={phase.label} style={styles.phaseCard}>
              <Text style={styles.phaseTitle}>{phase.label}</Text>
              <BulletList items={phase.items} />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enfoque de capacitacion recomendado</Text>
          <Text style={styles.body}>{report.trainingRecommendation.headline}</Text>
          <Text style={[styles.body, { marginTop: 8, fontWeight: 700 }]}>
            Publicos sugeridos
          </Text>
          <BulletList items={report.trainingRecommendation.audiences} />
          <Text style={[styles.body, { marginTop: 8, fontWeight: 700 }]}>
            Modulos sugeridos
          </Text>
          <BulletList items={report.trainingRecommendation.modules} />
        </View>

        <View style={styles.footer}>
          <Text>AARIAC | Diagnostico IA para RH Industrial</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderSubmissionPdf(submission: SubmissionRecord) {
  return renderToBuffer(<DiagnosticPdf submission={submission} />);
}
