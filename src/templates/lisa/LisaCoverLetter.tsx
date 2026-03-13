import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CvData } from "../../types/cv";
import type { LisaTheme } from "./theme";

const fontSizeMap = { sm: 9, md: 10, lg: 11 };

function makeStyles(theme: LisaTheme) {
  const fs = fontSizeMap[theme.fontSize];
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: "#1f2937",
      paddingTop: 40,
      paddingBottom: 40,
      paddingHorizontal: 52,
      backgroundColor: "#ffffff",
    },
    senderBlock: {
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryColor,
      paddingBottom: 8,
      marginBottom: 14,
    },
    senderName: {
      fontSize: fs + 2,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      marginBottom: 3,
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
      lineHeight: 1.6,
      textAlign: "justify",
    },
  });
}

interface Props {
  data: CvData;
  theme: LisaTheme;
}

export function LisaCoverLetter({ data, theme }: Props) {
  if (!data.coverLetter) return null;

  const styles = makeStyles(theme);
  const { profile } = data;
  const { recipient, recipientAddress, subject, body, date } = data.coverLetter;

  return (
    <Page size="A4" style={styles.page}>
      {/* Sender with border-bottom */}
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

      {/* Justified body */}
      <Text style={styles.body}>{body}</Text>
    </Page>
  );
}
