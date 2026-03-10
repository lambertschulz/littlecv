import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { ModernTheme } from './theme'

const fontSizeMap = { sm: 9, md: 10, lg: 11 }

function makeStyles(theme: ModernTheme) {
  const fs = fontSizeMap[theme.fontSize]
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: '#1f2937',
      paddingTop: 40,
      paddingBottom: 40,
      paddingHorizontal: 48,
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'row',
      marginBottom: 20,
      gap: 16,
    },
    photo: {
      width: 72,
      height: 72,
      borderRadius: 36,
      objectFit: 'cover',
    },
    headerText: {
      flex: 1,
      justifyContent: 'center',
    },
    name: {
      fontSize: fs + 10,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      marginBottom: 2,
    },
    title: {
      fontSize: fs + 2,
      color: '#6b7280',
      marginBottom: 6,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    contactItem: {
      fontSize: fs - 1,
      color: '#6b7280',
    },
    divider: {
      height: 2,
      backgroundColor: theme.primaryColor,
      marginBottom: 12,
    },
    section: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: fs + 2,
      color: theme.primaryColor,
      marginBottom: 4,
      fontFamily: theme.fontFamily,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.accentColor,
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
    skillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    skillPill: {
      backgroundColor: theme.accentColor,
      color: '#ffffff',
      fontSize: fs - 1,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
  })
}

interface Props {
  data: CvData
  theme: ModernTheme
}

export function ModernTemplate({ data, theme }: Props) {
  const styles = makeStyles(theme)
  const { profile, experience, education, skills } = data

  const contactParts: string[] = []
  if (profile.email) contactParts.push(profile.email)
  if (profile.phone) contactParts.push(profile.phone)
  if (profile.address) contactParts.push(profile.address)
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
            <Text style={styles.title}>{profile.title}</Text>
            <View style={styles.contactRow}>
              {contactParts.map((part, i) => (
                <Text key={i} style={styles.contactItem}>{part}</Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Berufserfahrung</Text>
            <View style={styles.sectionDivider} />
            {experience.map((exp) => (
              <View key={exp.id}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{exp.role}</Text>
                  <Text style={styles.entryPeriod}>{exp.period}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.company}</Text>
                {exp.description ? (
                  <Text style={styles.entryDescription}>{exp.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ausbildung</Text>
            <View style={styles.sectionDivider} />
            {education.map((edu) => (
              <View key={edu.id}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{edu.degree}</Text>
                  <Text style={styles.entryPeriod}>{edu.period}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{edu.institution}</Text>
                {edu.description ? (
                  <Text style={styles.entryDescription}>{edu.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kenntnisse</Text>
            <View style={styles.sectionDivider} />
            <View style={styles.skillsRow}>
              {skills.map((skill) => (
                <Text key={skill.id} style={styles.skillPill}>
                  {skill.label}{skill.level ? ` · ${skill.level}` : ''}
                </Text>
              ))}
            </View>
          </View>
        )}
    </Page>
  )
}
