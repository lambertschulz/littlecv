export interface Profile {
  name: string
  title: string
  email: string
  phone: string
  address?: string
  website?: string
  photo?: string // base64-encoded image
}

export interface Experience {
  id: string
  company: string
  role: string
  period: string
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  period: string
  description?: string
}

export interface Skill {
  id: string
  label: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface CoverLetter {
  recipient: string
  recipientAddress?: string
  subject?: string
  body: string
  date: string
}

export interface CoverPage {
  company: string
  position: string
  date: string
}

export interface CvData {
  profile: Profile
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  coverLetter?: CoverLetter
  coverPage?: CoverPage
}

export type ExportScope = 'all' | 'cv' | 'coverLetter' | 'coverPage'

export type ActiveView = 'editor' | 'preview'
