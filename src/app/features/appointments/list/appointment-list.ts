import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './appointment-list.html',
  styleUrls: ['./appointment-list.scss'],
})
export class AppointmentListComponent {
  private appointmentService = inject(AppointmentService);
  private fb = inject(FormBuilder);

  appointments = signal<Appointment[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  searched = signal(false);

  searchForm = this.fb.group({ patient_id: [''] });

  search(): void {
    const patientId = this.searchForm.get('patient_id')?.value?.trim();
    if (!patientId) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.searched.set(true);

    this.appointmentService.listByPatient(patientId).subscribe({
      next: (res) => {
        this.appointments.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao buscar agendamentos.');
        this.isLoading.set(false);
      },
    });
  }

  cancel(id: string): void {
    if (!confirm('Cancelar este agendamento?')) return;
    this.appointmentService.cancel(id).subscribe({
      next: () => this.appointments.update(list => list.filter(a => a.id !== id)),
      error: (err) => this.errorMessage.set(err?.error?.message ?? 'Erro ao cancelar.'),
    });
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  statusClass(status: string): string {
    if (status === 'canceled') return 'badge--red';
    if (status === 'done') return 'badge--green';
    return 'badge--gray';
  }
}
