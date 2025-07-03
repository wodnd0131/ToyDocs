import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

interface IssueEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: GeneratedIssue | null;
  onSave: (updatedIssue: GeneratedIssue) => void;
}

export const IssueEditModal = ({ isOpen, onClose, issue, onSave }: IssueEditModalProps) => {
  const [editedIssue, setEditedIssue] = useState<GeneratedIssue | null>(issue);

  useEffect(() => {
    setEditedIssue(issue);
  }, [issue]);

  if (!editedIssue) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedIssue(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedIssue(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleDateChange = (date: Date | undefined) => {
    setEditedIssue(prev => (prev ? { ...prev, dueDate: date ? format(date, 'yyyy-MM-dd') : '' } : null));
  };

  const handleSubmit = () => {
    if (editedIssue) {
      onSave(editedIssue);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-github-darkSecondary text-white border-github-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">이슈 편집</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-gray-300">
              제목
            </Label>
            <Input
              id="title"
              name="title"
              value={editedIssue.title}
              onChange={handleChange}
              className="col-span-3 bg-github-dark border-github-border text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right text-gray-300">
              설명
            </Label>
            <Textarea
              id="description"
              name="description"
              value={editedIssue.description}
              onChange={handleChange}
              className="col-span-3 min-h-[150px] bg-github-dark border-github-border text-white resize-y"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right text-gray-300">
              우선순위
            </Label>
            <Select
              value={editedIssue.priority}
              onValueChange={(value: "high" | "medium" | "low") => handleSelectChange('priority', value)}
            >
              <SelectTrigger className="col-span-3 bg-github-dark border-github-border text-white">
                <SelectValue placeholder="우선순위 선택" />
              </SelectTrigger>
              <SelectContent className="bg-github-darkSecondary text-white border-github-border">
                <SelectItem value="high">높음</SelectItem>
                <SelectItem value="medium">중간</SelectItem>
                <SelectItem value="low">낮음</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right text-gray-300">
              담당자
            </Label>
            <Input
              id="assignee"
              name="assignee"
              value={editedIssue.assignee}
              onChange={handleChange}
              className="col-span-3 bg-github-dark border-github-border text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estimatedHours" className="text-right text-gray-300">
              예상 소요 시간
            </Label>
            <Input
              id="estimatedHours"
              name="estimatedHours"
              value={editedIssue.estimatedHours}
              onChange={handleChange}
              className="col-span-3 bg-github-dark border-github-border text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right text-gray-300">
              완료 예정일
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal bg-github-dark border-github-border text-white",
                    !editedIssue.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedIssue.dueDate ? format(new Date(editedIssue.dueDate), 'yyyy-MM-dd') : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-github-darkSecondary border-github-border text-white">
                <Calendar
                  mode="single"
                  selected={editedIssue.dueDate ? new Date(editedIssue.dueDate) : undefined}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-white border-github-border hover:bg-github-dark">
            취소
          </Button>
          <Button onClick={handleSubmit} className="bg-toss-blue hover:bg-toss-blue/90">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
