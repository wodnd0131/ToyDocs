import { Issue } from '@/types';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: "로그인 세션 만료 문제 수정",
    description: "사용자가 장시간 사용 후 갑작스럽게 로그아웃되는 문제를 해결해야 합니다. 세션 관리 로직을 개선하고 자동 연장 기능을 구현해야 합니다.",
    assignee: "김개발",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-07-05",
    createdAt: "2024-07-02T09:00:00Z",
    updatedAt: "2024-07-02T14:30:00Z",
    estimatedHours: 6,
    timeTracked: 3,
    tags: ["authentication", "backend", "critical"],
    autoGenerated: true,
    source: {
      type: "slack",
      reference: "Slack Thread #1",
      extractedFrom: "#dev-team"
    },
    relatedMeetingRecord: {
      topic: "스프린트 회의 - 로그인 이슈",
      participants: ["임현우", "김개발", "이백엔드"],
      keyPoints: [
        "사용자들이 세션 만료로 인한 불편함 호소",
        "세션 유지 시간 30분으로 너무 짧음",
        "자동 연장 기능 필요성 대두"
      ],
      actionItems: [
        "세션 관리 로직 검토 및 개선",
        "자동 연장 기능 구현",
        "사용자 테스트 진행"
      ],
      conclusion: "우선순위 높음으로 설정, 이번 주 내 완료 목표"
    }
  },
  {
    id: '2',
    title: "메인 페이지 UI 반응형 개선",
    description: "모바일과 태블릿에서 레이아웃이 깨지는 문제를 수정하고 터치 인터페이스 최적화를 진행합니다.",
    assignee: "박디자인",
    priority: "medium",
    status: "todo",
    dueDate: "2024-07-08",
    createdAt: "2024-07-01T15:30:00Z",
    updatedAt: "2024-07-01T15:30:00Z",
    estimatedHours: 8,
    timeTracked: 0,
    tags: ["frontend", "responsive", "ui"],
    autoGenerated: true,
    source: {
      type: "voice",
      reference: "회의 녹음 파일",
      extractedFrom: "design_meeting_20240701.mp3"
    },
    relatedMeetingRecord: {
      topic: "디자인 리뷰 회의",
      participants: ["박디자인", "임현우", "최테스터"],
      keyPoints: [
        "사용자 피드백에서 모바일 사용성 지적",
        "태블릿 화면에서 버튼이 너무 작음",
        "스크롤 성능 이슈 보고됨"
      ],
      actionItems: [
        "반응형 브레이크포인트 재설정",
        "터치 타겟 사이즈 확대",
        "성능 최적화 진행"
      ],
      conclusion: "다음 주까지 프로토타입 완성 후 사용자 테스트"
    }
  },
  {
    id: '3',
    title: "API 응답 속도 최적화",
    description: "사용자 데이터 조회 API의 응답 시간이 3초 이상 걸리는 문제를 해결해야 합니다. 데이터베이스 쿼리 최적화와 캐싱 전략이 필요합니다.",
    assignee: "이백엔드",
    priority: "critical",
    status: "review",
    dueDate: "2024-07-04",
    createdAt: "2024-06-28T11:00:00Z",
    updatedAt: "2024-07-02T16:45:00Z",
    estimatedHours: 12,
    timeTracked: 10,
    tags: ["backend", "performance", "database"],
    autoGenerated: false,
    source: {
      type: "manual",
      reference: "성능 모니터링 알람"
    }
  },
  {
    id: '4',
    title: "사용자 권한 관리 시스템 구현",
    description: "역할 기반 접근 제어(RBAC) 시스템을 구현하여 관리자, 일반 사용자, 게스트별로 다른 접근 권한을 부여합니다.",
    assignee: "이백엔드",
    priority: "medium",
    status: "todo",
    dueDate: "2024-07-15",
    createdAt: "2024-06-25T10:00:00Z",
    updatedAt: "2024-06-25T10:00:00Z",
    estimatedHours: 16,
    timeTracked: 0,
    tags: ["security", "backend", "rbac"],
    autoGenerated: true,
    source: {
      type: "ai_recommendation",
      reference: "보안 감사 결과"
    }
  },
  {
    id: '5',
    title: "실시간 알림 시스템 개발",
    description: "WebSocket을 이용한 실시간 알림 기능을 구현합니다. 새로운 이슈 생성, 상태 변경, 댓글 등의 이벤트를 실시간으로 전달합니다.",
    assignee: "김개발",
    priority: "low",
    status: "todo",
    dueDate: "2024-07-20",
    createdAt: "2024-06-30T14:00:00Z",
    updatedAt: "2024-06-30T14:00:00Z",
    estimatedHours: 20,
    timeTracked: 0,
    tags: ["realtime", "websocket", "notifications"],
    autoGenerated: true,
    source: {
      type: "slack",
      reference: "기능 개선 요청",
      extractedFrom: "#feature-requests"
    }
  },
  {
    id: '6',
    title: "다국어 지원 추가",
    description: "영어와 일본어 지원을 추가하여 글로벌 사용자들이 서비스를 이용할 수 있도록 합니다. i18n 라이브러리를 도입하고 번역 작업을 진행합니다.",
    assignee: "박디자인",
    priority: "low",
    status: "done",
    dueDate: "2024-06-30",
    createdAt: "2024-06-15T09:00:00Z",
    updatedAt: "2024-06-29T17:30:00Z",
    estimatedHours: 24,
    timeTracked: 22,
    tags: ["i18n", "localization", "frontend"],
    autoGenerated: false,
    source: {
      type: "manual",
      reference: "프로덕트 로드맵"
    }
  }
];