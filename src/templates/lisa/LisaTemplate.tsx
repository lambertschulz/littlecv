import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { LisaTheme } from './theme'
import { getPhotoDimensions, getPhotoBorderRadius } from '../photoUtils'

const fontSizeMap = { sm: 9, md: 10, lg: 11 }

function makeStyles(theme: LisaTheme) {
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
      marginBottom: 16,
    },
    photo: {
      ...getPhotoDimensions(theme.photoSize ?? 'md'),
      borderRadius: getPhotoBorderRadius(theme.photoShape ?? 'round', theme.photoSize ?? 'md'),
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
    lebenslaufLabel: {
      fontSize: fs + 4,
      fontFamily: theme.fontFamily,
      color: theme.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 4,
      textAlign: 'center',
      marginBottom: 4,
    },
    lebenslaufRule: {
      height: 2,
      backgroundColor: theme.primaryColor,
      marginBottom: 16,
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
    skillRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 3,
      borderBottomWidth: 0.5,
      borderBottomColor: '#e5e7eb',
    },
    skillLabel: {
      fontSize: fs,
      color: '#374151',
      fontFamily: theme.fontFamily,
    },
    skillLevel: {
      fontSize: fs - 1,
      color: '#6b7280',
    },
  })
}

interface Props {
  data: CvData
  theme: LisaTheme
}

export function LisaTemplate({ data, theme }: Props) {
  const styles = makeStyles(theme)
  const { profile, skillSections } = data
  const timeline = data.timeline ?? []
  const photoSrc = (theme as unknown as Record<string, string>).croppedPhoto || profile.photo
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
        {photoSrc ? (
          <Image style={styles.photo} src={photoSrc} />
        ) : null}
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.titleText}>{profile.title}</Text>
        <View style={styles.contactRow}>
          {contactParts.map((part, i) => (
            <Text key={i} style={styles.contactItem}>{part}</Text>
          ))}
        </View>
      </View>

      {/* "Lebenslauf" heading between header and first section */}
      <Text style={styles.lebenslaufLabel}>Lebenslauf</Text>
      <View style={styles.lebenslaufRule} />

      {/* Timeline Sections */}
      {timeline.map((section) =>
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

      {/* Skill Sections — label + level as table rows */}
      {(skillSections ?? []).map((skillSection) =>
        skillSection.skills.length > 0 ? (
          <View key={skillSection.id} style={styles.section}>
            <Text style={sectionTitleStyle}>{skillSection.name}</Text>
            {skillSection.skills.map((s) => (
              <View key={s.id} style={styles.skillRow}>
                <Text style={styles.skillLabel}>{s.label}</Text>
                <Text style={styles.skillLevel}>{s.level ?? ''}</Text>
              </View>
            ))}
          </View>
        ) : null
      )}
    </Page>
  )
}
