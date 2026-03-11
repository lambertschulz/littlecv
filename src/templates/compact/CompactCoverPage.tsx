import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { CompactTheme } from './theme'

const fontSizeMap = { sm: 8, md: 9, lg: 10 }

function makeStyles(theme: CompactTheme) {
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
      width: 64,
      height: 64,
      borderRadius: 32,
      objectFit: 'cover',
      marginBottom: 12,
    },
    name: {
      fontSize: fs + 12,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 4,
      textAlign: 'center',
    },
    titleText: {
      fontSize: fs + 1,
      color: '#6b7280',
      marginBottom: 12,
      textAlign: 'center',
    },
    rule: {
      width: 100,
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 18,
    },
    infoBlock: {
      alignItems: 'center',
      marginBottom: 12,
    },
    infoLabel: {
      fontSize: fs - 1,
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: fs + 2,
      color: theme.primaryColor,
      fontFamily: theme.fontFamily,
      textAlign: 'center',
    },
    ruleSmall: {
      width: 48,
      height: 1,
      backgroundColor: '#d1d5db',
      marginVertical: 8,
    },
  })
}

interface Props {
  data: CvData
  theme: CompactTheme
}

export function CompactCoverPage({ data, theme }: Props) {
  if (!data.coverPage) return null

  const styles = makeStyles(theme)
  const { profile } = data
  const { company, position, date } = data.coverPage

  return (
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
  )
}
