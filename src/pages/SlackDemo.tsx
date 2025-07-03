import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Bot,
  Users,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
  GitBranch,
  Edit3,
  Save,
  ChevronDown,
  ChevronRight,
  FileSearch,
  Reply,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/common/FileUpload";
import MeetingService from "@/services/api/MeetingService";
import AIService from "@/services/ai/AIService";
import { SlackMessage as SlackMessageType } from "@/types";
import { cn } from "@/lib/utils";
import { IssueEditModal } from "@/components/common/IssueEditModal";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SlackMessage {
  id: number;
  user: string;
  avatar: string;
  time: string;
  message: string;
  isBot: boolean;
  replies?: SlackMessage[];
}

interface MeetingRecord {
  topic: string;
  participants: string[];
  keyPoints: string[];
  actionItems: string[];
  conclusion: string;
}

interface GeneratedIssue {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  estimatedHours: string;
  source: string;
  createdAt: string;
  dueDate: string;
  meetingRecord: MeetingRecord;
  isRegistering?: boolean;
  registeredMessage?: string;
}

const SlackDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedIssues, setGeneratedIssues] = useState<GeneratedIssue[]>([]);
  const [meetingContent, setMeetingContent] = useState("");
  const [expandedThreads, setExpandedThreads] = useState<Set<number>>(
    new Set([1])
  );
  const [extractingThread, setExtractingThread] = useState<number | null>(null);
  const [aiSummary, setAiSummary] = useState<MeetingRecord | null>(null);
  const [isSummaryGenerated, setIsSummaryGenerated] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreatingIssues, setIsCreatingIssues] = useState(false);
  const [issueCreationStep, setIssueCreationStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<GeneratedIssue | null>(null);
  const [isDragOverTextarea, setIsDragOverTextarea] = useState(false);

  const summaryCardRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const generationSteps = [
    "슬랙 스레드 분석 중...",
    "주제와 키워드 추출 중...",
    "참여자별 의견 정리 중...",
    "액션 아이템 도출 중...",
    "문서 구조화 중...",
    "최종 검토 및 완료!",
  ];

  const participantColorStyles = [
    { bg: "bg-red-400", text: "text-white" },
    { bg: "bg-orange-400", text: "text-white" },
    { bg: "bg-amber-400", text: "text-black" },
    { bg: "bg-yellow-400", text: "text-black" },
    { bg: "bg-lime-400", text: "text-black" },
    { bg: "bg-green-400", text: "text-white" },
    { bg: "bg-emerald-400", text: "text-white" },
    { bg: "bg-teal-400", text: "text-white" },
    { bg: "bg-cyan-400", text: "text-black" },
    { bg: "bg-sky-400", text: "text-white" },
    { bg: "bg-blue-400", text: "text-white" },
    { bg: "bg-indigo-400", text: "text-white" },
    { bg: "bg-violet-400", text: "text-white" },
    { bg: "bg-purple-400", text: "text-white" },
    { bg: "bg-fuchsia-400", text: "text-white" },
    { bg: "bg-pink-400", text: "text-white" },
    { bg: "bg-rose-400", text: "text-white" },
  ];

  const getParticipantColorStyle = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % participantColorStyles.length);
    return participantColorStyles[index];
  };

  const issueCreationSteps = [
    "회의록 분석 및 요약...",
    "이슈 항목 식별 중...",
    "담당자 및 우선순위 할당...",
    "이슈 티켓 생성 중...",
    "프로젝트 보드에 등록 중...",
    "완료!",
  ];

  const slackMessages: SlackMessage[] = [
    {
      id: 1,
      user: "임현우",
      avatar: "임현",
      time: "14:30",
      message:
        "📋 스프린트 15 회의를 시작하겠습니다. 오늘 주요 안건은 다음과 같습니다:\n\n1. 로그인 세션 버그 해결 방안\n2. 메인 페이지 UI 개선 사항\n3. API 성능 최적화 계획\n4. 다음 스프린트 일정 조율\n\n각자 의견과 진행 상황을 공유해주세요.",
      isBot: false,
      replies: [
        {
          id: 11,
          user: "김개발",
          avatar: "김개",
          time: "14:32",
          message:
            "로그인 세션 버그 관련해서 분석 결과 공유드립니다. JWT 토큰 만료 시간이 30분으로 너무 짧게 설정되어 있어서 사용자들이 자주 로그아웃되는 문제가 있네요. 해결 방안으로는:\n\n1. 토큰 만료 시간을 2시간으로 연장\n2. 자동 갱신 기능 구현\n3. 로그아웃 전 경고 팝업 추가\n\n예상 작업 시간: 6시간",
          isBot: false,
        },
        {
          id: 12,
          user: "박디자인",
          avatar: "박디",
          time: "14:35",
          message:
            "UI 개선 관련해서 사용자 피드백을 정리했습니다:\n\n📊 주요 피드백:\n• 메인 페이지 로딩이 느림 (응답자 67%)\n• 검색 기능을 찾기 어려움 (응답자 45%)\n• 모바일에서 버튼이 너무 작음 (응답자 52%)\n\n🎯 개선 계획:\n• 상단 네비게이션 재설계\n• 검색바를 더 눈에 띄게 배치\n• 모바일 터치 타겟 44px 이상으로 확대\n\n예상 작업 시간: 8시간",
          isBot: false,
        },
        {
          id: 13,
          user: "이백엔드",
          avatar: "이백",
          time: "14:38",
          message:
            "API 성능 이슈 분석 완료했습니다. 현재 문제점들:\n\n⚠️ 주요 문제:\n• 사용자 데이터 조회 API 평균 응답시간 3.2초\n• 데이터베이스 쿼리 최적화 필요\n• 불필요한 JOIN 연산이 많음\n\n🚀 최적화 계획:\n• 인덱스 재설계\n• 쿼리 리팩토링\n• Redis 캐싱 도입\n• API 응답 데이터 최소화\n\n목표: 1초 이내 응답 시간\n예상 작업 시간: 12시간",
          isBot: false,
        },
        {
          id: 14,
          user: "최테스터",
          avatar: "최테",
          time: "14:41",
          message:
            "QA 관점에서 추가 의견 드립니다:\n\n🧪 테스트 계획:\n• 로그인 세션 관련 엣지 케이스 테스트 필요\n• UI 변경사항에 대한 크로스 브라우저 테스트\n• API 성능 테스트 및 부하 테스트\n\n📋 제안사항:\n• 자동화 테스트 케이스 추가\n• 성능 모니터링 대시보드 구축\n\n예상 작업 시간: 4시간",
          isBot: false,
        },
        {
          id: 15,
          user: "임현우",
          avatar: "임현",
          time: "14:44",
          message:
            "좋은 분석들 감사합니다! 우선순위와 일정을 정리하면:\n\n🔥 이번 주 (긴급):\n• 로그인 세션 버그 수정 (김개발)\n• API 성능 최적화 1단계 (이백엔드)\n\n📅 다음 주:\n• UI 개선 작업 (박디자인)\n• 테스트 케이스 작성 (최테스터)\n\n💡 결정사항:\n• 매일 오전 10시 진행상황 체크\n• 금요일에 중간 데모 진행\n• 성능 목표: 로그인 속도 50% 개선, API 응답 1초 이내\n\n모두 동의하시나요?",
          isBot: false,
        },
        {
          id: 16,
          user: "김개발",
          avatar: "김개",
          time: "14:45",
          message: "네, 동의합니다! 로그인 이슈부터 바로 시작하겠습니다. 목요일까지 완료 목표로 하겠습니다.",
          isBot: false,
        },
        {
          id: 17,
          user: "박디자인",
          avatar: "박디",
          time: "14:46",
          message: "좋습니다! UI 개선 작업은 와이어프레임부터 시작해서 단계적으로 진행하겠습니다.",
          isBot: false,
        },
        {
          id: 18,
          user: "이백엔드",
          avatar: "이백",
          time: "14:47",
          message: "API 최적화 작업 시작하겠습니다. 먼저 병목 지점 상세 분석부터 진행할게요.",
          isBot: false,
        },
        {
          id: 19,
          user: "최테스터",
          avatar: "최테",
          time: "14:48",
          message: "테스트 환경 준비하고 자동화 스크립트 작성하겠습니다. 혹시 추가로 테스트해야 할 시나리오 있으면 알려주세요!",
          isBot: false,
        }
      ],
    }
  ];

  useEffect(() => {
    if (isSummaryGenerated && summaryCardRef.current) {
      summaryCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isSummaryGenerated]);

  const toggleThread = (messageId: number) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedThreads(newExpanded);
  };

  const extractMeetingRecord = async (message: SlackMessage) => {
    setExtractingThread(message.id);
    setAiSummary(null);
    setIsSummaryGenerated(false);
    setGeneratedIssues([]);
    setCurrentStep(0);

    try {
      for (let i = 0; i < generationSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentStep(i + 1);
      }

      const threadContent = [message, ...(message.replies || [])];
      const participants = [...new Set(threadContent.map((msg) => msg.user))];

      const summary: MeetingRecord = {
        topic: "스프린트 15 회의 - 주요 안건 논의",
        participants,
        keyPoints: [
          "로그인 세션 버그: JWT 만료 시간 30분으로 짧음",
          "UI 개선: 메인 페이지 로딩 속도, 검색 기능, 모바일 버튼 크기 문제",
          "API 성능: 사용자 데이터 조회 API 응답 시간 3.2초, DB 쿼리 최적화 필요",
          "QA: 엣지 케이스 테스트 및 자동화 필요",
        ],
        actionItems: [
          "로그인 세션 버그 수정 (담당: 김개발, 예상: 6시간)",
          "메인 페이지 UI/UX 개선 (담당: 박디자인, 예상: 8시간)",
          "API 성능 최적화 1단계 (담당: 이백엔드, 예상: 12시간)",
          "자동화 테스트 케이스 작성 (담당: 최테스터, 예상: 4시간)",
        ],
        conclusion: "로그인 및 API 최적화를 최우선으로 진행하며, 금요일 중간 데모 목표.",
      };

      setAiSummary(summary);
      setIsSummaryGenerated(true);
      setEditedSummary(JSON.stringify(summary, null, 2));

      toast({
        title: "✅ AI 회의록 초안 생성 완료",
        description: "AI가 생성한 회의록 초안을 확인하고 이슈를 생성해주세요.",
      });
    } catch (error) {
      console.error("Failed to extract meeting record:", error);
      toast({
        title: "오류 발생",
        description: "회의록을 추출하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setExtractingThread(null);
    }
  };

  const handleCreateIssues = async () => {
    if (!aiSummary) return;

    setIsCreatingIssues(true);
    setIssueCreationStep(0);

    try {
      for (let i = 0; i < issueCreationSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setIssueCreationStep(i + 1);
      }

      const finalSummary = isEditingSummary ? JSON.parse(editedSummary) : aiSummary;

      const newIssues: GeneratedIssue[] = [
        {
          id: Date.now(),
          title: "로그인 세션 만료 버그 수정",
          description: `JWT 토큰 만료 시간이 30분으로 설정되어 사용자가 자주 로그아웃되는 문제를 해결해야 합니다.\n\n📋 작업 내용:\n• 토큰 만료 시간을 2시간으로 연장\n• 자동 갱신 기능 구현\n• 로그아웃 전 경고 팝업 추가\n\n🎯 목표: 사용자 세션 유지 개선`,
          priority: "high",
          assignee: "김개발",
          estimatedHours: "6h",
          source: `Slack 스프린트 회의`, 
          createdAt: new Date().toLocaleString("ko-KR"),
          dueDate: "2024-07-11",
          meetingRecord: finalSummary,
        },
        {
          id: Date.now() + 1,
          title: "메인 페이지 UI/UX 개선",
          description: `사용자 피드백을 바탕으로 메인 페이지의 사용성을 개선합니다.\n\n📊 주요 문제점:\n• 메인 페이지 로딩 속도 (67% 지적)\n• 검색 기능 접근성 (45% 지적)\n• 모바일 버튼 크기 (52% 지적)\n\n🎯 개선 목표:\n• 상단 네비게이션 재설계\n• 검색바 접근성 향상\n• 터치 타겟 44px 이상 확대`,
          priority: "medium",
          assignee: "박디자인",
          estimatedHours: "8h",
          source: `Slack 스프린트 회의`,
          createdAt: new Date().toLocaleString("ko-KR"),
          dueDate: "2024-07-15",
          meetingRecord: finalSummary,
        },
        {
          id: Date.now() + 2,
          title: "API 성능 최적화 - 1단계",
          description: `사용자 데이터 조회 API의 응답 시간을 3.2초에서 1초 이내로 개선합니다.\n\n⚠️ 현재 문제:\n• 평균 응답시간 3.2초\n• 불필요한 JOIN 연산 과다\n• 데이터베이스 인덱스 미최적화\n\n🚀 해결 방안:\n• 인덱스 재설계\n• 쿼리 리팩토링\n• Redis 캐싱 도입\n• 응답 데이터 최소화`,
          priority: "high",
          assignee: "이백엔드",
          estimatedHours: "12h",
          source: `Slack 스프린트 회의`,
          createdAt: new Date().toLocaleString("ko-KR"),
          dueDate: "2024-07-12",
          meetingRecord: finalSummary,
        },
        {
          id: Date.now() + 3,
          title: "자동화 테스트 케이스 작성",
          description: `QA 프로세스 개선을 위한 자동화 테스트 환경을 구축합니다.\n\n🧪 테스트 범위:\n• 로그인 세션 엣지 케이스\n• UI 변경사항 크로스 브라우저 테스트\n• API 성능 및 부하 테스트\n\n📋 추가 작업:\n• 성능 모니터링 대시보드 구축\n• 자동화 스크립트 작성`,
          priority: "medium",
          assignee: "최테스터",
          estimatedHours: "4h",
          source: `Slack 스프린트 회의`,
          createdAt: new Date().toLocaleString("ko-KR"),
          dueDate: "2024-07-15",
          meetingRecord: finalSummary,
        }
      ];

      setGeneratedIssues(newIssues);
      setIsSummaryGenerated(false);
      setAiSummary(null);
      setIsEditingSummary(false);

      toast({
        title: "🎉 이슈 생성 완료!",
        description: `${newIssues.length}개의 이슈가 성공적으로 생성되었습니다.`,
      });
    } catch (error) {
      console.error("Failed to create issues:", error);
      toast({
        title: "오류 발생",
        description: "이슈를 생성하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingIssues(false);
    }
  };

  const handleEditIssue = (issue: GeneratedIssue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleSaveIssue = (updatedIssue: GeneratedIssue) => {
    setGeneratedIssues(prev =>
      prev.map(issue => (issue.id === updatedIssue.id ? updatedIssue : issue))
    );
    toast({
      title: "이슈가 수정되었습니다.",
      description: `${updatedIssue.title} 이슈가 성공적으로 업데이트되었습니다.`,
    });
  };

  const handleRegisterIssue = (issue: GeneratedIssue) => {
    setGeneratedIssues(prev =>
      prev.map(i =>
        i.id === issue.id
          ? { ...i, isRegistering: true, registeredMessage: `✅ "${i.title}" 이슈가 등록되었습니다!` }
          : i
      )
    );

    setTimeout(() => {
      setGeneratedIssues(prev => prev.filter(i => i.id !== issue.id));
      toast({
        title: "이슈 등록 완료",
        description: `"${issue.title}" 이슈가 성공적으로 등록되었습니다.`, 
      });
    }, 3500); // 애니메이션 시간과 일치
  };

  const handleFileSelectForMeeting = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const file = files[0];

    // Simulate file reading and content extraction
    const dummyContent = `## ${file.name} 파일에서 추출된 회의록\n\n- 파일 크기: ${file.size} bytes\n- 파일 타입: ${file.type}\n\n이 파일은 회의록 내용을 담고 있습니다. 주요 논의 사항은 다음과 같습니다:\n\n1.  **프로젝트 A 진행 상황**: 현재 80% 완료되었으며, 다음 주까지 마무리 예정입니다.\n2.  **새로운 기능 B 개발**: 초기 설계 단계에 있으며, 다음 스프린트부터 본격적으로 착수할 예정입니다.\n3.  **팀 빌딩 활동**: 다음 달 첫째 주 금요일에 진행하기로 결정되었습니다.\n\n---`;
    setMeetingContent(dummyContent);

    toast({
      title: "파일 처리 완료!",
      description: `${file.name} 파일에서 회의록 내용이 추출되었습니다.`,
    });
    setIsProcessing(false);
  };

  const handleFileDropToTextarea = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverTextarea(false);

    if (isCreatingIssues) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    // For demo, we only process the first file

    setIsCreatingIssues(true);
    setIssueCreationStep(0);

    try {
      for (let i = 0; i < issueCreationSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setIssueCreationStep(i + 1);
      }

      const dummyContent = `## ${file.name} 파일에서 추출된 회의록\n\n- 파일 크기: ${file.size} bytes\n- 파일 타입: ${file.type}\n\n이 파일은 드래그 앤 드롭으로 추출된 회의록 내용입니다. 주요 논의 사항은 다음과 같습니다:\n\n1.  **드래그 앤 드롭 기능 구현**: 성공적으로 구현되었습니다.\n2.  **단계별 로딩 적용**: 파일 처리 과정이 시각적으로 표시됩니다.\n3.  **사용자 경험 개선**: 더욱 직관적인 인터페이스를 제공합니다.\n\n---`;
      setMeetingContent(dummyContent);

      toast({
        title: "파일에서 회의록 추출 완료!",
        description: `${file.name} 파일에서 회의록 내용이 성공적으로 추출되었습니다.`,
      });
    } catch (error) {
      console.error("Failed to process file from textarea drop:", error);
      toast({
        title: "파일 처리 실패",
        description: "파일을 처리하는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingIssues(false);
    }
  };

  const handleDragOverTextarea = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCreatingIssues) {
      setIsDragOverTextarea(true);
    }
  };

  const handleDragLeaveTextarea = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverTextarea(false);
  };

  const handleMeetingTextProcess = async () => {
    if (!meetingContent.trim()) {
      toast({
        title: "회의록을 입력해주세요",
        description: "처리할 회의록 내용을 작성해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingIssues(true);
    setIssueCreationStep(0);

    try {
      for (let i = 0; i < issueCreationSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setIssueCreationStep(i + 1);
      }

      // Simulate AI processing and issue generation
      const newIssues: GeneratedIssue[] = [
        {
          id: Date.now(),
          title: "회의록 기반 로그인 버그 수정",
          description: `작성된 회의록 내용에 따라 로그인 버그 수정이 필요합니다.\n\n세부 내용:\n${meetingContent.substring(0, 100)}...`,
          priority: "high",
          assignee: "자동할당",
          estimatedHours: "8h",
          source: `수동 작성 회의록`,
          createdAt: new Date().toLocaleString("ko-KR"),
          dueDate: "2024-07-18",
          meetingRecord: {
            topic: "수동 작성 회의록",
            participants: ["작성자"],
            keyPoints: ["로그인 버그", "UI 개선", "DB 최적화"],
            actionItems: ["버그 수정", "UI 작업", "DB 작업"],
            conclusion: "회의록 내용 기반 이슈 생성",
          },
        },
        {
          id: Date.now() + 1,
          title: "회의록 기반 UI 개선 작업",
          description: `작성된 회의록 내용에 따라 UI 개선 작업이 필요합니다.\n\n세부 내용:\n${meetingContent.substring(0, 100)}...`,
          priority: "medium",
          assignee: "자동할당",
          estimatedHours: "6h",
          source: `수동 작성 회의록`,
          createdAt: new Date().toLocaleString("ko-KR"),
          dueDate: "2024-07-20",
          meetingRecord: {
            topic: "수동 작성 회의록",
            participants: ["작성자"],
            keyPoints: ["로그인 버그", "UI 개선", "DB 최적화"],
            actionItems: ["버그 수정", "UI 작업", "DB 작업"],
            conclusion: "회의록 내용 기반 이슈 생성",
          },
        },
      ];

      setGeneratedIssues((prev) => [...newIssues, ...prev]);
      
      toast({
        title: "텍스트 분석 완료!",
        description: `${newIssues.length}개의 이슈가 생성되었습니다.`,
      });
    } catch (error) {
      console.error("Failed to process text meeting:", error);
      toast({
        title: "텍스트 분석 실패",
        description: "텍스트를 분석하는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingIssues(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-github-dark min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-toss-blue" />
            Slack 연동 데모
          </h1>
          <p className="text-gray-400 mt-2">
            실시간 협업과 자동 문서화를 경험해보세요
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="slack" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-github-darkSecondary border-github-border">
          <TabsTrigger
            value="slack"
            className="text-white data-[state=active]:bg-toss-blue"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Slack 채널
          </TabsTrigger>
          <TabsTrigger
            value="meeting"
            className="text-white data-[state=active]:bg-toss-blue"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            회의록 작성
          </TabsTrigger>
        </TabsList>

        {/* Slack Tab */}
        <TabsContent value="slack" className="space-y-6">
          <div className="grid grid-cols-1  gap-6">
            {/* Enhanced Slack Chat with Threads */}
            <Card className="bg-github-darkSecondary border-github-border relative">
              {extractingThread !== null && (
                <div className="absolute inset-0 bg-github-dark/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                  <div className="w-16 h-16 border-4 border-toss-blue border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white mt-4 font-semibold animate-pulse">
                    {generationSteps[currentStep - 1]}
                  </p>
                  <div className="w-64 bg-github-border rounded-full h-2 mt-2">
                    <div 
                      className="bg-toss-blue h-2 rounded-full transition-all duration-500"
                      style={{width: `${(currentStep / generationSteps.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                    #dev-team 채널
                  </div>
                  <div className="text-xs text-gray-400 font-normal">
                    💡 스레드의 "회의록 추출" 버튼을 클릭해보세요
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {slackMessages.map((msg) => (
                    <div key={msg.id} className="space-y-3">
                      {/* Main Message */}
                      <div className="flex space-x-3 group">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback
                            className={`text-xs ${
                              msg.isBot ? "bg-purple-600" : "bg-toss-blue"
                            } text-white`}
                          >
                            {msg.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-white">
                                {msg.user}
                              </span>
                              <span className="text-xs text-gray-400">
                                {msg.time}
                              </span>
                              {msg.isBot && (
                                <Badge className="bg-purple-600 text-white text-xs">
                                  <Bot className="w-3 h-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            {/* Extract Meeting Record Button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-white hover:bg-github-dark"
                              onClick={() => extractMeetingRecord(msg)}
                              disabled={extractingThread !== null}
                            >
                              {extractingThread === msg.id ? (
                                <>
                                  <Zap className="w-3 h-3 mr-1 animate-pulse" />
                                  분석중...
                                </> 
                              ) : (
                                <>
                                  <FileSearch className="w-3 h-3 mr-1" />
                                  회의록 추출
                                </> 
                              )}
                            </Button>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {msg.message}
                          </p>

                          {/* Thread Toggle */}
                          {msg.replies && msg.replies.length > 0 && (
                            <button
                              onClick={() => toggleThread(msg.id)}
                              className="flex items-center space-x-2 mt-2 text-xs text-toss-blue hover:text-toss-blue/80 transition-colors"
                            >
                              {expandedThreads.has(msg.id) ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                              <Reply className="w-3 h-3" />
                              <span>{msg.replies.length}개의 팀원 의견</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Thread Replies */}
                      {msg.replies && expandedThreads.has(msg.id) && (
                        <div className="ml-11 space-y-3 border-l-2 border-github-border pl-4">
                          {msg.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <Avatar className="w-6 h-6 flex-shrink-0">
                                <AvatarFallback className="text-xs bg-gray-600 text-white">
                                  {reply.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-xs font-medium text-white">
                                    {reply.user}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {reply.time}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed">
                                  {reply.message}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-github-border pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>5명 온라인</span>
                    <span>•</span>
                    <span>실시간 동기화 중</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            {/* <Card className="bg-github-darkSecondary border-github-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-toss-blue" />
                  파일 업로드
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-github-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="meeting-upload"
                    className="hidden"
                    accept=".txt,.doc,.docx,.pdf"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                  <label 
                    htmlFor="meeting-upload" 
                    className={`cursor-pointer ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="space-y-4">
                      {isProcessing ? (
                        <>
                          <div className="w-16 h-16 bg-toss-blue/20 rounded-full flex items-center justify-center mx-auto">
                            <Zap className="w-8 h-8 text-toss-blue animate-pulse" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-white">처리 중...</p>
                            <p className="text-sm text-gray-400">AI가 회의록을 분석하고 있습니다</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-toss-blue/20 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="w-8 h-8 text-toss-blue" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-white">회의록 업로드</p>
                            <p className="text-sm text-gray-400">파일을 선택하거나 드래그해서 업로드하세요</p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>*/}
          </div>
        </TabsContent>

        {/* Meeting Tab */}
        <TabsContent value="meeting" className="space-y-6">
          {generatedIssues.length === 0 && (
            <Card className="bg-github-darkSecondary border-github-border relative">
              {isCreatingIssues && (
                <div className="absolute inset-0 bg-github-dark/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                  <div className="w-16 h-16 border-4 border-toss-blue border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white mt-4 font-semibold animate-pulse">
                    {issueCreationSteps[issueCreationStep - 1]}
                  </p>
                  <div className="w-64 bg-github-border rounded-full h-2 mt-2">
                    <div 
                      className="bg-toss-blue h-2 rounded-full transition-all duration-500"
                      style={{width: `${(issueCreationStep / issueCreationSteps.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Edit3 className="w-5 h-5 mr-2 text-toss-blue" />
                  회의록 작성
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="회의록을 작성해주세요...\n\n예시:\n- 프로젝트 진행 상황 논의\n- 로그인 버그 수정 필요 (담당: 김개발)\n- UI 개선 작업 계획 수립\n- 데이터베이스 성능 최적화 검토\n\n작성하신 내용을 바탕으로 자동으로 이슈를 생성해드립니다."
                    value={meetingContent}
                    onChange={(e) => setMeetingContent(e.target.value)}
                    className={cn(
                      "min-h-[400px] bg-github-dark border-github-border text-white placeholder-gray-400 resize-none",
                      isDragOverTextarea && "border-toss-blue ring-2 ring-toss-blue"
                    )}
                    disabled={isCreatingIssues}
                    onDragOver={handleDragOverTextarea}
                    onDragLeave={handleDragLeaveTextarea}
                    onDrop={handleFileDropToTextarea}
                  />

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      {meetingContent.length} 글자
                    </div>
                    <Button
                      onClick={handleMeetingTextProcess}
                      disabled={isCreatingIssues || !meetingContent.trim()}
                      className="bg-toss-blue hover:bg-toss-blue/90"
                    >
                      {isCreatingIssues ? (
                        <>
                          <Zap className="w-4 h-4 mr-2 animate-pulse" />
                          분석 중...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          이슈 생성
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-github-dark p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-white mb-2">작성 팁</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 작업 항목은 명확하게 작성해주세요</li>
                    <li>• 담당자가 있다면 괄호 안에 표시해주세요</li>
                    <li>
                      • 우선순위나 예상 소요시간을 언급하면 더 정확한 이슈가
                      생성됩니다
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
          {generatedIssues.length > 0 && (
            <div className="min-h-[400px] flex items-center justify-center text-gray-400 text-lg">
              <CheckCircle className="w-8 h-8 mr-2 text-green-500" />
              이슈가 성공적으로 생성되었습니다. 아래에서 확인해주세요.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* AI Generated Summary Card */}
      {isSummaryGenerated && aiSummary && generatedIssues.length === 0 && (
        <div ref={summaryCardRef} className="space-y-6">
          <Card className="bg-github-darkSecondary border-github-border animate-fade-in">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                  AI가 생성한 회의록 초안
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingSummary(!isEditingSummary)}
                    className="text-xs"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    {isEditingSummary ? "수정 취소" : "수정하기"}
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      if (isEditingSummary) {
                        try {
                          const parsed = JSON.parse(editedSummary);
                          setAiSummary(parsed);
                          setIsEditingSummary(false);
                          toast({ title: "✅ 초안이 저장되었습니다." });
                        } catch {
                          toast({ title: "❌ 잘못된 JSON 형식입니다.", variant: "destructive" });
                        }
                      } else {
                        handleCreateIssues();
                      }
                    }}
                    className="bg-toss-blue hover:bg-toss-blue/90 text-xs"
                    disabled={isCreatingIssues}
                  >
                    {isCreatingIssues ? (
                      <><Zap className="w-3 h-3 mr-1 animate-pulse" /> 생성 중...</>
                    ) : isEditingSummary ? (
                      <><Save className="w-3 h-3 mr-1" /> 저장</>
                    ) : (
                      <><Check className="w-3 h-3 mr-1" /> 이슈 생성</>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              {isCreatingIssues && (
                <div className="absolute inset-0 bg-github-dark/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                  <div className="w-16 h-16 border-4 border-toss-blue border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white mt-4 font-semibold animate-pulse">
                    {issueCreationSteps[issueCreationStep - 1]}
                  </p>
                  <div className="w-64 bg-github-border rounded-full h-2 mt-2">
                    <div 
                      className="bg-toss-blue h-2 rounded-full transition-all duration-500"
                      style={{width: `${(issueCreationStep / issueCreationSteps.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
              )}

              {isEditingSummary ? (
                <Textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="min-h-[300px] bg-github-dark border-github-border text-white text-xs font-mono"
                />
              ) : (
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-white mb-1">주제</h4>
                    <p className="text-gray-300">{aiSummary.topic}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">참여자</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiSummary.participants.map(p => {
                        const { bg, text } = getParticipantColorStyle(p);
                        return (
                          <Badge key={p} className={cn("border-transparent", bg, text)}>
                            {p}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">핵심 내용</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {aiSummary.keyPoints.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">액션 아이템</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {aiSummary.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">결론</h4>
                    <p className="text-gray-300">{aiSummary.conclusion}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generated Issues */}
      {generatedIssues.length > 0 && (
        <Card className="bg-github-darkSecondary border-github-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <GitBranch className="w-5 h-5 mr-2 text-green-500" />
                스프린트 회의에서 생성된 이슈 ({generatedIssues.length}개)
              </div>
              <Badge className="bg-green-600 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                AI 분석 완료
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={cn(
                    "p-4 bg-github-dark rounded-lg border border-github-border overflow-hidden",
                    issue.isRegistering && "animate-issue-register-fade"
                  )}
                >
                  {issue.isRegistering ? (
                    <div className="flex items-center justify-center h-full text-lg font-semibold text-black">
                      {issue.registeredMessage}
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-gray-400 font-mono text-sm">
                            #{issue.id}
                          </span>
                          <h3 className="text-lg font-medium text-white">
                            {issue.title}
                          </h3>
                          <Badge className={getPriorityColor(issue.priority)}>
                            {issue.priority}
                          </Badge>
                        </div>

                        <p className="text-gray-400 text-sm mb-3">
                          {issue.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{issue.assignee}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{issue.estimatedHours}</span>
                          </div>
                          <div className="text-xs text-toss-blue">
                            📄 출처: {typeof issue.source === 'object' ? issue.source.reference : issue.source}
                          </div>
                        </div>

                        {/* Meeting Record Summary */}
                        {issue.meetingRecord && (
                          <div className="mt-3 p-3 bg-github-darkSecondary rounded-lg">
                            <h4 className="text-sm font-medium text-white mb-2">
                              📋 회의록 요약
                            </h4>
                            <div className="text-xs text-gray-400 space-y-1">
                              <p>
                                <strong>참여자:</strong>{" "}
                                {issue.meetingRecord.participants.join(", ")}
                              </p>
                              <p>
                                <strong>결론:</strong>{" "}
                                {issue.meetingRecord.conclusion}
                              </p>
                              <p>
                                <strong>액션 아이템:</strong>{" "}
                                {issue.meetingRecord.actionItems.join(", ")}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="mt-2 text-xs text-gray-500">
                          생성 시간: {issue.createdAt}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditIssue(issue)}
                          className="text-xs text-gray-400 border-github-border hover:bg-github-dark hover:text-white"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          수정
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleRegisterIssue(issue)}
                          className="text-xs bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          등록
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issue Edit Modal */}
      <IssueEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        issue={selectedIssue}
        onSave={handleSaveIssue}
      />

      {/* Demo Features */}
      <Card className="bg-gradient-to-r from-toss-blue/10 to-purple-600/10 border-toss-blue/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bot className="w-5 h-5 mr-2 text-yellow-500" />
            AI 자동화 기능
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-github-darkSecondary rounded-lg">
              <div className="w-12 h-12 bg-toss-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-toss-blue" />
              </div>
              <h3 className="font-medium text-white mb-2">스레드 분석</h3>
              <p className="text-sm text-gray-400">
                슬랙 대화 스레드에서 주요 토론 내용과 액션 아이템을 자동 추출
              </p>
            </div>

            <div className="text-center p-4 bg-github-darkSecondary rounded-lg">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-medium text-white mb-2">자동 회의록 생성</h3>
              <p className="text-sm text-gray-400">
                토론 내용을 구조화된 회의록으로 변환하고 팀 문서화
              </p>
            </div>

            <div className="text-center p-4 bg-github-darkSecondary rounded-lg">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-medium text-white mb-2">스마트 이슈 할당</h3>
              <p className="text-sm text-gray-400">
                참여자별 의견을 분석하여 최적의 담당자에게 자동 할당
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlackDemo;
