import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CvData } from "../../types/cv";
import type { CompactTheme } from "./theme";

const fontSizeMap = { sm: 8, md: 9, lg: 10 };

function makeStyles(theme: CompactTheme) {
  const fs = fontSizeMap[theme.fontSize];
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: "#1f2937",
      paddingTop: 44,
      paddingBottom: 44,
      paddingHorizontal: 48,
      backgroundColor: "#ffffff",
    },
    senderRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      alignItems: "baseline",
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryColor,
      paddingBottom: 8,
      marginBottom: 14,
    },
    senderName: {
      fontSize: fs + 3,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
    },
    senderDetail: {
      fontSize: fs - 1,
      color: "#6b7280",
    },
    date: {
      textAlign: "right",
      fontSize: fs - 1,
      color: "#6b7280",
      marginBottom: 14,
    },
    recipientBlock: {
      marginBottom: 16,
    },
    recipientName: {
      fontSize: fs,
      fontFamily: theme.fontFamily,
      marginBottom: 2,
    },
    recipientAddress: {
      fontSize: fs - 1,
      color: "#6b7280",
    },
    subject: {
      fontSize: fs + 1,
      fontFamily: theme.fontFamily,
      marginBottom: 12,
    },
    body: {
      fontSize: fs,
      color: "#374151",
      lineHeight: 1.5,
      textAlign: "justify",
    },
  });
}

interface Props {
  data: CvData;
  theme: CompactTheme;
}

export function CompactCoverLetter({ data, theme }: Props) {
  if (!data.coverLetter) return null;

  const styles = makeStyles(theme);
  const { profile } = data;
  const { recipient, recipientAddress, subject, body, date } = data.coverLetter;

  const senderParts: string[] = [];
  if (profile.address) senderParts.push(profile.address.replace(/\n/g, ", "));
  if (profile.email) senderParts.push(profile.email);
  if (profile.phone) senderParts.push(profile.phone);

  return (
    <Page size="A4" style={styles.page}>
      {/* Compact sender row */}
      <View style={styles.senderRow}>
        <Text style={styles.senderName}>{profile.name}</Text>
        {senderParts.map((part) => (
          <Text key={part} style={styles.senderDetail}>
            {part}
          </Text>
        ))}
      </View>

      {/* Right-aligned date */}
      <Text style={styles.date}>{date}</Text>

      {/* Recipient */}
      <View style={styles.recipientBlock}>
        <Text style={styles.recipientName}>{recipient}</Text>
        {recipientAddress ? (
          <Text style={styles.recipientAddress}>{recipientAddress}</Text>
        ) : null}
      </View>

      {/* Subject */}
      {subject ? <Text style={styles.subject}>{subject}</Text> : null}

      {/* Body */}
      <Text style={styles.body}>{body}</Text>
    </Page>
  );
}
