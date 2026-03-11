import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
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
      paddingTop: 56,
      paddingBottom: 56,
      paddingHorizontal: 64,
      backgroundColor: '#ffffff',
    },
    senderBlock: {
      marginBottom: 6,
    },
    senderName: {
      fontSize: fs + 6,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      marginBottom: 4,
    },
    senderDetail: {
      fontSize: fs - 1,
      color: '#6b7280',
    },
    doubleLine: {
      marginTop: 10,
      marginBottom: 20,
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
    date: {
      textAlign: 'right',
      fontSize: fs - 1,
      color: theme.accentColor,
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
      color: '#6b7280',
    },
    subject: {
      fontSize: fs + 2,
      fontFamily: theme.fontFamily,
      color: '#111827',
      marginBottom: 16,
    },
    body: {
      fontSize: fs,
      color: '#374151',
      lineHeight: 1.6,
      textAlign: 'justify',
    },
  })
}

interface Props {
  data: CvData
  theme: ElegantTheme
}

export function ElegantCoverLetter({ data, theme }: Props) {
  if (!data.coverLetter) return null

  const styles = makeStyles(theme)
  const { profile } = data
  const { recipient, recipientAddress, subject, body, date } = data.coverLetter

  return (
    <Page size="A4" style={styles.page}>
      {/* Sender block */}
      <View style={styles.senderBlock}>
        <Text style={styles.senderName}>{profile.name}</Text>
        {profile.address ? <Text style={styles.senderDetail}>{profile.address}</Text> : null}
        {profile.email ? <Text style={styles.senderDetail}>{profile.email}</Text> : null}
        {profile.phone ? <Text style={styles.senderDetail}>{profile.phone}</Text> : null}
      </View>

      {/* Double-line accent */}
      <View style={styles.doubleLine}>
        <View style={styles.lineTop} />
        <View style={styles.lineBottom} />
      </View>

      {/* Right-aligned date in accentColor */}
      <Text style={styles.date}>{date}</Text>

      {/* Recipient */}
      <View style={styles.recipientBlock}>
        <Text style={styles.recipientName}>{recipient}</Text>
        {recipientAddress ? (
          <Text style={styles.recipientAddress}>{recipientAddress}</Text>
        ) : null}
      </View>

      {/* Subject */}
      {subject ? <Text style={styles.subject}>{subject}</Text> : null}

      {/* Body */}
      <Text style={styles.body}>{body}</Text>
    </Page>
  )
}
