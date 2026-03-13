import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CvData } from "../../types/cv";
import type { MinimalistTheme } from "./theme";

const fontSizeMap = { sm: 9, md: 10, lg: 11 };

function makeStyles(theme: MinimalistTheme) {
  const fs = fontSizeMap[theme.fontSize];
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: "#1f2937",
      paddingTop: 48,
      paddingBottom: 48,
      paddingHorizontal: 60,
      backgroundColor: "#ffffff",
    },
    senderBlock: {
      marginBottom: 24,
    },
    senderName: {
      fontSize: fs + 4,
      fontFamily: theme.fontFamily,
      color: theme.accentColor,
      fontWeight: "light",
      marginBottom: 4,
    },
    senderDetail: {
      fontSize: fs - 1,
      color: "#9ca3af",
    },
    date: {
      textAlign: "right",
      fontSize: fs - 1,
      color: "#9ca3af",
      marginBottom: 20,
    },
    recipientBlock: {
      marginBottom: 20,
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
      fontSize: fs + 2,
      fontFamily: theme.fontFamily,
      color: "#111827",
      marginBottom: 16,
    },
    body: {
      fontSize: fs,
      color: "#374151",
      lineHeight: 1.6,
    },
  });
}

interface Props {
  data: CvData;
  theme: MinimalistTheme;
}

export function MinimalistCoverLetter({ data, theme }: Props) {
  if (!data.coverLetter) return null;

  const styles = makeStyles(theme);
  const { profile } = data;
  const { recipient, recipientAddress, subject, body, date } = data.coverLetter;

  return (
    <Page size="A4" style={styles.page}>
      {/* Sender */}
      <View style={styles.senderBlock}>
        <Text style={styles.senderName}>{profile.name}</Text>
        {profile.address ? (
          <Text style={styles.senderDetail}>{profile.address}</Text>
        ) : null}
        {profile.email ? (
          <Text style={styles.senderDetail}>{profile.email}</Text>
        ) : null}
        {profile.phone ? (
          <Text style={styles.senderDetail}>{profile.phone}</Text>
        ) : null}
      </View>

      {/* Date */}
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
