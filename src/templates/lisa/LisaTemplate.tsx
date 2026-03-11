import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
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
      paddingTop: "20mm",
      paddingBottom: "20mm",
      paddingHorizontal: "20mm",
      backgroundColor: '#ffffff',
    },
  })
}

interface Props {
  data: CvData
  theme: LisaTheme
}

export function LisaTemplate({ data, theme }: Props) {
  const styles = makeStyles(theme)
  const { profile, skills } = data
  const sections = data.sections ?? []

  const contactParts: string[] = []
  if (profile.email) contactParts.push(profile.email)
  if (profile.phone) contactParts.push(profile.phone)
  if (profile.address) profile.address.split('\n').forEach((line) => contactParts.push(line))
  if (profile.website) contactParts.push(profile.website)

  return (
    <Page size="A4">
      <View style={styles.page}>

      
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: "50mm",
        marginBottom: "10mm",
        fontSize: fontSizeMap[theme.fontSize] + 2,
      }}>
        <View>
          <Text>Persönliche Daten</Text>
          <Text >{profile.name}</Text>
          <Text >{profile.title}</Text>
        
          {contactParts.map((part, i) => (
            <Text key={i} >{part}</Text>
          ))}
        </View>
        <View>
          <Image style={{
            height: "50mm",
            aspectRatio: 3/4
          }} src={profile.photo} />
        </View>
      </View>

      {/* Sections */}
      {sections.map((section) =>
        section.entries.length > 0 ? (
          <View key={section.id} >
            <Text >{section.name}</Text>
            {section.entries.map((entry) => (
              <View key={entry.id}>
                <View >
                  <Text >{entry.title}</Text>
                  <Text >{entry.period}</Text>
                </View>
                <Text >{entry.subtitle}</Text>
                {entry.description ? (
                  <Text >{entry.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <View >
          <Text>Kenntnisse</Text>
          <Text >
            {skills.map((s) => s.label).join(' · ')}
          </Text>
        </View>
      )}
      </View>
    </Page>
  )
}
