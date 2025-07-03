export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'developer' | 'designer' | 'qa';
  team: string;
  skills: string[];
  workload: WorkloadInfo;
  preferences: UserPreferences;
  createdAt: string;
  lastActive: string;
}

export interface WorkloadInfo {
  currentIssues: number;
  estimatedHours: number;
  capacity: number; // hours per week
  availability: 'available' | 'busy' | 'away' | 'vacation';
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    slack: boolean;
    inApp: boolean;
  };
  autoAssignment: boolean;
  defaultPriority: 'low' | 'medium' | 'high';
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  currentTasks: number;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}