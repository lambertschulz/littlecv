import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CvData } from "../../types/cv";
import type { ExecutiveTheme } from "./theme";

const fontSizeMap = { sm: 9, md: 10, lg: 11 };

function makeStyles(theme: ExecutiveTheme) {
  const fs = fontSizeMap[theme.fontSize];
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: "#1f2937",
      paddingTop: 56,
      paddingBottom: 56,
      paddingHorizontal: 64,
      backgroundColor: "#ffffff",
    },
    senderBlock: {
      marginBottom: 20,
    },
    senderName: {
      fontSize: fs + 6,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      marginBottom: 6,
    },
    doubleRuleTop: {
      width: "100%",
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 3,
    },
    doubleRuleBottom: {
      width: "100%",
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 10,
    },
    senderDetail: {
      fontSize: fs - 1,
      color: "#6b7280",
    },
    date: {
      textAlign: "right",
      fontSize: fs - 1,
      color: "#6b7280",
      marginBottom: 20,
    },
    recipientBlock: {
      marginBottom: 24,
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
      marginBottom: 16,
    },
    body: {
      fontSize: fs,
      color: "#374151",
      lineHeight: 1.7,
      textAlign: "justify",
    },
  });
}

interface Props {
  data: CvData;
  theme: ExecutiveTheme;
}

export function ExecutiveCoverLetter({ data, theme }: Props) {
  if (!data.coverLetter) return null;

  const styles = makeStyles(theme);
  const { profile } = data;
  const { recipient, recipientAddress, subject, body, date } = data.coverLetter;

  return (
    <Page size="A4" style={styles.page}>
      {/* Sender with double-line border bottom */}
      <View style={styles.senderBlock}>
        <Text style={styles.senderName}>{profile.name}</Text>
        <View style={styles.doubleRuleTop} />
        <View style={styles.doubleRuleBottom} />
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

      {/* Subject in serif */}
      {subject ? <Text style={styles.subject}>{subject}</Text> : null}

      {/* Justified body */}
      <Text style={styles.body}>{body}</Text>
    </Page>
  );
}
