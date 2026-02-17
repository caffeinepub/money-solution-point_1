import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddVisitorRecord } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, UserPlus } from 'lucide-react';

interface VisitorFormData {
  fullName: string;
  email: string;
  address: string;
  jobInfo: string;
  incomeLevel: string;
  reasonForVisit: string;
  visitType: string;
}

export default function VisitorForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VisitorFormData>();

  const [visitType, setVisitType] = useState('');
  const [incomeLevel, setIncomeLevel] = useState('');

  const addVisitorMutation = useAddVisitorRecord();

  const onSubmit = async (data: VisitorFormData) => {
    try {
      await addVisitorMutation.mutateAsync(data);
      toast.success('Visitor record added successfully');
      reset();
      setVisitType('');
      setIncomeLevel('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add visitor record');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Enter visitor's full name"
          {...register('fullName', { required: 'Full name is required' })}
          className={errors.fullName ? 'border-red-500' : ''}
        />
        {errors.fullName && (
          <p className="text-xs text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Contact (Email/Phone) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          placeholder="Email or phone number"
          {...register('email', { required: 'Contact information is required' })}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="address"
          placeholder="Enter address"
          {...register('address', { required: 'Address is required' })}
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && (
          <p className="text-xs text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobInfo" className="text-sm font-medium">
          Organization/Bank <span className="text-red-500">*</span>
        </Label>
        <Input
          id="jobInfo"
          placeholder="Enter organization or bank name"
          {...register('jobInfo', { required: 'Organization/Bank is required' })}
          className={errors.jobInfo ? 'border-red-500' : ''}
        />
        {errors.jobInfo && (
          <p className="text-xs text-red-500">{errors.jobInfo.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="incomeLevel" className="text-sm font-medium">
          Income Level <span className="text-red-500">*</span>
        </Label>
        <Select
          value={incomeLevel}
          onValueChange={(value) => {
            setIncomeLevel(value);
            setValue('incomeLevel', value);
          }}
        >
          <SelectTrigger className={errors.incomeLevel ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select income level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Very High">Very High</SelectItem>
          </SelectContent>
        </Select>
        <input
          type="hidden"
          {...register('incomeLevel', { required: 'Income level is required' })}
        />
        {errors.incomeLevel && (
          <p className="text-xs text-red-500">{errors.incomeLevel.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="visitType" className="text-sm font-medium">
          Visit Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={visitType}
          onValueChange={(value) => {
            setVisitType(value);
            setValue('visitType', value);
          }}
        >
          <SelectTrigger className={errors.visitType ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select visit type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New Inquiry">New Inquiry</SelectItem>
            <SelectItem value="Follow-up">Follow-up</SelectItem>
            <SelectItem value="Loan Application">Loan Application</SelectItem>
            <SelectItem value="Account Opening">Account Opening</SelectItem>
            <SelectItem value="General Consultation">General Consultation</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <input
          type="hidden"
          {...register('visitType', { required: 'Visit type is required' })}
        />
        {errors.visitType && (
          <p className="text-xs text-red-500">{errors.visitType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reasonForVisit" className="text-sm font-medium">
          Purpose/Remarks <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="reasonForVisit"
          placeholder="Enter purpose of visit or additional remarks"
          rows={3}
          {...register('reasonForVisit', { required: 'Purpose/Remarks is required' })}
          className={errors.reasonForVisit ? 'border-red-500' : ''}
        />
        {errors.reasonForVisit && (
          <p className="text-xs text-red-500">{errors.reasonForVisit.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full gap-2"
        disabled={addVisitorMutation.isPending}
      >
        {addVisitorMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Add Visitor Record
          </>
        )}
      </Button>
    </form>
  );
}
