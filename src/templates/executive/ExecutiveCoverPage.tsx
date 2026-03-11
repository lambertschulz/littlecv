import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ExecutiveTheme } from './theme'

const fontSizeMap = { sm: 9, md: 10, lg: 11 }

function makeStyles(theme: ExecutiveTheme) {
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
    topDoubleRuleOuter: {
      width: 180,
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 3,
    },
    topDoubleRuleInner: {
      width: 180,
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 24,
    },
    photo: {
      width: 72,
      height: 72,
      borderRadius: 36,
      objectFit: 'cover',
      borderWidth: 1,
      borderColor: theme.primaryColor,
      marginBottom: 16,
    },
    name: {
      fontSize: fs + 14,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 4,
      marginBottom: 6,
      textAlign: 'center',
    },
    titleText: {
      fontSize: fs + 1,
      color: '#6b7280',
      marginBottom: 16,
      textAlign: 'center',
    },
    bottomDoubleRuleOuter: {
      width: 180,
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 3,
    },
    bottomDoubleRuleInner: {
      width: 180,
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 28,
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
    separator: {
      width: 24,
      height: 1,
      backgroundColor: '#d1d5db',
      marginVertical: 10,
    },
  })
}

interface Props {
  data: CvData
  theme: ExecutiveTheme
}

export function ExecutiveCoverPage({ data, theme }: Props) {
  if (!data.coverPage) return null

  const styles = makeStyles(theme)
  const { profile } = data
  const { company, position, date } = data.coverPage

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        {/* Decorative double-line rule at top */}
        <View style={styles.topDoubleRuleOuter} />
        <View style={styles.topDoubleRuleInner} />

        {profile.photo ? (
          <Image style={styles.photo} src={profile.photo} />
        ) : null}

        <Text style={styles.name}>{profile.name}</Text>
        {profile.title ? <Text style={styles.titleText}>{profile.title}</Text> : null}

        {/* Double-line rule below name */}
        <View style={styles.bottomDoubleRuleOuter} />
        <View style={styles.bottomDoubleRuleInner} />

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Bewerbung als</Text>
          <Text style={styles.infoValue}>{position}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Bei</Text>
          <Text style={styles.infoValue}>{company}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Datum</Text>
          <Text style={styles.infoValue}>{date}</Text>
        </View>
      </View>
    </Page>
  )
}
