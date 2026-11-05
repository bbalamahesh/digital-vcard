import { Contact } from "expo-contacts";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Share } from "react-native";
import { buildVCard, fullName, vcardFileName, type CardData } from "@shared";

/**
 * Opens the phone's own "New contact" screen with every field filled in.
 * The person reviews it and taps Save, so nothing is written without them seeing it.
 */
export async function saveToContacts(c: CardData): Promise<boolean> {
  return Contact.presentCreateForm({
    givenName: c.firstName,
    familyName: c.lastName,
    jobTitle: c.title,
    company: c.organization,
    phones: c.phone ? [{ label: "mobile", number: c.phone.replace(/\s/g, "") }] : [],
    emails: c.email ? [{ label: "work", address: c.email }] : [],
    urlAddresses: [
      ...(c.website ? [{ label: "homepage", url: c.website }] : []),
      ...c.links.map((l) => ({ label: l.label, url: l.url })),
    ],
    addresses: [{ label: "work", city: c.location.city, country: c.location.country }],
  });
}

/** Writes the vCard to a temporary file and opens the share sheet with it. */
export async function shareVCardFile(c: CardData): Promise<void> {
  const file = new File(Paths.cache, vcardFileName(c));
  if (file.exists) file.delete();
  file.create();
  file.write(buildVCard(c));

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: "text/vcard",
      UTI: "public.vcard",
      dialogTitle: `Share ${fullName(c)}'s contact`,
    });
  }
}

/** Shares a short message with the link to the web card. */
export async function shareCardLink(c: CardData): Promise<void> {
  const url = c.website ?? c.links[0]?.url ?? "";
  await Share.share({
    message: `${fullName(c)} · ${c.title}\n${url}`,
    url,
    title: fullName(c),
  });
}
