import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { CvData } from '../../types/cv'
import type { CreativeTheme } from './theme'
import { getPhotoDimensions, getPhotoBorderRadius } from '../photoUtils'

const fontSizeMap = { sm: 9, md: 10, lg: 11 }

function makeStyles(theme: CreativeTheme) {
  const fs = fontSizeMap[theme.fontSize]
  return StyleSheet.create({
    page: {
      fontFamily: theme.fontFamily,
      fontSize: fs,
      color: '#1f2937',
      backgroundColor: '#ffffff',
      flexDirection: 'row',
    },
    sidebar: {
      width: '35%',
      backgroundColor: theme.sidebarColor,
      paddingTop: 36,
      paddingBottom: 36,
      paddingHorizontal: 20,
    },
    photoContainer: {
      alignItems: 'center',
      marginBottom: 14,
    },
    photo: {
      ...getPhotoDimensions(theme.photoSize ?? 'md'),
      borderRadius: getPhotoBorderRadius(theme.photoShape ?? 'round', theme.photoSize ?? 'md'),
      objectFit: 'cover',
      borderWidth: 2,
      borderColor: '#ffffff',
    },
    sidebarName: {
      fontSize: fs + 4,
      color: '#ffffff',
      fontFamily: theme.fontFamily,
      textAlign: 'center',
      marginBottom: 3,
    },
    sidebarTitle: {
      fontSize: fs,
      color: 'rgba(255,255,255,0.7)',
      textAlign: 'center',
      marginBottom: 10,
    },
    accentDivider: {
      width: 40,
      height: 2,
      backgroundColor: theme.accentColor,
      marginBottom: 12,
      alignSelf: 'center',
    },
    contactItem: {
      fontSize: fs - 1,
      color: 'rgba(255,255,255,0.85)',
      marginBottom: 4,
      textAlign: 'center',
    },
    sidebarSectionLabel: {
      fontSize: fs - 1,
      color: theme.accentColor,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 6,
      marginTop: 4,
    },
    skillLabel: {
      fontSize: fs - 1,
      color: '#ffffff',
      marginBottom: 3,
    },
    skillLevel: {
      color: 'rgba(255,255,255,0.55)',
    },
    main: {
      flex: 1,
      paddingTop: 36,
      paddingBottom: 36,
      paddingHorizontal: 24,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: fs + 1,
      color: theme.accentColor,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 3,
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
      color: '#1f2937',
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
  })
}

interface Props {
  data: CvData
  theme: CreativeTheme
}

export function CreativeTemplate({ data, theme }: Props) {
  const styles = makeStyles(theme)
  const { profile, skillSections } = data
  const timeline = data.timeline ?? []
  const photoSrc = (theme as unknown as Record<string, string>).croppedPhoto || profile.photo

  return (
    <Page size="A4" style={styles.page}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Photo */}
        {photoSrc ? (
          <View style={styles.photoContainer}>
            <Image style={styles.photo} src={photoSrc} />
          </View>
        ) : null}

        {/* Name & Title */}
        <Text style={styles.sidebarName}>{profile.name}</Text>
        {profile.title ? <Text style={styles.sidebarTitle}>{profile.title}</Text> : null}

        {/* Accent divider */}
        <View style={styles.accentDivider} />

        {/* Contact */}
        {profile.email ? <Text style={styles.contactItem}>{profile.email}</Text> : null}
        {profile.phone ? <Text style={styles.contactItem}>{profile.phone}</Text> : null}
        {profile.address ? (
          <Text style={styles.contactItem}>{profile.address.replace(/\n/g, ', ')}</Text>
        ) : null}
        {profile.website ? <Text style={styles.contactItem}>{profile.website}</Text> : null}

        {/* Skill Sections */}
        {(skillSections ?? []).map((skillSection) =>
          skillSection.skills.length > 0 ? (
            <View key={skillSection.id}>
              <View style={styles.accentDivider} />
              <Text style={styles.sidebarSectionLabel}>{skillSection.name}</Text>
              {skillSection.skills.map((skill) => (
                <Text key={skill.id} style={styles.skillLabel}>
                  {skill.label}
                  {skill.level ? (
                    <Text style={styles.skillLevel}> · {skill.level}</Text>
                  ) : null}
                </Text>
              ))}
            </View>
          ) : null
        )}
      </View>

      {/* Main area */}
      <View style={styles.main}>
        {timeline.map((section) =>
          section.entries.length > 0 ? (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.name}</Text>
              <View style={styles.sectionDivider} />
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
      </View>
    </Page>
  )
}
