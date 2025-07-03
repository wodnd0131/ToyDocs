import { MeetingMinutes } from '@/types';

export const mockMeetings: MeetingMinutes[] = [
  {
    id: '1',
    title: '스프린트 계획 회의 #15',
    date: '2024-07-02',
    attendees: ['임현우', '김개발', '박디자인', '이백엔드', '최테스터'],
    content: `이번 스프린트의 주요 목표와 작업 분배에 대해 논의했습니다.

주요 안건:
1. 로그인 세션 관리 개선 - 사용자 불편 사항이 지속적으로 제기되고 있어 우선순위를 높여 처리하기로 결정
2. 모바일 UI 개선 - 사용자 피드백을 반영하여 반응형 디자인 개선 필요
3. API 성능 최적화 - 응답 시간이 3초 이상 걸리는 문제 해결 시급

결정사항:
- 로그인 이슈를 이번 주 최우선으로 처리
- UI 개선은 다음 주부터 본격 시작
- 성능 최적화는 김개발과 이백엔드가 협업하여 진행`,
    sourceType: 'slack',
    rawInput: 'Slack thread from #dev-team channel',
    createdAt: '2024-07-02T10:00:00Z',
    updatedAt: '2024-07-02T10:00:00Z',
    keyPoints: [
      '로그인 세션 만료 문제 우선 해결',
      '모바일 반응형 UI 개선 필요',
      'API 응답 속도 3초 → 1초 이하로 개선',
      '팀 간 협업 강화 필요'
    ],
    actionItems: [
      {
        id: 'ai-1',
        description: '로그인 세션 관리 로직 개선',
        assignee: '김개발',
        dueDate: '2024-07-05',
        priority: 'high',
        completed: false,
        estimatedHours: 6
      },
      {
        id: 'ai-2',
        description: '모바일 UI 반응형 개선',
        assignee: '박디자인',
        dueDate: '2024-07-08',
        priority: 'medium',
        completed: false,
        estimatedHours: 8
      },
      {
        id: 'ai-3',
        description: '데이터베이스 쿼리 최적화',
        assignee: '이백엔드',
        dueDate: '2024-07-06',
        priority: 'critical',
        completed: false,
        estimatedHours: 10
      }
    ],
    conclusion: '각 팀원별 역할이 명확히 분배되었으며, 우선순위에 따라 작업을 진행하기로 함',
    tags: ['sprint', 'planning', 'team']
  },
  {
    id: '2',
    title: '디자인 시스템 리뷰 회의',
    date: '2024-07-01',
    attendees: ['박디자인', '임현우', '최테스터'],
    content: `새로운 디자인 시스템 도입과 기존 컴포넌트 개선에 대해 논의했습니다.

디자인 시스템 개선사항:
- 컬러 팔레트 업데이트 (접근성 고려)
- 타이포그래피 시스템 정리
- 컴포넌트 라이브러리 확장

사용자 피드백 분석:
- 모바일에서 버튼이 너무 작아 터치하기 어려움
- 다크 모드에서 텍스트 가독성 문제
- 로딩 상태 표시가 불명확함

개선 계획:
- 최소 터치 타겟 44px 이상으로 설정
- 다크 모드 컬러 대비비 개선
- 스켈레톤 UI 도입`,
    sourceType: 'voice',
    rawInput: 'design_review_20240701.mp3',
    createdAt: '2024-07-01T14:00:00Z',
    updatedAt: '2024-07-01T14:00:00Z',
    keyPoints: [
      '접근성을 고려한 디자인 시스템 개선',
      '모바일 사용성 개선 필요',
      '다크 모드 가독성 문제 해결',
      '일관된 로딩 상태 표시 방법 도입'
    ],
    actionItems: [
      {
        id: 'ai-4',
        description: '터치 타겟 사이즈 가이드라인 수립',
        assignee: '박디자인',
        dueDate: '2024-07-05',
        priority: 'high',
        completed: false,
        estimatedHours: 4
      },
      {
        id: 'ai-5',
        description: '다크 모드 컬러 팔레트 개선',
        assignee: '박디자인',
        dueDate: '2024-07-08',
        priority: 'medium',
        completed: false,
        estimatedHours: 6
      },
      {
        id: 'ai-6',
        description: '스켈레톤 UI 컴포넌트 개발',
        assignee: '박디자인',
        dueDate: '2024-07-10',
        priority: 'low',
        completed: false,
        estimatedHours: 8
      }
    ],
    conclusion: '사용자 중심의 디자인 개선을 통해 전반적인 사용 경험 향상을 목표로 함',
    tags: ['design', 'ux', 'accessibility']
  },
  {
    id: '3',
    title: '기술 부채 정리 회의',
    date: '2024-06-30',
    attendees: ['임현우', '김개발', '이백엔드'],
    content: `축적된 기술 부채를 정리하고 코드 품질 개선 방안을 논의했습니다.

주요 기술 부채:
1. 레거시 API 코드 - 5년 전 작성된 코드로 현재 표준에 맞지 않음
2. 테스트 커버리지 부족 - 현재 60%, 80% 이상으로 끌어올려야 함
3. 의존성 업데이트 지연 - 보안 취약점이 있는 패키지들 업데이트 필요
4. 문서화 부족 - API 문서와 개발자 가이드 업데이트 필요

우선순위:
1. 보안 관련 의존성 업데이트 (즉시)
2. 핵심 기능 테스트 코드 작성 (2주 내)
3. 레거시 코드 리팩토링 (1개월 내)
4. 문서화 작업 (지속적)`,
    sourceType: 'manual',
    rawInput: '직접 작성된 회의록',
    createdAt: '2024-06-30T16:00:00Z',
    updatedAt: '2024-06-30T16:00:00Z',
    keyPoints: [
      '보안 취약점이 있는 의존성 즉시 업데이트',
      '테스트 커버리지 60% → 80% 향상',
      '레거시 코드 점진적 리팩토링',
      '개발 문서 지속적 업데이트'
    ],
    actionItems: [
      {
        id: 'ai-7',
        description: '보안 의존성 업데이트',
        assignee: '이백엔드',
        dueDate: '2024-07-02',
        priority: 'critical',
        completed: true,
        estimatedHours: 4
      },
      {
        id: 'ai-8',
        description: '핵심 기능 단위 테스트 작성',
        assignee: '김개발',
        dueDate: '2024-07-15',
        priority: 'high',
        completed: false,
        estimatedHours: 16
      },
      {
        id: 'ai-9',
        description: 'API 문서 업데이트',
        assignee: '임현우',
        dueDate: '2024-07-20',
        priority: 'medium',
        completed: false,
        estimatedHours: 8
      }
    ],
    conclusion: '기술 부채 해결을 통해 장기적인 개발 효율성과 코드 품질 향상을 도모',
    tags: ['tech-debt', 'refactoring', 'security']
  },
  {
    id: '4',
    title: '사용자 피드백 분석 회의',
    date: '2024-06-28',
    attendees: ['임현우', '박디자인', '최테스터', '이기획'],
    content: `지난 달 수집된 사용자 피드백을 분석하고 개선 방향을 수립했습니다.

피드백 분석 결과:
- 총 247개의 피드백 수집
- 만족도: 4.2/5.0 (전월 대비 0.3 상승)
- 주요 불만사항: 느린 로딩 속도 (34%), 복잡한 UI (28%), 기능 부족 (22%)

긍정적 피드백:
- 직관적인 인터페이스 디자인
- 협업 기능의 편리함
- 실시간 동기화 기능

개선이 필요한 영역:
1. 성능 최적화 - 로딩 시간 단축
2. UI 단순화 - 핵심 기능 중심으로 재설계
3. 신규 기능 개발 - 사용자 요청 기능 우선순위 선정`,
    sourceType: 'slack',
    rawInput: 'Slack thread from #product-feedback channel',
    createdAt: '2024-06-28T11:30:00Z',
    updatedAt: '2024-06-28T11:30:00Z',
    keyPoints: [
      '사용자 만족도 지속적 상승 추세',
      '성능 개선이 가장 시급한 과제',
      'UI 복잡성 개선 필요',
      '신규 기능보다 기존 기능 개선 우선'
    ],
    actionItems: [
      {
        id: 'ai-10',
        description: '페이지 로딩 시간 분석 및 개선',
        assignee: '김개발',
        dueDate: '2024-07-10',
        priority: 'high',
        completed: false,
        estimatedHours: 12
      },
      {
        id: 'ai-11',
        description: 'UI 사용성 테스트 진행',
        assignee: '최테스터',
        dueDate: '2024-07-08',
        priority: 'medium',
        completed: false,
        estimatedHours: 6
      },
      {
        id: 'ai-12',
        description: '신규 기능 우선순위 로드맵 작성',
        assignee: '이기획',
        dueDate: '2024-07-12',
        priority: 'low',
        completed: false,
        estimatedHours: 8
      }
    ],
    conclusion: '사용자 중심의 개선을 통해 서비스 품질과 만족도를 지속적으로 향상시켜 나가기로 함',
    tags: ['user-feedback', 'ux', 'product']
  }
];