import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { buildVCard, type CardData } from "@shared";
import { useTheme } from "../theme";

interface Props {
  data: CardData;
  onExpand: () => void;
}

export function QrPanel({ data, onExpand }: Props) {
  const t = useTheme();
  const vcard = useMemo(() => buildVCard(data), [data]);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onExpand}
        accessibilityRole="button"
        accessibilityLabel="Show QR code full screen"
        style={[styles.qrBox, { borderColor: t.line }]}
      >
        <QRCode value={vcard} size={120} color="#15203a" backgroundColor="#ffffff" ecl="M" />
      </Pressable>
      <View style={styles.text}>
        <Text style={[styles.title, { color: t.ink }]}>Scan to save</Text>
        <Text style={[styles.body, { color: t.muted }]}>
          Their phone camera opens a new contact with these details. Tap the code to make it bigger.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 18, padding: 24 },
  qrBox: { backgroundColor: "#ffffff", padding: 8, borderRadius: 10, borderWidth: 1 },
  text: { flex: 1, gap: 4 },
  title: { fontSize: 18, fontWeight: "600" },
  body: { fontSize: 13.5, lineHeight: 19 },
});
