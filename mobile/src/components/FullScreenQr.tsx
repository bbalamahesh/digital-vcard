import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { buildVCard, fullName, type CardData } from "@shared";

type Mode = "contact" | "link";

interface Props {
  data: CardData;
  visible: boolean;
  onClose: () => void;
}

/** Big, high-contrast QR for showing at events. Always white so any camera reads it. */
export function FullScreenQr({ data, visible, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      {visible && <QrSheet data={data} onClose={onClose} />}
    </Modal>
  );
}

function QrSheet({ data, onClose }: Omit<Props, "visible">) {
  useKeepAwake(); // screen stays on while the code is showing
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const hasLink = Boolean(data.website);
  const [mode, setMode] = useState<Mode>("contact");

  const value = useMemo(
    () => (mode === "link" && data.website ? data.website : buildVCard(data)),
    [mode, data],
  );
  const size = Math.min(width - 64, 340);

  return (
    <View style={[styles.sheet, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }]}>
      <Pressable onPress={onClose} accessibilityRole="button" style={styles.close} hitSlop={10}>
        <Text style={styles.closeText}>Done</Text>
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.name}>{fullName(data)}</Text>
        <Text style={styles.role}>{data.title}</Text>
        <View style={styles.qr}>
          <QRCode value={value} size={size} color="#15203a" backgroundColor="#ffffff" ecl="M" />
        </View>
        <Text style={styles.hint}>
          {mode === "contact"
            ? "Scan with the camera to save this contact"
            : "Scan with the camera to open the card page"}
        </Text>
      </View>

      {hasLink && (
        <View style={styles.toggle} accessibilityRole="tablist">
          {(["contact", "link"] as const).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === m }}
              style={[styles.seg, mode === m && styles.segOn]}
            >
              <Text style={[styles.segText, mode === m && styles.segTextOn]}>
                {m === "contact" ? "Contact" : "Card page"}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 24, justifyContent: "space-between" },
  close: { alignSelf: "flex-end", paddingVertical: 6 },
  closeText: { color: "#2a5bd7", fontSize: 16, fontWeight: "600" },
  center: { alignItems: "center", gap: 6 },
  name: { color: "#15203a", fontSize: 26, fontWeight: "700", letterSpacing: -0.4 },
  role: { color: "#5b6478", fontSize: 15, marginBottom: 20 },
  qr: { padding: 4 },
  hint: { color: "#5b6478", fontSize: 14, marginTop: 18, textAlign: "center" },
  toggle: { flexDirection: "row", backgroundColor: "#e9ecf1", borderRadius: 12, padding: 4 },
  seg: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: "center" },
  segOn: { backgroundColor: "#ffffff" },
  segText: { color: "#5b6478", fontSize: 14, fontWeight: "500" },
  segTextOn: { color: "#15203a", fontWeight: "600" },
});
