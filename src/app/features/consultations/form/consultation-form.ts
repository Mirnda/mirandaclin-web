import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConsultationService } from '../../../core/services/consultation.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { UserService } from '../../../core/services/user.service';
import { UserWithProfile } from '../../../core/models/user.model';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './consultation-form.html',
  styleUrls: ['./consultation-form.scss'],
})
export class ConsultationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private consultationService = inject(ConsultationService);
  private appointmentService = inject(AppointmentService);
  private userService = inject(UserService);

  form!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  patients = signal<UserWithProfile[]>([]);
  appointments = signal<Appointment[]>([]);
  loadingAppointments = signal(false);

  ngOnInit(): void {
    this.form = this.fb.group({
      patient_id: ['', Validators.required],
      appointment_id: ['', Validators.required],
      diagnosis: [''],
      treatment: [''],
    });

    this.userService.getAll().subscribe({
      next: (res) => this.patients.set((res.data ?? []).filter(u => u.role === 'patient')),
    });

    this.form.get('patient_id')?.valueChanges.subscribe(patientId => {
      this.form.get('appointment_id')?.setValue('');
      this.appointments.set([]);
      if (!patientId) return;

      this.loadingAppointments.set(true);
      this.appointmentService.listByPatient(patientId).subscribe({
        next: (res) => {
          const scheduled = (res.data ?? []).filter(a => a.status === 'scheduled');
          this.appointments.set(scheduled);
          this.loadingAppointments.set(false);
        },
        error: () => this.loadingAppointments.set(false),
      });
    });
  }

  get patientId() { return this.form.get('patient_id'); }
  get appointmentId() { return this.form.get('appointment_id'); }

  formatDateTime(dt: string): string {
    if (!dt) return '';
    return new Date(dt).toLocaleString('pt-BR');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.consultationService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/consultations']),
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao registrar consulta.');
        this.isLoading.set(false);
      },
    });
  }
}
