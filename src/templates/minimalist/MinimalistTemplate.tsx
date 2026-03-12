import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { MinimalistTheme } from './theme'

const fontSizeMap = { sm: 9, md: 10, lg: 11 }

function makeStyles(theme: MinimalistTheme) {
  const fs = fontSizeMap[theme.fontSize]
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: '#1f2937',
      paddingTop: 48,
      paddingBottom: 48,
      paddingHorizontal: 60,
      backgroundColor: '#ffffff',
    },
    header: {
      marginBottom: 16,
    },
    name: {
      fontSize: fs + 14,
      fontFamily: theme.fontFamily,
      color: theme.accentColor,
      fontWeight: 'light',
      marginBottom: 4,
    },
    title: {
      fontSize: fs + 1,
      color: '#9ca3af',
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    contactItem: {
      fontSize: fs - 1,
      color: '#9ca3af',
    },
    contactSeparator: {
      fontSize: fs - 1,
      color: '#d1d5db',
      paddingHorizontal: 4,
    },
    divider: {
      height: 0.5,
      backgroundColor: '#e5e7eb',
      marginTop: 12,
      marginBottom: 16,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: fs - 1,
      color: theme.accentColor,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 4,
    },
    sectionDivider: {
      height: 0.5,
      backgroundColor: '#e5e7eb',
      marginBottom: 10,
    },
    entry: {
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
      color: '#9ca3af',
    },
    entrySubtitle: {
      fontSize: fs - 1,
      color: '#6b7280',
      marginBottom: 2,
    },
    entryDescription: {
      fontSize: fs - 1,
      color: '#9ca3af',
    },
    skillsText: {
      fontSize: fs - 1,
      color: '#6b7280',
    },
  })
}

interface Props {
  data: CvData
  theme: MinimalistTheme
}

export function MinimalistTemplate({ data, theme }: Props) {
  const styles = makeStyles(theme)
  const { profile, skillSections } = data
  const timeline = data.timeline ?? []

  const contactParts: string[] = []
  if (profile.email) contactParts.push(profile.email)
  if (profile.phone) contactParts.push(profile.phone)
  if (profile.address) contactParts.push(profile.address.replace(/\n/g, ', '))
  if (profile.website) contactParts.push(profile.website)

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{profile.name}</Text>
        {profile.title ? <Text style={styles.title}>{profile.title}</Text> : null}
        {contactParts.length > 0 ? (
          <View style={styles.contactRow}>
            {contactParts.map((part, i) => (
              <View key={i} style={{ flexDirection: 'row' }}>
                {i > 0 ? <Text style={styles.contactSeparator}>|</Text> : null}
                <Text style={styles.contactItem}>{part}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.divider} />

      {/* Timeline Sections */}
      {timeline.map((section) =>
        section.entries.length > 0 ? (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.name}</Text>
            <View style={styles.sectionDivider} />
            {section.entries.map((entry) => (
              <View key={entry.id} style={styles.entry}>
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

      {/* Skill Sections */}
      {(skillSections ?? []).map((skillSection) =>
        skillSection.skills.length > 0 ? (
          <View key={skillSection.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{skillSection.name}</Text>
            <View style={styles.sectionDivider} />
            <Text style={styles.skillsText}>
              {skillSection.skills.map((s) => (s.level ? `${s.label} (${s.level})` : s.label)).join(', ')}
            </Text>
          </View>
        ) : null
      )}
    </Page>
  )
}
