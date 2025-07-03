export interface MeetingMinutes {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  content: string;
  sourceType: 'slack' | 'voice' | 'manual';
  rawInput: string;
  createdAt: string;
  updatedAt: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  conclusion?: string;
  tags?: string[];
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
  estimatedHours?: number;
}

export interface SlackThread {
  id: number;
  channelName: string;
  participants: string[];
  messages: SlackMessage[];
  extractedAt?: string;
}

export interface SlackMessage {
  id: number;
  user: string;
  avatar: string;
  time: string;
  message: string;
  isBot: boolean;
  replies?: SlackMessage[];
}

export interface VoiceFile {
  id: string;
  filename: string;
  duration: number;
  fileSize: number;
  uploadedAt: string;
  transcription?: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}