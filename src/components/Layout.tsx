
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  User,
  GitBranch,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [notifications] = useState(3);

  const navigation = [
    { name: '대시보드', href: '/', icon: Home },
    { name: '이슈', href: '/issues', icon: GitBranch },
    { name: '문서', href: '/docs', icon: FileText },
    { name: '슬랙 데모', href: '/slack-demo', icon: MessageSquare },
    { name: '애널리틱스', href: '/analytics', icon: BarChart3 },
    { name: '설정', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-github-dark dark">
      {/* Top Navigation */}
      <header className="bg-github-darkSecondary border-b border-github-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-toss rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ToyDocs</span>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="프로젝트, 이슈, 문서 검색..."
                  className="pl-10 bg-github-dark border-github-border text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative text-gray-300 hover:text-white">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>
              
              <Avatar className="w-8 h-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback className="bg-toss-blue text-white">임현</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-github-darkSecondary border-r border-github-border">
          <div className="p-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-toss-blue text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Project List */}
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                프로젝트
              </h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>웹 서비스 개발</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>모바일 앱</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>마케팅 캠페인</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                최근 활동
              </h3>
              <div className="mt-2 space-y-2">
                <div className="px-3 py-2 rounded-lg text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3" />
                    <span>임현우가 이슈 #123을 완료했습니다</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">2분 전</div>
                </div>
                <div className="px-3 py-2 rounded-lg text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3 h-3" />
                    <span>회의록이 자동 생성되었습니다</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">15분 전</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
