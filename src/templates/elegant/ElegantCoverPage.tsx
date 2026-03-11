import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ElegantTheme } from './theme'

const fontSizeMap = { sm: 9, md: 10, lg: 11 }

function makeStyles(theme: ElegantTheme) {
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
      width: 80,
      height: 80,
      borderRadius: 40,
      objectFit: 'cover',
      borderWidth: 2,
      borderColor: theme.accentColor,
      marginBottom: 16,
    },
    name: {
      fontSize: fs + 14,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      marginBottom: 6,
      textAlign: 'center',
    },
    titleText: {
      fontSize: fs + 2,
      color: theme.accentColor,
      marginBottom: 16,
      textAlign: 'center',
    },
    doubleLine: {
      width: 120,
      marginBottom: 28,
    },
    lineTop: {
      height: 2,
      backgroundColor: theme.primaryColor,
      marginBottom: 1,
    },
    lineBottom: {
      height: 1,
      backgroundColor: theme.accentColor,
    },
    infoBlock: {
      alignItems: 'center',
      marginBottom: 16,
    },
    infoLabel: {
      fontSize: fs - 1,
      color: theme.accentColor,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 3,
    },
    infoValue: {
      fontSize: fs + 3,
      color: theme.primaryColor,
      fontFamily: theme.fontFamily,
      textAlign: 'center',
    },
    separator: {
      fontSize: fs,
      color: theme.accentColor,
      marginVertical: 10,
    },
  })
}

interface Props {
  data: CvData
  theme: ElegantTheme
}

export function ElegantCoverPage({ data, theme }: Props) {
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

        <View style={styles.doubleLine}>
          <View style={styles.lineTop} />
          <View style={styles.lineBottom} />
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Bewerbung als</Text>
          <Text style={styles.infoValue}>{position}</Text>
        </View>

        <Text style={styles.separator}>◆</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Bei</Text>
          <Text style={styles.infoValue}>{company}</Text>
        </View>

        <Text style={styles.separator}>◆</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Datum</Text>
          <Text style={styles.infoValue}>{date}</Text>
        </View>
      </View>
    </Page>
  )
}
