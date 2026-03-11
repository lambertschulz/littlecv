import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
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
      paddingTop: 48,
      paddingBottom: 48,
      paddingHorizontal: 56,
      backgroundColor: '#ffffff',
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
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
    doubleRuleTop: {
      width: '100%',
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 3,
    },
    doubleRuleBottom: {
      width: '100%',
      height: 1,
      backgroundColor: theme.primaryColor,
      marginBottom: 8,
    },
    titleText: {
      fontSize: fs + 1,
      color: '#6b7280',
      marginBottom: 8,
      textAlign: 'center',
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 4,
    },
    contactItem: {
      fontSize: fs - 1,
      color: '#6b7280',
    },
    section: {
      marginBottom: 14,
    },
    sectionHeader: {
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: fs + 1,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 2,
      paddingBottom: 3,
    },
    sectionRule: {
      width: '100%',
      height: 1,
      backgroundColor: theme.primaryColor,
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
    skillLine: {
      fontSize: fs,
      color: '#374151',
      marginBottom: 2,
    },
  })
}

interface Props {
  data: CvData
  theme: ExecutiveTheme
}

export function ExecutiveTemplate({ data, theme }: Props) {
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
      {/* Centered header */}
      <View style={styles.header}>
        <Text style={styles.name}>{profile.name}</Text>
        <View style={styles.doubleRuleTop} />
        <View style={styles.doubleRuleBottom} />
        <Text style={styles.titleText}>{profile.title}</Text>
        <View style={styles.contactRow}>
          {contactParts.map((part, i) => (
            <Text key={i} style={styles.contactItem}>
              {i > 0 ? ' · ' : ''}{part}
            </Text>
          ))}
        </View>
      </View>

      {/* Timeline Sections */}
      {timeline.map((section) =>
        section.entries.length > 0 ? (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.name}</Text>
              <View style={styles.sectionRule} />
            </View>
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

      {/* Skill Sections */}
      {(skillSections ?? []).map((skillSection) =>
        skillSection.skills.length > 0 ? (
          <View key={skillSection.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{skillSection.name}</Text>
              <View style={styles.sectionRule} />
            </View>
            {skillSection.skills.map((skill) => (
              <Text key={skill.id} style={styles.skillLine}>
                {skill.label}{skill.level ? ` — ${skill.level}` : ''}
              </Text>
            ))}
          </View>
        ) : null
      )}
    </Page>
  )
}
