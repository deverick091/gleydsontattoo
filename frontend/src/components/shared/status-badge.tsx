import { Badge } from "@/components/ui/badge";
import { AppointmentStatus } from "@/types";
import { APPOINTMENT_STATUS_INFO } from "@/lib/constants";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const info = APPOINTMENT_STATUS_INFO[status];
  
  if (!info) return null;

  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${info.color}`}>
      {info.label}
    </div>
  );
}
