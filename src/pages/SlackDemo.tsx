
import { useState } from 'react';
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
  GitBranch
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const SlackDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedIssues, setGeneratedIssues] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          createdAt: new Date().toLocaleString('ko-KR')
        },
        {
          id: 129,
          title: "UI/UX 개선 작업",
          description: "사용자 피드백 반영한 메인 페이지 레이아웃 개선",
          priority: "medium",
          assignee: "박디자인",
          estimatedHours: "6h",
          source: file.name,
          createdAt: new Date().toLocaleString('ko-KR')
        },
        {
          id: 130,
          title: "데이터베이스 최적화",
          description: "회의에서 언급된 쿼리 성능 이슈 해결",
          priority: "critical",
          assignee: "이백엔드",
          estimatedHours: "8h",
          source: file.name,
          createdAt: new Date().toLocaleString('ko-KR')
        }
      ];

      setGeneratedIssues(prev => [...newIssues, ...prev]);
      setIsProcessing(false);

      toast({
        title: "이슈 자동 생성 완료!",
        description: `${newIssues.length}개의 이슈가 자동으로 생성되었습니다.`,
      });
    }, 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const slackMessages = [
    {
      id: 1,
      user: "임현우",
      avatar: "임현",
      time: "14:32",
      message: "오늘 스프린트 회의 정리했습니다. 로그인 버그 이슈가 우선순위 높네요.",
      isBot: false
    },
    {
      id: 2,
      user: "김개발",
      avatar: "김개",
      time: "14:33",
      message: "네, 세션 만료 관련해서 내일까지 수정하겠습니다.",
      isBot: false
    },
    {
      id: 3,
      user: "AI Assistant",
      avatar: "AI",
      time: "14:34",
      message: "🤖 회의 내용을 분석하여 3개의 이슈를 자동 생성했습니다. 각각 적절한 담당자에게 할당되었습니다.",
      isBot: true
    }
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slack Chat Simulation */}
        <Card className="bg-github-darkSecondary border-github-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
              #dev-team 채널
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {slackMessages.map((msg) => (
                <div key={msg.id} className="flex space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={`text-xs ${msg.isBot ? 'bg-purple-600' : 'bg-toss-blue'} text-white`}>
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">{msg.user}</span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                      {msg.isBot && (
                        <Badge className="bg-purple-600 text-white text-xs">
                          <Bot className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{msg.message}</p>
                  </div>
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

        {/* File Upload & Auto Issue Creation */}
        <Card className="bg-github-darkSecondary border-github-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Upload className="w-5 h-5 mr-2 text-toss-blue" />
              회의록 자동 이슈 생성
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

            <div className="bg-github-dark p-4 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2">지원 형식</h3>
              <div className="flex flex-wrap gap-2">
                {['.txt', '.doc', '.docx', '.pdf'].map((format) => (
                  <Badge key={format} variant="outline" className="text-gray-400 border-gray-600">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">자동 처리 과정</h3>
              <div className="space-y-2">
                {[
                  { step: "회의록 내용 분석", icon: FileText },
                  { step: "작업 항목 추출", icon: Zap },
                  { step: "우선순위 설정", icon: ArrowRight },
                  { step: "담당자 자동 할당", icon: Users },
                  { step: "이슈 트래커 등록", icon: GitBranch }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <div className="w-6 h-6 bg-toss-blue/20 rounded-full flex items-center justify-center">
                        <Icon className="w-3 h-3 text-toss-blue" />
                      </div>
                      <span className="text-gray-300">{item.step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                <div key={issue.id} className="p-4 bg-github-dark rounded-lg border border-github-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-gray-400 font-mono text-sm">#{issue.id}</span>
                        <h3 className="text-lg font-medium text-white">{issue.title}</h3>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3">{issue.description}</p>
                      
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
              <h3 className="font-medium text-white mb-2">실시간 대화 분석</h3>
              <p className="text-sm text-gray-400">슬랙 대화에서 중요한 작업 항목을 자동으로 감지하고 추출</p>
            </div>
            
            <div className="text-center p-4 bg-github-darkSecondary rounded-lg">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-medium text-white mb-2">문서 자동 생성</h3>
              <p className="text-sm text-gray-400">회의록, 기술 문서, API 명세서를 자동으로 생성하고 업데이트</p>
            </div>
            
            <div className="text-center p-4 bg-github-darkSecondary rounded-lg">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-medium text-white mb-2">스마트 업무 할당</h3>
              <p className="text-sm text-gray-400">팀원의 전문성과 워크로드를 고려한 최적의 작업 분배</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlackDemo;
