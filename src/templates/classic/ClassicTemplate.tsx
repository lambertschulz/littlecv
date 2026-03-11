import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
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
      paddingTop: 48,
      paddingBottom: 48,
      paddingHorizontal: 56,
      backgroundColor: '#ffffff',
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    photo: {
      width: 72,
      height: 72,
      borderRadius: 36,
      objectFit: 'cover',
      marginBottom: 10,
    },
    name: {
      fontSize: fs + 12,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 3,
      marginBottom: 4,
    },
    titleText: {
      fontSize: fs + 2,
      color: '#6b7280',
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 10,
    },
    contactItem: {
      fontSize: fs - 1,
      color: '#6b7280',
    },
    section: {
      marginBottom: 14,
    },
    sectionTitleUnderline: {
      fontSize: fs + 2,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryColor,
      marginBottom: 8,
    },
    sectionTitleBlock: {
      fontSize: fs + 2,
      fontFamily: theme.fontFamily,
      color: '#ffffff',
      backgroundColor: theme.primaryColor,
      paddingHorizontal: 6,
      paddingVertical: 3,
      marginBottom: 8,
    },
    entryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    entryTitle: {
      fontSize: fs,
      fontFamily: theme.fontFamily,
    },
    entryPeriod: {
      fontSize: fs - 1,
      color: '#9ca3af',
    },
    entrySubtitle: {
      fontSize: fs - 1,
      color: '#6b7280',
      marginBottom: 2,
    },
    entryDescription: {
      fontSize: fs - 1,
      color: '#374151',
      marginBottom: 6,
    },
    skillsText: {
      fontSize: fs,
      color: '#374151',
      lineHeight: 1.6,
    },
  })
}

interface Props {
  data: CvData
  theme: ClassicTheme
}

export function ClassicTemplate({ data, theme }: Props) {
  const styles = makeStyles(theme)
  const { profile, skills } = data
  const sections = data.sections ?? []
  const isBlock = theme.headerStyle === 'block'

  const sectionTitleStyle = isBlock ? styles.sectionTitleBlock : styles.sectionTitleUnderline

  const contactParts: string[] = []
  if (profile.email) contactParts.push(profile.email)
  if (profile.phone) contactParts.push(profile.phone)
  if (profile.address) contactParts.push(profile.address.replace(/\n/g, ', '))
  if (profile.website) contactParts.push(profile.website)

  return (
    <Page size="A4" style={styles.page}>
      {/* Centered header */}
      <View style={styles.header}>
        {profile.photo ? (
          <Image style={styles.photo} src={profile.photo} />
        ) : null}
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.titleText}>{profile.title}</Text>
        <View style={styles.contactRow}>
          {contactParts.map((part, i) => (
            <Text key={i} style={styles.contactItem}>{part}</Text>
          ))}
        </View>
      </View>

      {/* Sections */}
      {sections.map((section) =>
        section.entries.length > 0 ? (
          <View key={section.id} style={styles.section}>
            <Text style={sectionTitleStyle}>{section.name}</Text>
            {section.entries.map((entry) => (
              <View key={entry.id}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryPeriod}>{entry.period}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{entry.subtitle}</Text>
                {entry.description ? (
                  <Text style={styles.entryDescription}>{entry.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <View style={styles.section}>
          <Text style={sectionTitleStyle}>Kenntnisse</Text>
          <Text style={styles.skillsText}>
            {skills.map((s) => s.label).join(' · ')}
          </Text>
        </View>
      )}
    </Page>
  )
}
