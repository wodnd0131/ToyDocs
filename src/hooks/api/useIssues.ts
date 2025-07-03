import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Issue, IssueFilter, IssueStats } from '@/types';
import IssueService from '@/services/api/IssueService';
import { useToast } from '@/hooks/use-toast';

export const useIssues = (filters?: IssueFilter) => {
  return useQuery({
    queryKey: ['issues', filters],
    queryFn: () => IssueService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useIssue = (id: string) => {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: () => IssueService.getById(id),
    enabled: !!id,
  });
};

export const useIssueStats = () => {
  return useQuery({
    queryKey: ['issue-stats'],
    queryFn: IssueService.getStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => 
      IssueService.create(issueData),
    onSuccess: (newIssue) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue-stats'] });
      
      toast({
        title: "이슈 생성 완료",
        description: `"${newIssue.title}" 이슈가 생성되었습니다.`,
      });
    },
    onError: (error) => {
      console.error('Failed to create issue:', error);
      toast({
        title: "이슈 생성 실패",
        description: "이슈를 생성하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Issue> }) =>
      IssueService.update(id, updates),
    onSuccess: (updatedIssue) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', updatedIssue.id] });
      queryClient.invalidateQueries({ queryKey: ['issue-stats'] });
      
      toast({
        title: "이슈 업데이트 완료",
        description: `이슈가 성공적으로 업데이트되었습니다.`,
      });
    },
    onError: (error) => {
      console.error('Failed to update issue:', error);
      toast({
        title: "이슈 업데이트 실패",
        description: "이슈를 업데이트하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteIssue = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => IssueService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue-stats'] });
      
      toast({
        title: "이슈 삭제 완료",
        description: "이슈가 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Failed to delete issue:', error);
      toast({
        title: "이슈 삭제 실패",
        description: "이슈를 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

export const useCreateIssuesFromMeeting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (meetingId: string) => IssueService.createFromMeeting(meetingId),
    onSuccess: (newIssues) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue-stats'] });
      
      toast({
        title: "이슈 자동 생성 완료",
        description: `회의록에서 ${newIssues.length}개의 이슈가 생성되었습니다.`,
      });
    },
    onError: (error) => {
      console.error('Failed to create issues from meeting:', error);
      toast({
        title: "이슈 생성 실패",
        description: "회의록에서 이슈를 생성하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};