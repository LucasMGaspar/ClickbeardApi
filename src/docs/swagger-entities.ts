export class AppointmentEntity {
  id: string;
  userId: string;
  barberId: string;
  specialtyId: string;
  appointmentDate: Date;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export class CancelAppointmentResponseDto {
  message: string;
  appointment: AppointmentEntity;
}