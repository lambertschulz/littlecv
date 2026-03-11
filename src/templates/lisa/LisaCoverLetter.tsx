import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
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
      paddingTop: 56,
      paddingBottom: 56,
      paddingHorizontal: 64,
      backgroundColor: '#ffffff',
    },
  })
}

interface Props {
  data: CvData
  theme: LisaTheme
}

export function LisaCoverLetter({ data, theme }: Props) {
  if (!data.coverLetter) return null

  const styles = makeStyles(theme)
  const { profile } = data
  const { recipient, recipientAddress, subject, body, date } = data.coverLetter

  return (
    <Page size="A4" style={styles.page}>
      {/* Sender with border-bottom */}
      <View >
        <Text >{profile.name}</Text>
        {profile.address ? <Text >{profile.address}</Text> : null}
        {profile.email ? <Text >{profile.email}</Text> : null}
        {profile.phone ? <Text >{profile.phone}</Text> : null}
      </View>

      {/* Right-aligned date */}
      <Text >{date}</Text>

      {/* Recipient */}
      <View >
        <Text >{recipient}</Text>
        {recipientAddress ? (
          <Text >{recipientAddress}</Text>
        ) : null}
      </View>

      {/* Subject */}
      {subject ? <Text >{subject}</Text> : null}

      {/* Justified body */}
      <Text >{body}</Text>
    </Page>
  )
}
