
import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  GitBranch,
  MessageSquare,
  Zap,
  ArrowUp,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workHours] = useState({ today: "6h 30m", thisWeek: "32h 15m" });
  const [projectProgress] = useState(75);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "활성 프로젝트",
      value: "12",
      change: "+2.5%",
      icon: GitBranch,
      color: "text-green-500"
    },
    {
      title: "팀원",
      value: "24",
      change: "+4",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "자동 생성 문서",
      value: "156",
      change: "+12",
      icon: FileText,
      color: "text-purple-500"
    },
    {
      title: "작업 시간",
      value: workHours.today,
      change: workHours.thisWeek,
      icon: Clock,
      color: "text-orange-500"
    }
  ];

  const recentDocs = [
    {
      id: 1,
      title: "스프린트 회의록 #12",
      type: "meeting",
      source: "슬랙 #dev-team",
      date: "2024-07-02",
      status: "AI Generated",
      participants: ["임현우", "김개발", "박디자인"]
    },
    {
      id: 2,
      title: "React Hook 트러블슈팅",
      type: "tech",
      source: "자동 생성",
      date: "2024-07-01",
      status: "완료",
      participants: ["임현우"]
    },
    {
      id: 3,
      title: "API 명세서 v2.1",
      type: "spec",
      source: "GitHub 이슈",
      date: "2024-06-30",
      status: "검토중",
      participants: ["김개발", "이백엔드"]
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "success",
      message: "슬랙 스레드에서 새로운 회의록이 생성되었습니다",
      time: "2분 전",
      action: "보기"
    },
    {
      id: 2,
      type: "info",
      message: "이슈 #234가 자동으로 임현우에게 할당되었습니다",
      time: "15분 전",
      action: "확인"
    },
    {
      id: 3,
      type: "warning",
      message: "프로젝트 마감일이 3일 남았습니다",
      time: "1시간 전",
      action: "계획보기"
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-github-dark min-h-screen max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">
            안녕하세요, 임현우님! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            오늘도 효율적인 협업을 시작해보세요
          </p>
        </div>
        <div className="text-right bg-github-darkSecondary p-4 rounded-xl border border-github-border">
          <div className="text-sm text-gray-400 mb-1">현재 시간</div>
          <div className="text-xl font-mono text-white">
            {currentTime.toLocaleTimeString('ko-KR')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-github-darkSecondary border-github-border hover:border-toss-blue transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-green-500 flex items-center">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 bg-github-dark rounded-lg">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Progress */}
        <Card className="lg:col-span-2 bg-github-darkSecondary border-github-border">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-white flex items-center">
              <Activity className="w-6 h-6 mr-3 text-toss-blue" />
              프로젝트 현황
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              현재 진행 중인 프로젝트의 상태를 확인해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-300">웹 서비스 개발</span>
                <span className="text-base text-gray-400 font-semibold">{projectProgress}%</span>
              </div>
              <Progress value={projectProgress} className="h-3" />
              
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 bg-github-dark rounded-xl border border-github-border">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">24</div>
                  <div className="text-sm text-gray-400">완료된 작업</div>
                </div>
                <div className="text-center p-6 bg-github-dark rounded-xl border border-github-border">
                  <AlertCircle className="w-6 h-6 text-orange-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">8</div>
                  <div className="text-sm text-gray-400">진행 중</div>
                </div>
                <div className="text-center p-6 bg-github-dark rounded-xl border border-github-border">
                  <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">92%</div>
                  <div className="text-sm text-gray-400">팀 효율성</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Notifications */}
        <Card className="bg-github-darkSecondary border-github-border">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-white flex items-center">
              <Zap className="w-6 h-6 mr-3 text-yellow-500" />
              실시간 알림
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-5 bg-github-dark rounded-xl border border-github-border hover:border-toss-blue/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">{notification.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      <Button size="sm" variant="outline" className="h-7 text-xs border-toss-blue text-toss-blue hover:bg-toss-blue hover:text-white">
                        {notification.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card className="bg-github-darkSecondary border-github-border">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl text-white flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-6 h-6 mr-3 text-toss-blue" />
              최근 자동 생성된 문서
            </div>
            <Button variant="outline" size="sm" className="border-toss-blue text-toss-blue hover:bg-toss-blue hover:text-white">
              전체 보기
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="p-6 bg-github-dark rounded-xl border border-github-border hover:border-toss-blue transition-all duration-300 cursor-pointer hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-white text-lg">{doc.title}</h3>
                      <Badge 
                        variant={doc.status === 'AI Generated' ? 'default' : 'secondary'}
                        className={doc.status === 'AI Generated' ? 'bg-toss-blue' : ''}
                      >
                        {doc.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      {doc.source} • {doc.date}
                    </p>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">참여자:</span>
                      <div className="flex space-x-2">
                        {doc.participants.map((participant, idx) => (
                          <span key={idx} className="text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded-lg">
                            {participant}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 ml-6">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      편집
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      공유
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
