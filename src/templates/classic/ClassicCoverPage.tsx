import { Page, View, Text, Image, StyleSheet, Document } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ClassicTheme } from './theme'

const fontSizeMap = { sm: 9, md: 10, lg: 11 }

function makeStyles(theme: ClassicTheme) {
  const fs = fontSizeMap[theme.fontSize]
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: '#1f2937',
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      alignItems: 'center',
      paddingHorizontal: 60,
      width: '100%',
    },
    photo: {
      width: 88,
      height: 88,
      borderRadius: 44,
      objectFit: 'cover',
      marginBottom: 16,
    },
    name: {
      fontSize: fs + 14,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 3,
      marginBottom: 6,
      textAlign: 'center',
    },
    titleText: {
      fontSize: fs + 2,
      color: '#6b7280',
      marginBottom: 16,
      textAlign: 'center',
    },
    rule: {
      width: 120,
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 24,
    },
    infoBlock: {
      alignItems: 'center',
      marginBottom: 16,
    },
    infoLabel: {
      fontSize: fs - 1,
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: fs + 3,
      color: theme.primaryColor,
      fontFamily: theme.fontFamily,
      textAlign: 'center',
    },
    ruleSmall: {
      width: 60,
      height: 1,
      backgroundColor: '#d1d5db',
      marginVertical: 12,
    },
  })
}

interface Props {
  data: CvData
  theme: ClassicTheme
}

export function ClassicCoverPage({ data, theme }: Props) {
  if (!data.coverPage) return null

  const styles = makeStyles(theme)
  const { profile } = data
  const { company, position, date } = data.coverPage

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {profile.photo ? (
            <Image style={styles.photo} src={profile.photo} />
          ) : null}
          <Text style={styles.name}>{profile.name}</Text>
          {profile.title ? <Text style={styles.titleText}>{profile.title}</Text> : null}

          <View style={styles.rule} />

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Bewerbung als</Text>
            <Text style={styles.infoValue}>{position}</Text>
          </View>

          <View style={styles.ruleSmall} />

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Bei</Text>
            <Text style={styles.infoValue}>{company}</Text>
          </View>

          <View style={styles.ruleSmall} />

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Datum</Text>
            <Text style={styles.infoValue}>{date}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
