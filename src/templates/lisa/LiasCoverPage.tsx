import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { LisaTheme } from './theme'

const fontSizeMap = { sm: 9, md: 10, lg: 11 }

function makeStyles(theme: LisaTheme) {
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
  })
}

interface Props {
  data: CvData
  theme: LisaTheme
}

export function LisaCoverPage({ data, theme }: Props) {
  if (!data.coverPage) return null

  const styles = makeStyles(theme)
  const { profile } = data
  const { company, position, date } = data.coverPage

  return (
    <Page size="A4" style={styles.page}>
      <View >
        {profile.photo ? (
          <Image src={profile.photo} />
        ) : null}
        <Text >{profile.name}</Text>
        {profile.title ? <Text >{profile.title}</Text> : null}

        <View />

        <View >
          <Text >Bewerbung als</Text>
          <Text >{position}</Text>
        </View>

        <View />

        <View >
          <Text >Bei</Text>
          <Text >{company}</Text>
        </View>

        <View />

        <View >
          <Text >Datum</Text>
          <Text >{date}</Text>
        </View>
      </View>
    </Page>
  )
}
