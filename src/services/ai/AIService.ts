import axiosInstance from '@/lib/axios';
import { ProcessingResult } from '@/types';

interface AIPromptConfig {
  meetingExtractionPrompt: string;
  issueExtractionPrompt: string;
}

class AIService {
  private static useFixtures = import.meta.env.VITE_USE_FIXTURES === 'true';
  private static fixtureDelay = parseInt(import.meta.env.VITE_FIXTURE_DELAY || '2000');

  private static async delay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.fixtureDelay));
  }

  private static readonly DEFAULT_CONFIG: AIPromptConfig = {
    meetingExtractionPrompt: `
다음 텍스트에서 회의록을 추출해주세요:

입력 형식: {input_text}

출력 형식 (JSON):
{
  "title": "회의 제목",
  "attendees": ["참석자1", "참석자2"],
  "keyPoints": ["주요 안건1", "주요 안건2"],
  "actionItems": [
    {
      "description": "할 일 설명",
      "assignee": "담당자",
      "priority": "high|medium|low",
      "dueDate": "YYYY-MM-DD"
    }
  ],
  "conclusion": "결정사항 및 결론"
}
`,

    issueExtractionPrompt: `
다음 회의록에서 구체적인 작업 이슈들을 추출해주세요:

회의록: {meeting_content}

각 이슈는 다음 형식으로 출력해주세요 (JSON Array):
[
  {
    "title": "이슈 제목 (50자 이내)",
    "description": "상세 설명",
    "assignee": "담당자 이름",
    "priority": "critical|high|medium|low",
    "estimatedHours": 숫자,
    "tags": ["태그1", "태그2"]
  }
]
`
  };

  static async extractMeetingFromText(inputText: string): Promise<ProcessingResult> {
    if (this.useFixtures) {
      return this.mockMeetingExtraction(inputText);
    }

    try {
      // 실제 환경에서는 OpenAI API 호출
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        return await this.callOpenAI(this.DEFAULT_CONFIG.meetingExtractionPrompt, inputText);
      }
      
      // Fallback to mock
      return this.mockMeetingExtraction(inputText);
    } catch (error) {
      console.error('AI meeting extraction failed:', error);
      return {
        success: false,
        error: 'AI 분석에 실패했습니다.',
        processingTime: 0
      };
    }
  }

  static async extractIssuesFromMeeting(meetingContent: string): Promise<ProcessingResult> {
    if (this.useFixtures) {
      return this.mockIssueExtraction(meetingContent);
    }

    try {
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        return await this.callOpenAI(this.DEFAULT_CONFIG.issueExtractionPrompt, meetingContent);
      }
      
      return this.mockIssueExtraction(meetingContent);
    } catch (error) {
      console.error('AI issue extraction failed:', error);
      return {
        success: false,
        error: 'AI 이슈 추출에 실패했습니다.',
        processingTime: 0
      };
    }
  }

  static async processSlackThread(messages: unknown[]): Promise<ProcessingResult> {
    const threadContent = messages.map((msg: {user: string, message: string}) => `${msg.user}: ${msg.message}`).join('\n');
    return this.extractMeetingFromText(threadContent);
  }

  static async transcribeVoice(audioFile: File): Promise<ProcessingResult> {
    if (this.useFixtures) {
      return this.mockVoiceTranscription(audioFile);
    }

    try {
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        // OpenAI Whisper API 호출
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('model', 'whisper-1');
        formData.append('language', 'ko');

        const response = await axiosInstance.post('/openai/audio/transcriptions', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return {
          success: true,
          data: { transcription: response.data.text },
          processingTime: 3000
        };
      }

      // Mock voice transcription
      return this.mockVoiceTranscription(audioFile);
    } catch (error) {
      console.error('Voice transcription failed:', error);
      return {
        success: false,
        error: '음성 변환에 실패했습니다.',
        processingTime: 0
      };
    }
  }

  private static async callOpenAI(prompt: string, content: string): Promise<ProcessingResult> {
    try {
      const response = await axiosInstance.post('/openai/chat/completions', {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: content }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      return {
        success: true,
        data: JSON.parse(response.data.choices[0].message.content),
        processingTime: 2000
      };
    } catch (error) {
      throw new Error('OpenAI API 호출 실패');
    }
  }

  private static async mockMeetingExtraction(inputText: string): Promise<ProcessingResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lines = inputText.split('\n').filter(line => line.trim());
        const participants = this.extractParticipants(inputText);
        
        resolve({
          success: true,
          data: {
            title: '자동 추출된 회의록',
            attendees: participants,
            keyPoints: lines.slice(0, Math.min(3, lines.length)),
            actionItems: this.extractActionItems(inputText),
            conclusion: '주요 사안들이 논의되고 액션 아이템이 정리됨'
          },
          processingTime: this.fixtureDelay
        });
      }, this.fixtureDelay);
    });
  }

  private static async mockIssueExtraction(meetingContent: string): Promise<ProcessingResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const actionKeywords = ['해야', '필요', '개선', '수정', '구현', '개발', '디자인', '테스트'];
        const lines = meetingContent.split('\n').filter(line => 
          actionKeywords.some(keyword => line.includes(keyword))
        );

        const issues = lines.slice(0, 3).map((line, index) => ({
          id: (Date.now() + index).toString(),
          title: line.length > 50 ? line.substring(0, 47) + '...' : line,
          description: `회의에서 논의된 사항: ${line}`,
          assignee: this.assignRandomMember(),
          priority: this.assignRandomPriority(),
          estimatedHours: Math.floor(Math.random() * 8) + 1,
          tags: this.extractTags(line),
          status: 'todo',
          autoGenerated: true,
          source: {
            type: 'manual',
            reference: '회의록 AI 분석'
          }
        }));

        resolve({
          success: true,
          data: issues,
          processingTime: this.fixtureDelay
        });
      }, this.fixtureDelay);
    });
  }

  private static async mockVoiceTranscription(audioFile: File): Promise<ProcessingResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            transcription: `음성 파일 "${audioFile.name}"에서 추출된 텍스트입니다. 
            
실제 구현에서는 Web Speech API나 외부 STT 서비스를 사용하여 음성을 텍스트로 변환합니다.

회의 내용 예시:
- 프로젝트 진행 상황 점검
- 주요 이슈 및 해결 방안 논의  
- 다음 스프린트 계획 수립
- 팀원별 역할 분담`
          },
          processingTime: this.fixtureDelay
        });
      }, this.fixtureDelay);
    });
  }

  private static extractParticipants(text: string): string[] {
    const commonNames = ['임현우', '김개발', '박디자인', '이백엔드', '최테스터'];
    const foundNames = commonNames.filter(name => text.includes(name));
    return foundNames.length > 0 ? foundNames : ['참여자1', '참여자2'];
  }

  private static extractActionItems(text: string): unknown[] {
    const actionKeywords = ['담당:', '할당:', 'TODO:', '- '];
    const lines = text.split('\n').filter(line => 
      actionKeywords.some(keyword => line.includes(keyword))
    );

    return lines.slice(0, 2).map(line => ({
      description: line.replace(/담당:|할당:|TODO:|-/g, '').trim(),
      assignee: this.assignRandomMember(),
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  }

  private static assignRandomMember(): string {
    const members = ['임현우', '김개발', '박디자인', '이백엔드'];
    return members[Math.floor(Math.random() * members.length)];
  }

  private static assignRandomPriority(): 'low' | 'medium' | 'high' | 'critical' {
    const priorities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  }

  private static extractTags(text: string): string[] {
    const tagKeywords = {
      'frontend': ['UI', '화면', '페이지', '디자인'],
      'backend': ['API', '서버', '데이터베이스', 'DB'],
      'bugfix': ['버그', '오류', '수정', '에러'],
      'feature': ['기능', '구현', '개발', '추가'],
      'testing': ['테스트', '검증', 'QA']
    };

    const tags: string[] = [];
    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags.length > 0 ? tags : ['general'];
  }
}

export default AIService;