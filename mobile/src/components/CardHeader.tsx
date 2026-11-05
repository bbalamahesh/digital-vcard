import { StyleSheet, Text, View } from "react-native";
import { fullName, type CardData } from "@shared";
import { mono, useTheme } from "../theme";

export function CardHeader({ data }: { data: CardData }) {
  const t = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.avatar, { backgroundColor: t.accent }]}>
        <Text style={[styles.initials, { color: t.onAccent }]}>{data.initials}</Text>
      </View>

      {data.available && (
        <Text style={[styles.tag, { color: t.muted }]}>
          {"<"}
          <Text style={{ color: t.accent }}>Developer</Text>
          {" available />"}
        </Text>
      )}

      <Text style={[styles.name, { color: t.ink }]} accessibilityRole="header">
        {fullName(data)}
      </Text>
      <Text style={[styles.role, { color: t.muted }]}>
        {data.title} · {data.location.city}, {data.location.country}
      </Text>

      <View style={styles.skills} accessibilityLabel={`Skills: ${data.skills.join(", ")}`}>
        {data.skills.map((s) => (
          <Text key={s} style={[styles.chip, { backgroundColor: t.accentSoft, color: t.accent }]}>
            {s}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 18, gap: 12 },
  avatar: { width: 56, height: 56, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  initials: { fontSize: 22, fontWeight: "700" },
  tag: { fontFamily: mono, fontSize: 12.5 },
  name: { fontSize: 32, lineHeight: 36, fontWeight: "700", letterSpacing: -0.6 },
  role: { fontSize: 15.5 },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    fontFamily: mono,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
});
