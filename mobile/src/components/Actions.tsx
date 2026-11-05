import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import type { CardData } from "@shared";
import { saveToContacts, shareCardLink, shareVCardFile } from "../lib/contact";
import { useTheme } from "../theme";

interface Props {
  data: CardData;
  onShowQr: () => void;
}

export function Actions({ data, onShowQr }: Props) {
  const t = useTheme();

  const run = (fn: () => Promise<unknown>, what: string) => async () => {
    try {
      await fn();
    } catch (e) {
      Alert.alert(`Couldn't ${what}`, e instanceof Error ? e.message : "Please try again.");
    }
  };

  const secondary = [
    { label: "Show QR", onPress: onShowQr },
    { label: "Share link", onPress: run(() => shareCardLink(data), "share the link") },
    { label: "Send vCard", onPress: run(() => shareVCardFile(data), "share the contact file") },
  ];

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={run(() => saveToContacts(data), "open Contacts")}
        accessibilityRole="button"
        style={({ pressed }) => [styles.primary, { backgroundColor: t.accent, opacity: pressed ? 0.85 : 1 }]}
      >
        <Text style={[styles.primaryText, { color: t.onAccent }]}>Save to Contacts</Text>
      </Pressable>

      <View style={styles.row}>
        {secondary.map((b) => (
          <Pressable
            key={b.label}
            onPress={b.onPress}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.secondary,
              { borderColor: pressed ? t.accent : t.line },
            ]}
          >
            <Text style={[styles.secondaryText, { color: t.ink }]}>{b.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 24, paddingBottom: 22, gap: 8 },
  primary: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  primaryText: { fontSize: 15, fontWeight: "600" },
  row: { flexDirection: "row", gap: 8 },
  secondary: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 11, alignItems: "center" },
  secondaryText: { fontSize: 13, fontWeight: "500" },
});
