import { Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CvData } from "../../types/cv";
import type { ModernTheme } from "./theme";

const fontSizeMap = { sm: 9, md: 10, lg: 11 };

function makeStyles(theme: ModernTheme) {
  const fs = fontSizeMap[theme.fontSize];
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: "#1f2937",
      backgroundColor: "#ffffff",
    },
    colorBar: {
      backgroundColor: theme.primaryColor,
      paddingTop: 48,
      paddingBottom: 32,
      alignItems: "center",
    },
    photo: {
      width: 96,
      height: 96,
      borderRadius: 48,
      objectFit: "cover",
      marginBottom: 16,
      borderWidth: 3,
      borderColor: "#ffffff",
    },
    name: {
      fontSize: fs + 16,
      color: "#ffffff",
      fontFamily: theme.fontFamily,
      marginBottom: 4,
    },
    titleText: {
      fontSize: fs + 4,
      color: "rgba(255,255,255,0.85)",
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 60,
      paddingTop: 48,
    },
    infoBlock: {
      width: "100%",
      marginBottom: 20,
    },
    infoLabel: {
      fontSize: fs - 1,
      color: "#9ca3af",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: fs + 4,
      color: theme.primaryColor,
      fontFamily: theme.fontFamily,
    },
  });
}

interface Props {
  data: CvData;
  theme: ModernTheme;
}

export function ModernCoverPage({ data, theme }: Props) {
  if (!data.coverPage) return null;

  const styles = makeStyles(theme);
  const { profile } = data;
  const { company, position, date } = data.coverPage;
  const photoSrc =
    (theme as unknown as Record<string, string>).croppedPhoto || profile.photo;

  return (
    <Page size="A4" style={styles.page}>
      {/* Color bar with photo */}
      <View style={styles.colorBar}>
        {photoSrc ? <Image style={styles.photo} src={photoSrc} /> : null}
        <Text style={styles.name}>{profile.name}</Text>
        {profile.title ? (
          <Text style={styles.titleText}>{profile.title}</Text>
        ) : null}
      </View>

      {/* Info content */}
      <View style={styles.content}>
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
