import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface SlackMessage {
  id: number;
  user: string;
  avatar: string;
  time: string;
  message: string;
  isBot: boolean;
  replies?: SlackMessage[];
}

const SlackDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedIssues, setGeneratedIssues] = useState<any[]>([]);
  const [meetingContent, setMeetingContent] = useState("");
  const [expandedThreads, setExpandedThreads] = useState<Set<number>>(
    new Set()
  );
  const [extractingThread, setExtractingThread] = useState<number | null>(null);
  const { toast } = useToast();

  const slackMessages: SlackMessage[] = [
    {
      id: 1,
      user: "임현우",
      avatar: "임현",
      time: "14:32",
      message:
        "오늘 스프린트 회의 정리했습니다. 로그인 버그 이슈가 우선순위 높네요. 어떻게 생각하시나요?",
      isBot: false,
      replies: [
        {
          id: 11,
          user: "김개발",
          avatar: "김개",
          time: "14:33",
          message:
            "네, 세션 만료 관련해서 내일까지 수정하겠습니다. 예상 작업시간은 4시간 정도입니다.",
          isBot: false,
        },
        {
          id: 12,
          user: "박디자인",
          avatar: "박디",
          time: "14:35",
          message:
            "UI 쪽에서도 세션 만료 시 사용자 경험 개선이 필요할 것 같아요. 함께 진행하면 좋겠습니다.",
          isBot: false,
        },
        {
          id: 13,
          user: "이백엔드",
          avatar: "이백",
          time: "14:37",
          message:
            "데이터베이스 쪽에서 세션 관리 최적화도 같이 해야 할 것 같습니다. 성능 이슈가 있었거든요.",
          isBot: false,
        },
      ],
    },
    {
      id: 2,
      user: "박디자인",
      avatar: "박디",
      time: "15:10",
      message:
        "메인 페이지 리뉴얼 관련해서 사용자 피드백 정리했습니다. 주요 개선 포인트들을 공유드려요.",
      isBot: false,
      replies: [
        {
          id: 21,
          user: "임현우",
          avatar: "임현",
          time: "15:15",
          message:
            "좋네요! 우선순위는 어떻게 잡으셨나요? 이번 스프린트에 포함시킬 수 있을까요?",
          isBot: false,
        },
        {
          id: 22,
          user: "박디자인",
          avatar: "박디",
          time: "15:17",
          message:
            "상단 네비게이션과 검색 기능 개선이 가장 시급해 보입니다. 예상 작업시간은 6시간 정도예요.",
          isBot: false,
        },
      ],
    },
    {
      id: 3,
      user: "AI Assistant",
      avatar: "AI",
      time: "15:30",
      message:
        "🤖 자동 분석 완료: 현재 진행 중인 토론에서 3개의 주요 액션 아이템을 식별했습니다.",
      isBot: true,
      replies: [
        {
          id: 31,
          user: "임현우",
          avatar: "임현",
          time: "15:32",
          message:
            "AI 분석 결과가 정확하네요. 이 내용으로 회의록 작성해주시면 됩니다.",
          isBot: false,
        },
      ],
    },
  ];

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
    console.log("Extracting meeting record from thread:", message.id);

    // AI 분석 시뮬레이션
    setTimeout(() => {
      const threadContent = [message, ...(message.replies || [])];
      const participants = [...new Set(threadContent.map((msg) => msg.user))];
      const mainTopic =
        message.message.length > 50
          ? message.message.substring(0, 50) + "..."
          : message.message;

      // 토론 내용 분석하여 이슈 생성
      const newIssues = [
        {
          id: Date.now(),
          title: `토론 주제: ${mainTopic}`,
          description: `슬랙 토론에서 도출된 주요 액션 아이템\n참여자: ${participants.join(
            ", "
          )}\n토론 시간: ${message.time}`,
          priority: "high",
          assignee:
            participants.find((p) => p !== "AI Assistant") || "자동할당",
          estimatedHours: "4h",
          source: `Slack Thread #${message.id}`,
          createdAt: new Date().toLocaleString("ko-KR"),
          meetingRecord: {
            topic: mainTopic,
            participants: participants,
            keyPoints: threadContent.map(
              (msg) => `${msg.user}: ${msg.message}`
            ),
            actionItems: [
              `${participants[1] || "담당자"} - 주요 작업 진행`,
              `${participants[2] || "담당자"} - 관련 업무 지원`,
            ],
            conclusion: "토론을 통해 우선순위와 담당자가 결정됨",
          },
        },
      ];

      // 복잡한 토론의 경우 추가 이슈 생성
      if (message.replies && message.replies.length > 2) {
        newIssues.push({
          id: Date.now() + 1,
          title: `후속 작업: ${mainTopic} 관련 개선사항`,
          description: `토론에서 언급된 추가 개선 포인트들\n관련 토론: Thread #${message.id}`,
          priority: "medium",
          assignee: participants[participants.length - 1] || "자동할당",
          estimatedHours: "3h",
          source: `Slack Thread #${message.id}`,
          createdAt: new Date().toLocaleString("ko-KR"),
          meetingRecord: {
            topic: `${mainTopic} - 후속작업`,
            participants: participants,
            keyPoints: message.replies.map(
              (reply) => `${reply.user}: ${reply.message}`
            ),
            actionItems: [`관련 업무 진행`, `팀 간 협업 조율`],
            conclusion: "세부 실행 계획 수립 필요",
          },
        });
      }

      setGeneratedIssues((prev) => [...newIssues, ...prev]);
      setExtractingThread(null);

      toast({
        title: "회의록 추출 완료!",
        description: `Thread #${message.id}에서 ${newIssues.length}개의 이슈가 생성되었습니다.`,
      });
    }, 3000);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    console.log("Processing meeting record:", file.name);

    // 실제 처리 시뮬레이션
    setTimeout(() => {
      const newIssues = [
        {
          id: 128,
          title: "로그인 API 버그 수정",
          description: "회의에서 논의된 로그인 시 세션 만료 문제 해결",
          priority: "high",
          assignee: "김개발",
          estimatedHours: "4h",
          source: file.name,
          createdAt: new Date().toLocaleString("ko-KR"),
        },
        {
          id: 129,
          title: "UI/UX 개선 작업",
          description: "사용자 피드백 반영한 메인 페이지 레이아웃 개선",
          priority: "medium",
          assignee: "박디자인",
          estimatedHours: "6h",
          source: file.name,
          createdAt: new Date().toLocaleString("ko-KR"),
        },
        {
          id: 130,
          title: "데이터베이스 최적화",
          description: "회의에서 언급된 쿼리 성능 이슈 해결",
          priority: "critical",
          assignee: "이백엔드",
          estimatedHours: "8h",
          source: file.name,
          createdAt: new Date().toLocaleString("ko-KR"),
        },
      ];

      setGeneratedIssues((prev) => [...newIssues, ...prev]);
      setIsProcessing(false);

      toast({
        title: "이슈 자동 생성 완료!",
        description: `${newIssues.length}개의 이슈가 자동으로 생성되었습니다.`,
      });
    }, 3000);
  };

  const handleMeetingTextProcess = () => {
    if (!meetingContent.trim()) {
      toast({
        title: "회의록을 입력해주세요",
        description: "처리할 회의록 내용을 작성해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // 텍스트 처리 시뮬레이션
    setTimeout(() => {
      const newIssues = [
        {
          id: Date.now(),
          title: "텍스트 기반 이슈 생성",
          description: "회의록 텍스트에서 추출된 작업 항목",
          priority: "medium",
          assignee: "자동할당",
          estimatedHours: "3h",
          source: "텍스트 회의록",
          createdAt: new Date().toLocaleString("ko-KR"),
        },
        {
          id: Date.now() + 1,
          title: "문서 업데이트 작업",
          description: "회의록에 언급된 문서화 작업",
          priority: "low",
          assignee: "문서팀",
          estimatedHours: "2h",
          source: "텍스트 회의록",
          createdAt: new Date().toLocaleString("ko-KR"),
        },
      ];

      setGeneratedIssues((prev) => [...newIssues, ...prev]);
      setIsProcessing(false);

      toast({
        title: "텍스트 분석 완료!",
        description: `${newIssues.length}개의 이슈가 생성되었습니다.`,
      });
    }, 2000);
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Slack Chat with Threads */}
            <Card className="bg-github-darkSecondary border-github-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                  #dev-team 채널
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
                              disabled={extractingThread === msg.id}
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
                              <span>{msg.replies.length}개의 답글</span>
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
          <Card className="bg-github-darkSecondary border-github-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-toss-blue" />
                회의록 작성
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Textarea
                  placeholder="회의록을 작성해주세요...

예시:
- 프로젝트 진행 상황 논의
- 로그인 버그 수정 필요 (담당: 김개발)
- UI 개선 작업 계획 수립
- 데이터베이스 성능 최적화 검토

작성하신 내용을 바탕으로 자동으로 이슈를 생성해드립니다."
                  value={meetingContent}
                  onChange={(e) => setMeetingContent(e.target.value)}
                  className="min-h-[400px] bg-github-dark border-github-border text-white placeholder-gray-400 resize-none"
                  disabled={isProcessing}
                />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    {meetingContent.length} 글자
                  </div>
                  <Button
                    onClick={handleMeetingTextProcess}
                    disabled={isProcessing || !meetingContent.trim()}
                    className="bg-toss-blue hover:bg-toss-blue/90"
                  >
                    {isProcessing ? (
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
        </TabsContent>
      </Tabs>

      {/* Generated Issues */}
      {generatedIssues.length > 0 && (
        <Card className="bg-github-darkSecondary border-github-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <GitBranch className="w-5 h-5 mr-2 text-green-500" />
                자동 생성된 이슈 ({generatedIssues.length}개)
              </div>
              <Badge className="bg-green-600 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                생성 완료
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 bg-github-dark rounded-lg border border-github-border"
                >
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
                          📄 출처: {issue.source}
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
