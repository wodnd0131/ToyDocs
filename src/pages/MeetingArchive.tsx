import { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar,
  Users,
  MessageSquare,
  Mic,
  Edit3,
  Download,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeetingMinutes } from '@/types';
import MeetingService from '@/services/api/MeetingService';

const MeetingArchive = () => {
  const [meetings, setMeetings] = useState<MeetingMinutes[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<MeetingMinutes[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const filterMeetings = useCallback(() => {
    let filtered = meetings;

    if (searchTerm) {
      filtered = filtered.filter(meeting => 
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.attendees.some(attendee => 
          attendee.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedSource !== 'all') {
      filtered = filtered.filter(meeting => meeting.sourceType === selectedSource);
    }

    if (selectedMonth !== 'all') {
      const targetMonth = selectedMonth;
      filtered = filtered.filter(meeting => 
        meeting.date.startsWith(targetMonth)
      );
    }

    setFilteredMeetings(filtered);
  }, [meetings, searchTerm, selectedSource, selectedMonth]);

  const loadMeetings = async () => {
    try {
      const data = await MeetingService.getAll();
      setMeetings(data);
    } catch (error) {
      console.error('Failed to load meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  useEffect(() => {
    filterMeetings();
  }, [filterMeetings]);

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'slack':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'voice':
        return <Mic className="w-4 h-4 text-purple-500" />;
      case 'manual':
        return <Edit3 className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceText = (sourceType: string) => {
    switch (sourceType) {
      case 'slack': return 'Slack';
      case 'voice': return '음성';
      case 'manual': return '직접 작성';
      default: return sourceType;
    }
  };

  const getSourceColor = (sourceType: string) => {
    switch (sourceType) {
      case 'slack': return 'bg-green-100 text-green-800';
      case 'voice': return 'bg-purple-100 text-purple-800';
      case 'manual': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const mockMeetings: MeetingMinutes[] = [
    {
      id: '1',
      title: '스프린트 회의록 #12',
      date: '2024-07-02',
      attendees: ['임현우', '김개발', '박디자인'],
      content: '스프린트 진행 상황과 주요 이슈들에 대해 논의했습니다. 로그인 버그 수정이 우선순위가 높으며, UI 개선 작업도 병행하기로 했습니다.',
      sourceType: 'slack',
      rawInput: 'Slack thread conversation...',
      createdAt: '2024-07-02T14:32:00Z',
      updatedAt: '2024-07-02T14:32:00Z',
      keyPoints: [
        '로그인 버그 우선순위 높음',
        'UI 개선 작업 필요',
        '데이터베이스 성능 최적화 검토'
      ],
      actionItems: [
        {
          id: 'ai-1',
          description: '로그인 세션 만료 문제 수정',
          assignee: '김개발',
          dueDate: '2024-07-03',
          priority: 'high',
          completed: false,
          estimatedHours: 4
        }
      ],
      conclusion: '우선순위에 따라 작업 분배 완료',
      tags: ['스프린트', '개발']
    },
    {
      id: '2',
      title: '제품 기획 회의',
      date: '2024-07-01',
      attendees: ['임현우', '박디자인', '이기획'],
      content: '새로운 기능에 대한 기획을 논의했습니다. 사용자 경험 개선을 위한 다양한 아이디어가 제시되었습니다.',
      sourceType: 'voice',
      rawInput: 'meeting_audio_20240701.mp3',
      createdAt: '2024-07-01T10:00:00Z',
      updatedAt: '2024-07-01T10:00:00Z',
      keyPoints: [
        '사용자 피드백 분석',
        '새로운 기능 우선순위 정의',
        '개발 일정 수립'
      ],
      actionItems: [
        {
          id: 'ai-2',
          description: '와이어프레임 초안 작성',
          assignee: '박디자인',
          dueDate: '2024-07-05',
          priority: 'medium',
          completed: false,
          estimatedHours: 6
        }
      ],
      conclusion: '기능 개발 로드맵 확정',
      tags: ['기획', '디자인']
    },
    {
      id: '3',
      title: '팀 회고 미팅',
      date: '2024-06-30',
      attendees: ['임현우', '김개발', '박디자인', '이백엔드'],
      content: '지난 스프린트에 대한 회고를 진행했습니다. 잘된 점과 개선점을 정리하고 다음 스프린트 계획을 수립했습니다.',
      sourceType: 'manual',
      rawInput: '직접 작성된 회의록 내용',
      createdAt: '2024-06-30T16:00:00Z',
      updatedAt: '2024-06-30T16:00:00Z',
      keyPoints: [
        '팀 협업 프로세스 개선',
        '코드 리뷰 효율성 향상',
        '커뮤니케이션 방식 개선'
      ],
      actionItems: [
        {
          id: 'ai-3',
          description: '코드 리뷰 가이드라인 작성',
          assignee: '이백엔드',
          dueDate: '2024-07-07',
          priority: 'medium',
          completed: true,
          estimatedHours: 3
        }
      ],
      conclusion: '팀 프로세스 개선 방향 설정',
      tags: ['회고', '프로세스']
    }
  ];

  // Use mock data if no real data
  const displayMeetings = filteredMeetings.length > 0 ? filteredMeetings : 
    (meetings.length === 0 ? mockMeetings : meetings);

  const stats = {
    total: displayMeetings.length,
    thisMonth: displayMeetings.filter(m => m.date.startsWith('2024-07')).length,
    slack: displayMeetings.filter(m => m.sourceType === 'slack').length,
    voice: displayMeetings.filter(m => m.sourceType === 'voice').length,
    manual: displayMeetings.filter(m => m.sourceType === 'manual').length
  };

  return (
    <div className="p-6 space-y-6 bg-github-dark min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <FileText className="w-8 h-8 mr-3 text-toss-blue" />
            회의록 아카이브
          </h1>
          <p className="text-gray-400 mt-2">
            자동 생성된 회의록을 검색하고 관리하세요
          </p>
        </div>
        <Button className="bg-toss-blue hover:bg-toss-darkBlue text-white">
          <Plus className="w-4 h-4 mr-2" />
          새 회의록 작성
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-github-darkSecondary border-github-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-gray-400">전체 회의록</div>
          </CardContent>
        </Card>
        <Card className="bg-github-darkSecondary border-github-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.thisMonth}</div>
            <div className="text-xs text-gray-400">이번 달</div>
          </CardContent>
        </Card>
        <Card className="bg-github-darkSecondary border-github-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.slack}</div>
            <div className="text-xs text-gray-400">Slack</div>
          </CardContent>
        </Card>
        <Card className="bg-github-darkSecondary border-github-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.voice}</div>
            <div className="text-xs text-gray-400">음성</div>
          </CardContent>
        </Card>
        <Card className="bg-github-darkSecondary border-github-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.manual}</div>
            <div className="text-xs text-gray-400">직접 작성</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-github-darkSecondary border-github-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="회의록 제목, 내용, 참석자로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-github-dark border-github-border text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-full md:w-40 bg-github-dark border-github-border text-white">
                <SelectValue placeholder="소스 필터" />
              </SelectTrigger>
              <SelectContent className="bg-github-darkSecondary border-github-border">
                <SelectItem value="all">모든 소스</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="voice">음성</SelectItem>
                <SelectItem value="manual">직접 작성</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full md:w-32 bg-github-dark border-github-border text-white">
                <SelectValue placeholder="월별" />
              </SelectTrigger>
              <SelectContent className="bg-github-darkSecondary border-github-border">
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="2024-07">7월</SelectItem>
                <SelectItem value="2024-06">6월</SelectItem>
                <SelectItem value="2024-05">5월</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Meeting List */}
      <div className="space-y-4">
        {displayMeetings.map((meeting) => (
          <Card key={meeting.id} className="bg-github-darkSecondary border-github-border hover:border-toss-blue transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-medium text-white">{meeting.title}</h3>
                    <Badge className={getSourceColor(meeting.sourceType)}>
                      <div className="flex items-center space-x-1">
                        {getSourceIcon(meeting.sourceType)}
                        <span>{getSourceText(meeting.sourceType)}</span>
                      </div>
                    </Badge>
                    {meeting.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {meeting.content}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{meeting.date}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{meeting.attendees.length}명 참석</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span>{meeting.actionItems.length}개 액션 아이템</span>
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs text-gray-500">참석자:</span>
                    <div className="flex space-x-1">
                      {meeting.attendees.slice(0, 3).map((attendee, index) => (
                        <Avatar key={index} className="w-6 h-6">
                          <AvatarFallback className="bg-gray-600 text-white text-xs">
                            {attendee.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {meeting.attendees.length > 3 && (
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white">
                          +{meeting.attendees.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Points Preview */}
                  {meeting.keyPoints && meeting.keyPoints.length > 0 && (
                    <div className="bg-github-dark p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-white mb-2">주요 포인트</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {meeting.keyPoints.slice(0, 2).map((point, index) => (
                          <li key={index}>• {point}</li>
                        ))}
                        {meeting.keyPoints.length > 2 && (
                          <li className="text-toss-blue">+{meeting.keyPoints.length - 2}개 더보기</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Eye className="w-4 h-4 mr-1" />
                    보기
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Download className="w-4 h-4 mr-1" />
                    다운로드
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Edit3 className="w-4 h-4 mr-1" />
                    편집
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayMeetings.length === 0 && !loading && (
        <Card className="bg-github-darkSecondary border-github-border">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">회의록이 없습니다</h3>
            <p className="text-gray-400 mb-4">
              첫 번째 회의록을 생성하거나 검색 조건을 변경해보세요.
            </p>
            <Button className="bg-toss-blue hover:bg-toss-darkBlue text-white">
              새 회의록 작성
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeetingArchive;