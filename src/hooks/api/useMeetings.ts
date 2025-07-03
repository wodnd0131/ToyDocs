import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MeetingMinutes, SlackThread, ProcessingResult } from '@/types';
import MeetingService from '@/services/api/MeetingService';
import { useToast } from '@/hooks/use-toast';

export const useMeetings = () => {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: MeetingService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMeeting = (id: string) => {
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: () => MeetingService.getById(id),
    enabled: !!id,
  });
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (meetingData: Omit<MeetingMinutes, 'id' | 'createdAt' | 'updatedAt'>) =>
      MeetingService.create(meetingData),
    onSuccess: (newMeeting) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      
      toast({
        title: "회의록 생성 완료",
        description: `"${newMeeting.title}" 회의록이 생성되었습니다.`,
      });
    },
    onError: (error) => {
      console.error('Failed to create meeting:', error);
      toast({
        title: "회의록 생성 실패",
        description: "회의록을 생성하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

export const useProcessSlackThread = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (thread: SlackThread) => MeetingService.processSlackThread(thread),
    onSuccess: (result: ProcessingResult) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['meetings'] });
        queryClient.invalidateQueries({ queryKey: ['issues'] });
        
        toast({
          title: "Slack 스레드 분석 완료",
          description: "회의록과 이슈가 자동으로 생성되었습니다.",
        });
      }
    },
    onError: (error) => {
      console.error('Failed to process Slack thread:', error);
      toast({
        title: "Slack 스레드 분석 실패",
        description: "스레드를 분석하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

export const useProcessVoiceFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => MeetingService.processVoiceFile(file),
    onSuccess: (result: ProcessingResult) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['meetings'] });
        queryClient.invalidateQueries({ queryKey: ['issues'] });
        
        toast({
          title: "음성 파일 처리 완료",
          description: "음성이 텍스트로 변환되고 회의록이 생성되었습니다.",
        });
      }
    },
    onError: (error) => {
      console.error('Failed to process voice file:', error);
      toast({
        title: "음성 파일 처리 실패",
        description: "음성 파일을 처리하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

export const useProcessTextMeeting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (content: string) => MeetingService.processTextMeeting(content),
    onSuccess: (result: ProcessingResult) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['meetings'] });
        queryClient.invalidateQueries({ queryKey: ['issues'] });
        
        toast({
          title: "텍스트 분석 완료",
          description: "회의록에서 이슈가 자동으로 추출되었습니다.",
        });
      }
    },
    onError: (error) => {
      console.error('Failed to process text meeting:', error);
      toast({
        title: "텍스트 분석 실패",
        description: "텍스트를 분석하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

export const useExtractIssues = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (meetingId: string) => MeetingService.extractIssues(meetingId),
    onSuccess: (result: ProcessingResult) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['issues'] });
        queryClient.invalidateQueries({ queryKey: ['issue-stats'] });
        
        toast({
          title: "이슈 추출 완료",
          description: "회의록에서 이슈가 성공적으로 추출되었습니다.",
        });
      }
    },
    onError: (error) => {
      console.error('Failed to extract issues:', error);
      toast({
        title: "이슈 추출 실패",
        description: "회의록에서 이슈를 추출하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};