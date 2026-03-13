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
      backgroundColor: "#ffffff",
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 60,
    },
    name: {
      fontSize: fs + 20,
      fontFamily: theme.fontFamily,
      color: theme.accentColor,
      fontWeight: "light",
      marginBottom: 6,
      textAlign: "center",
    },
    titleText: {
      fontSize: fs + 2,
      color: "#9ca3af",
      marginBottom: 20,
      textAlign: "center",
    },
    thinLine: {
      width: 100,
      height: 0.5,
      backgroundColor: "#e5e7eb",
      marginBottom: 32,
    },
    infoBlock: {
      width: "100%",
      marginBottom: 20,
      alignItems: "center",
    },
    infoLabel: {
      fontSize: fs - 1,
      color: "#9ca3af",
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 3,
    },
    infoValue: {
      fontSize: fs + 4,
      color: theme.accentColor,
      fontFamily: theme.fontFamily,
      fontWeight: "light",
    },
  });
}

interface Props {
  data: CvData;
  theme: MinimalistTheme;
}

export function MinimalistCoverPage({ data, theme }: Props) {
  if (!data.coverPage) return null;

  const styles = makeStyles(theme);
  const { profile } = data;
  const { company, position, date } = data.coverPage;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.name}>{profile.name}</Text>
        {profile.title ? (
          <Text style={styles.titleText}>{profile.title}</Text>
        ) : null}
        <View style={styles.thinLine} />
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Bewerbung als</Text>
          <Text style={styles.infoValue}>{position}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Bei</Text>
          <Text style={styles.infoValue}>{company}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Datum</Text>
          <Text style={styles.infoValue}>{date}</Text>
        </View>
      </View>
    </Page>
  );
}
