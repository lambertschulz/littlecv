import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { CreativeTheme } from './theme'

const fontSizeMap = { sm: 9, md: 10, lg: 11 }

function makeStyles(theme: CreativeTheme) {
  const fs = fontSizeMap[theme.fontSize]
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: '#1f2937',
      backgroundColor: '#ffffff',
      flexDirection: 'row',
    },
    leftHalf: {
      width: '50%',
      backgroundColor: theme.sidebarColor,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingVertical: 48,
    },
    photo: {
      width: 96,
      height: 96,
      borderRadius: 48,
      objectFit: 'cover',
      borderWidth: 3,
      borderColor: '#ffffff',
      marginBottom: 20,
    },
    name: {
      fontSize: fs + 10,
      color: '#ffffff',
      fontFamily: theme.fontFamily,
      textAlign: 'center',
      marginBottom: 6,
    },
    titleText: {
      fontSize: fs + 2,
      color: 'rgba(255,255,255,0.75)',
      textAlign: 'center',
    },
    rightHalf: {
      width: '50%',
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingVertical: 48,
    },
    infoBlock: {
      width: '100%',
      marginBottom: 24,
    },
    infoLabel: {
      fontSize: fs - 1,
      color: theme.accentColor,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 3,
    },
    infoValue: {
      fontSize: fs + 4,
      color: '#1f2937',
      fontFamily: theme.fontFamily,
    },
  })
}

interface Props {
  data: CvData
  theme: CreativeTheme
}

export function CreativeCoverPage({ data, theme }: Props) {
  if (!data.coverPage) return null

  const styles = makeStyles(theme)
  const { profile } = data
  const { company, position, date } = data.coverPage

  return (
    <Page size="A4" style={styles.page}>
      {/* Left half */}
      <View style={styles.leftHalf}>
        {profile.photo ? (
          <Image style={styles.photo} src={profile.photo} />
        ) : null}
        <Text style={styles.name}>{profile.name}</Text>
        {profile.title ? <Text style={styles.titleText}>{profile.title}</Text> : null}
      </View>

      {/* Right half */}
      <View style={styles.rightHalf}>
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
  )
}
