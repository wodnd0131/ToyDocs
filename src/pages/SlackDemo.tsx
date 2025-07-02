
import { useState } from 'react';
import { MessageSquare, Users, Bot, ArrowRight, Sparkles, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SlackDemo = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const slackMessages = [
    {
      id: 1,
      author: "유채영",
      avatar: "유채",
      time: "14:30",
      message: "로그인 기능 구현 방향성에 대해 논의해볼까요? 보안과 사용자 경험을 모두 고려해야 할 것 같아요.",
      isManager: true
    },
    {
      id: 2,
      author: "임현우",
      avatar: "임현",
      time: "14:32",
      message: "OAuth 2.0 방식으로 가는게 좋을 것 같습니다. Google, GitHub 로그인을 지원하면 사용자들이 편할 것 같아요.",
      isManager: false
    },
    {
      id: 3,
      author: "김개발",
      avatar: "김개",
      time: "14:33",
      message: "맞습니다. 보안 측면에서도 더 안전하죠. JWT 토큰 관리도 고려해야겠네요.",
      isManager: false
    },
    {
      id: 4,
      author: "박디자인",
      avatar: "박디",
      time: "14:35",
      message: "UI/UX 관점에서는 원클릭 로그인이 중요해요. 로딩 상태와 에러 처리도 신경써야겠습니다.",
      isManager: false
    },
    {
      id: 5,
      author: "이백엔드",
      avatar: "이백",
      time: "14:37",
      message: "세션 관리와 리프레시 토큰 로직도 구현해야겠네요. 보안 정책은 어떻게 할까요?",
      isManager: false
    }
  ];

  const generationSteps = [
    "슬랙 스레드 분석 중...",
    "주제와 키워드 추출 중...",
    "참여자별 의견 정리 중...",
    "액션 아이템 도출 중...",
    "문서 구조화 중...",
    "최종 검토 및 완료!"
  ];

  const handleGenerateDoc = async () => {
    setIsGenerating(true);
    setCurrentStep(0);

    for (let i = 0; i < generationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentStep(i);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsGenerating(false);
    setGeneratedDoc(true);
  };

  const resetDemo = () => {
    setIsGenerating(false);
    setGeneratedDoc(false);
    setCurrentStep(0);
  };

  return (
    <div className="p-6 space-y-6 bg-github-dark min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-toss-blue" />
            슬랙 → 문서 자동 생성 체험
          </h1>
          <p className="text-gray-400 mt-2">
            실제 슬랙 대화를 구조화된 회의록으로 자동 변환하는 과정을 체험해보세요
          </p>
        </div>
        <Button 
          onClick={resetDemo}
          variant="outline" 
          className="border-toss-blue text-toss-blue hover:bg-toss-blue hover:text-white"
        >
          데모 초기화
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slack Thread Simulation */}
        <Card className="bg-github-darkSecondary border-github-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
              #dev-team 채널
              <Badge className="ml-2 bg-green-100 text-green-800">5명 온라인</Badge>
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>유채영, 임현우, 김개발, 박디자인, 이백엔드</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {slackMessages.map((message) => (
                <div key={message.id} className="flex space-x-3 p-3 rounded-lg hover:bg-github-dark transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`text-white text-xs ${
                      message.isManager ? 'bg-purple-500' : 'bg-toss-blue'
                    }`}>
                      {message.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white text-sm">
                        {message.author}
                      </span>
                      {message.isManager && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">PM</Badge>
                      )}
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-github-border">
              <Button 
                onClick={handleGenerateDoc}
                disabled={isGenerating || generatedDoc}
                className="w-full bg-gradient-toss hover:opacity-90 text-white font-medium py-3"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>AI가 문서를 생성하는 중...</span>
                  </div>
                ) : generatedDoc ? (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>문서 생성 완료!</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>AI로 회의록 자동 생성하기</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Document */}
        <Card className="bg-github-darkSecondary border-github-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-toss-blue" />
              자동 생성된 회의록
              {generatedDoc && (
                <Badge className="ml-2 bg-toss-blue animate-pulse-blue">
                  AI Generated
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isGenerating && !generatedDoc && (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  슬랙 스레드에서 "AI로 회의록 자동 생성하기" 버튼을 클릭하면<br />
                  여기에 구조화된 문서가 생성됩니다
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-toss-blue mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-white mb-4">AI가 문서를 생성하고 있습니다</h3>
                </div>
                
                <div className="space-y-2">
                  {generationSteps.map((step, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-2 rounded ${
                      index <= currentStep ? 'bg-github-dark' : 'bg-transparent'
                    }`}>
                      <div className={`w-4 h-4 rounded-full ${
                        index < currentStep ? 'bg-green-500' : 
                        index === currentStep ? 'bg-toss-blue animate-pulse' : 'bg-gray-600'
                      }`}></div>
                      <span className={`text-sm ${
                        index <= currentStep ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generatedDoc && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-github-dark p-4 rounded-lg border border-toss-blue/20">
                  <h3 className="text-lg font-bold text-white mb-3">
                    🔐 로그인 기능 구현 방향성 논의
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-toss-blue mb-2">📅 회의 정보</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>• 일시: 2024년 7월 2일 14:30-14:40</div>
                        <div>• 채널: #dev-team</div>
                        <div>• 참석자: 유채영(PM), 임현우, 김개발, 박디자인, 이백엔드</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-toss-blue mb-2">💡 주요 논의 사항</h4>
                      <div className="text-sm text-gray-300 space-y-2">
                        <div>• OAuth 2.0 방식 도입 결정</div>
                        <div>• Google, GitHub 소셜 로그인 지원</div>
                        <div>• JWT 토큰 기반 인증 시스템</div>
                        <div>• 사용자 경험 최적화 (원클릭 로그인)</div>
                        <div>• 보안 정책 및 세션 관리 방안</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-toss-blue mb-2">✅ 액션 아이템</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-300">OAuth 2.0 구현 상세 설계</span>
                          <Badge className="bg-orange-100 text-orange-800 text-xs">임현우</Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-300">JWT 토큰 관리 로직 개발</span>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">김개발</Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-300">로그인 UI/UX 프로토타입</span>
                          <Badge className="bg-purple-100 text-purple-800 text-xs">박디자인</Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-300">보안 정책 문서 작성</span>
                          <Badge className="bg-green-100 text-green-800 text-xs">이백엔드</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-toss-blue mb-2">🎯 다음 단계</h4>
                      <div className="text-sm text-gray-300">
                        각자 담당 업무를 이번 주 금요일까지 완료하고, 
                        다음 주 월요일에 진행 상황을 공유하기로 함
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-toss-blue hover:bg-toss-darkBlue text-white">
                    문서 편집하기
                  </Button>
                  <Button variant="outline" className="flex-1 border-toss-blue text-toss-blue hover:bg-toss-blue hover:text-white">
                    팀에게 공유하기
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Demo Instructions */}
      <Card className="bg-github-darkSecondary border-github-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
            체험 가이드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-github-dark rounded-lg">
              <MessageSquare className="w-8 h-8 text-toss-blue mx-auto mb-2" />
              <h3 className="font-medium text-white mb-1">1. 슬랙 스레드</h3>
              <p className="text-sm text-gray-400">실제 팀 대화를 확인하고 문서화 버튼을 클릭</p>
            </div>
            <div className="text-center p-4 bg-github-dark rounded-lg">
              <Bot className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-medium text-white mb-1">2. AI 분석</h3>
              <p className="text-sm text-gray-400">AI가 대화를 분석하고 구조화된 문서 생성</p>
            </div>
            <div className="text-center p-4 bg-github-dark rounded-lg">
              <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-white mb-1">3. 완성된 문서</h3>
              <p className="text-sm text-gray-400">회의록, 액션 아이템, 일정이 자동으로 정리</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlackDemo;
