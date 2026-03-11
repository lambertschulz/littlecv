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
      paddingTop: 28,
      paddingBottom: 28,
      paddingHorizontal: 32,
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 10,
    },
    photo: {
      width: 48,
      height: 48,
      borderRadius: 24,
      objectFit: 'cover',
    },
    headerText: {
      flex: 1,
    },
    name: {
      fontSize: fs + 8,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      marginBottom: 2,
    },
    titleText: {
      fontSize: fs + 1,
      color: '#6b7280',
      marginBottom: 3,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    contactItem: {
      fontSize: fs - 1,
      color: '#6b7280',
    },
    divider: {
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 10,
    },
    body: {
      flexDirection: 'row',
      gap: 14,
    },
    leftColumn: {
      flex: 6,
    },
    rightColumn: {
      flex: 4,
    },
    section: {
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: fs,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryColor,
      paddingBottom: 2,
    },
    entryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 1,
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
      marginBottom: 1,
    },
    entryDescription: {
      fontSize: fs - 1,
      color: '#374151',
      marginBottom: 4,
    },
    skillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    skillPill: {
      fontSize: fs - 1,
      color: theme.primaryColor,
      borderWidth: 1,
      borderColor: theme.primaryColor,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
    },
  })
}

interface Props {
  data: CvData
  theme: CompactTheme
}

export function CompactTemplate({ data, theme }: Props) {
  const styles = makeStyles(theme)
  const { profile, skills } = data
  const sections = data.sections ?? []

  const leftSections = sections.slice(0, 1)
  const rightSections = sections.slice(1)

  const contactParts: string[] = []
  if (profile.email) contactParts.push(profile.email)
  if (profile.phone) contactParts.push(profile.phone)
  if (profile.address) contactParts.push(profile.address.replace(/\n/g, ', '))
  if (profile.website) contactParts.push(profile.website)

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {profile.photo ? (
          <Image style={styles.photo} src={profile.photo} />
        ) : null}
        <View style={styles.headerText}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.titleText}>{profile.title}</Text>
          <View style={styles.contactRow}>
            {contactParts.map((part, i) => (
              <Text key={i} style={styles.contactItem}>{part}</Text>
            ))}
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Two-column body */}
      <View style={styles.body}>
        {/* Left column: first section */}
        <View style={styles.leftColumn}>
          {leftSections.map((section) =>
            section.entries.length > 0 ? (
              <View key={section.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.name}</Text>
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
        </View>

        {/* Right column: remaining sections + skills */}
        <View style={styles.rightColumn}>
          {rightSections.map((section) =>
            section.entries.length > 0 ? (
              <View key={section.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.name}</Text>
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

          {skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kenntnisse</Text>
              <View style={styles.skillsRow}>
                {skills.map((skill) => (
                  <Text key={skill.id} style={styles.skillPill}>{skill.label}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </Page>
  )
}
