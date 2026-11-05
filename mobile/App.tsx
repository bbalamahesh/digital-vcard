import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { card } from "@shared";
import { CardHeader } from "./src/components/CardHeader";
import { Actions } from "./src/components/Actions";
import { ContactRow } from "./src/components/ContactRow";
import { QrPanel } from "./src/components/QrPanel";
import { FullScreenQr } from "./src/components/FullScreenQr";
import { useTheme } from "./src/theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <CardScreen />
    </SafeAreaProvider>
  );
}

function CardScreen() {
  const t = useTheme();
  const [qrOpen, setQrOpen] = useState(false);

  const rows = [
    card.phone && { label: "Phone", value: card.phone, href: `tel:${card.phone.replace(/\s/g, "")}` },
    card.email && { label: "Email", value: card.email, href: `mailto:${card.email}` },
    card.website && { label: "Website", value: card.website, href: card.website },
    ...card.links.map((l) => ({ label: l.label, value: l.url, href: l.url })),
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: t.page }]} edges={["top", "left", "right"]}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
          <CardHeader data={card} />
          <Actions data={card} onShowQr={() => setQrOpen(true)} />
          <View style={[styles.rows, { borderColor: t.line }]}>
            {rows.map((r) => (
              <ContactRow key={r.label} {...r} />
            ))}
          </View>
          <QrPanel data={card} onExpand={() => setQrOpen(true)} />
        </View>
        <Text style={[styles.foot, { color: t.muted }]}>vCard 3.0 · works offline</Text>
      </ScrollView>
      <FullScreenQr data={card} visible={qrOpen} onClose={() => setQrOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  card: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    shadowColor: "#14203c",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  rows: { borderTopWidth: StyleSheet.hairlineWidth },
  foot: { textAlign: "center", fontFamily: "monospace", fontSize: 11.5, marginTop: 14 },
});
