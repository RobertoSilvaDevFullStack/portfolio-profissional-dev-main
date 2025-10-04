import { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PostSchedulerProps {
  scheduledAt?: Date;
  onScheduleChange: (date: Date | undefined) => void;
  status?: 'draft' | 'scheduled' | 'published' | 'archived';
}

const PostScheduler = ({ scheduledAt, onScheduleChange, status }: PostSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    scheduledAt ? new Date(scheduledAt) : undefined
  );
  const [selectedHour, setSelectedHour] = useState<string>(
    scheduledAt ? format(new Date(scheduledAt), 'HH') : '10'
  );
  const [selectedMinute, setSelectedMinute] = useState<string>(
    scheduledAt ? format(new Date(scheduledAt), 'mm') : '00'
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(selectedHour), parseInt(selectedMinute));
      onScheduleChange(newDate);
    } else {
      onScheduleChange(undefined);
    }
  };

  const handleTimeChange = (hour: string, minute: string) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hour), parseInt(minute));
      onScheduleChange(newDate);
    }
  };

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour);
    handleTimeChange(hour, selectedMinute);
  };

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute);
    handleTimeChange(selectedHour, minute);
  };

  const clearSchedule = () => {
    setSelectedDate(undefined);
    onScheduleChange(undefined);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const getStatusInfo = () => {
    if (!scheduledAt) {
      return { badge: null, text: 'Publicar agora' };
    }

    const scheduleDate = new Date(scheduledAt);
    const now = new Date();
    
    if (status === 'published') {
      return {
        badge: <Badge className="bg-green-500/20 text-green-400">Publicado</Badge>,
        text: format(scheduleDate, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
      };
    }

    if (scheduleDate <= now) {
      return {
        badge: <Badge className="bg-yellow-500/20 text-yellow-400">Aguardando publicação</Badge>,
        text: 'Será publicado em breve'
      };
    }

    return {
      badge: <Badge className="bg-blue-500/20 text-blue-400">Agendado</Badge>,
      text: `${format(scheduleDate, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}`
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white">Agendamento de Publicação</Label>
        {statusInfo.badge}
      </div>

      {scheduledAt && (
        <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">{statusInfo.text}</span>
          {status !== 'published' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSchedule}
              className="ml-auto text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              Limpar
            </Button>
          )}
        </div>
      )}

      <div className="grid gap-4">
        <div>
          <Label className="text-gray-400 text-sm mb-2 block">Selecione a Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white hover:bg-gray-700",
                  !selectedDate && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                ) : (
                  <span>Escolha uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                className="bg-gray-800"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400 text-sm mb-2 block">Hora</Label>
            <Select value={selectedHour} onValueChange={handleHourChange}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-60">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}h
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-400 text-sm mb-2 block">Minuto</Label>
            <Select value={selectedMinute} onValueChange={handleMinuteChange}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-60">
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}min
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-400">
            <strong>Atenção:</strong> O post será publicado automaticamente na data e hora selecionadas.
          </p>
        </div>
      )}
    </div>
  );
};

export default PostScheduler;
