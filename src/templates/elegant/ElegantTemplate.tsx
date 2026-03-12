import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ElegantTheme } from './theme'
import { getPhotoDimensions, getPhotoBorderRadius } from '../photoUtils'

const fontSizeMap = { sm: 9, md: 10, lg: 11 }

function makeStyles(theme: ElegantTheme) {
  const fs = fontSizeMap[theme.fontSize]
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: '#1f2937',
      paddingTop: 44,
      paddingBottom: 48,
      paddingHorizontal: 52,
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'row',
      marginBottom: 14,
    },
    headerText: {
      flex: 1,
    },
    name: {
      fontSize: fs + 14,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      marginBottom: 4,
    },
    titleText: {
      fontSize: fs + 2,
      color: theme.accentColor,
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 0,
    },
    contactItem: {
      fontSize: fs - 1,
      color: '#6b7280',
    },
    photo: {
      ...getPhotoDimensions(theme.photoSize ?? 'md'),
      borderRadius: getPhotoBorderRadius(theme.photoShape ?? 'round', theme.photoSize ?? 'md'),
      objectFit: 'cover',
      borderWidth: 1.5,
      borderColor: theme.accentColor,
    },
    doubleLine: {
      marginBottom: 16,
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
    section: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: fs + 1,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      borderLeftWidth: 3,
      borderLeftColor: theme.accentColor,
      paddingLeft: 8,
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
      color: '#111827',
    },
    entryPeriod: {
      fontSize: fs - 1,
      color: theme.accentColor,
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
      lineHeight: 1.5,
    },
    skillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    skillPill: {
      borderWidth: 1,
      borderColor: theme.accentColor,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    skillPillText: {
      fontSize: fs - 1,
      color: theme.accentColor,
    },
  })
}

interface Props {
  data: CvData
  theme: ElegantTheme
}

export function ElegantTemplate({ data, theme }: Props) {
  const styles = makeStyles(theme)
  const { profile, skillSections } = data
  const timeline = data.timeline ?? []
  const photoSrc = (theme as unknown as Record<string, string>).croppedPhoto || profile.photo

  const contactParts: string[] = []
  if (profile.email) contactParts.push(profile.email)
  if (profile.phone) contactParts.push(profile.phone)
  if (profile.address) contactParts.push(profile.address.replace(/\n/g, ', '))
  if (profile.website) contactParts.push(profile.website)

  return (
    <Page size="A4" style={styles.page}>
      {/* Left-aligned header with optional photo on right */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.titleText}>{profile.title}</Text>
          <View style={styles.contactRow}>
            {contactParts.map((part, i) => (
              <Text key={i} style={styles.contactItem}>
                {i > 0 ? ' · ' : ''}{part}
              </Text>
            ))}
          </View>
        </View>
        {photoSrc ? (
          <Image style={styles.photo} src={photoSrc} />
        ) : null}
      </View>

      {/* Double-line accent */}
      <View style={styles.doubleLine}>
        <View style={styles.lineTop} />
        <View style={styles.lineBottom} />
      </View>

      {/* Timeline Sections */}
      {timeline.map((section) =>
        section.entries.length > 0 ? (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.name}</Text>
            {section.entries.map((entry) => (
              <View key={entry.id}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryPeriod}>{entry.period}</Text>
                </View>
                {entry.subtitle ? (
                  <Text style={styles.entrySubtitle}>{entry.subtitle}</Text>
                ) : null}
                {entry.description ? (
                  <Text style={styles.entryDescription}>{entry.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null
      )}

      {/* Skill Sections as outlined pills */}
      {(skillSections ?? []).map((skillSection) =>
        skillSection.skills.length > 0 ? (
          <View key={skillSection.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{skillSection.name}</Text>
            <View style={styles.skillsRow}>
              {skillSection.skills.map((s) => (
                <View key={s.id} style={styles.skillPill}>
                  <Text style={styles.skillPillText}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null
      )}
    </Page>
  )
}
