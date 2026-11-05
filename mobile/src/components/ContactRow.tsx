import { useEffect, useRef, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "../theme";

interface Props {
  label: string;
  value: string;
  href: string;
}

export function ContactRow({ label, value, href }: Props) {
  const t = useTheme();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shown = value.replace(/^https?:\/\/(www\.)?/, "");

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1400);
  };

  return (
    <View style={[styles.row, { borderColor: t.line }]}>
      <Text style={[styles.label, { color: t.muted }]}>{label.toUpperCase()}</Text>
      <Pressable
        style={styles.valueWrap}
        onPress={() => Linking.openURL(href)}
        accessibilityRole="link"
        accessibilityLabel={`${label}: ${shown}`}
      >
        <Text style={[styles.value, { color: t.ink }]}>{shown}</Text>
      </Pressable>
      <Pressable
        onPress={copy}
        accessibilityRole="button"
        accessibilityLabel={`Copy ${label}`}
        style={({ pressed }) => [
          styles.copy,
          { borderColor: pressed ? t.accent : t.line },
        ]}
        hitSlop={6}
      >
        <Text style={[styles.copyText, { color: t.accent }]}>{copied ? "Copied" : "Copy"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { width: 70, fontSize: 11, letterSpacing: 0.9 },
  valueWrap: { flex: 1, minWidth: 0 },
  value: { fontSize: 15, fontWeight: "500" },
  copy: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  copyText: { fontSize: 12, fontWeight: "600" },
});
