import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CollaboratorService } from '../../../core/services/collaborator.service';
import { ClinicService } from '../../../core/services/clinic.service';
import { Clinic } from '../../../core/models/clinic.model';
import { CreateCollaboratorRequest, UpdateProfileRequest, ShiftPerDay } from '../../../core/models/collaborator.model';

interface DayRow {
  week_day: string;
  label: string;
  selected: boolean;
  start_time: string;
  end_time: string;
}

const ALL_DAYS: DayRow[] = [
  { week_day: 'monday',    label: 'Seg', selected: false, start_time: '08:00', end_time: '18:00' },
  { week_day: 'tuesday',   label: 'Ter', selected: false, start_time: '08:00', end_time: '18:00' },
  { week_day: 'wednesday', label: 'Qua', selected: false, start_time: '08:00', end_time: '18:00' },
  { week_day: 'thursday',  label: 'Qui', selected: false, start_time: '08:00', end_time: '18:00' },
  { week_day: 'friday',    label: 'Sex', selected: false, start_time: '08:00', end_time: '18:00' },
  { week_day: 'saturday',  label: 'Sáb', selected: false, start_time: '08:00', end_time: '13:00' },
  { week_day: 'sunday',    label: 'Dom', selected: false, start_time: '08:00', end_time: '13:00' },
];

@Component({
  selector: 'app-collaborator-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './collaborator-form.html',
  styleUrls: ['./collaborator-form.scss'],
})
export class CollaboratorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private collaboratorService = inject(CollaboratorService);
  private clinicService = inject(ClinicService);

  form!: FormGroup;
  isLoading = signal(false);
  isLoadingData = signal(false);
  errorMessage = signal('');
  clinics = signal<Clinic[]>([]);
  dayRows = signal<DayRow[]>(ALL_DAYS.map(d => ({ ...d })));
  isEditMode = signal(false);
  editId = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!id);
    this.editId.set(id);

    this.form = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      role: ['', Validators.required],
      phone: [''],
      has_whatsapp: [false],
      document: [''],
      birth_date: [''],
      emergency_contact_name: [''],
      emergency_contact_phone: [''],
      clinic_id: [''],
      slot_duration_minutes: [30],
    });

    if (id) {
      this.isLoadingData.set(true);
      this.collaboratorService.getProfile(id).subscribe({
        next: (res) => {
          const p = res.data;
          if (p) {
            this.form.patchValue({
              full_name: p.full_name,
              role: p.role,
              phone: p.phone,
              has_whatsapp: p.has_whatsapp,
              document: p.document,
              birth_date: p.birth_date ? p.birth_date.substring(0, 10) : '',
              emergency_contact_name: p.emergency_contact_name,
              emergency_contact_phone: p.emergency_contact_phone,
            });
          }
          this.isLoadingData.set(false);
        },
        error: () => {
          this.errorMessage.set('Erro ao carregar dados do colaborador.');
          this.isLoadingData.set(false);
        },
      });
    } else {
      this.clinicService.list().subscribe({
        next: (res) => this.clinics.set(res.data ?? []),
      });
    }
  }

  get fullName() { return this.form.get('full_name'); }
  get role() { return this.form.get('role'); }

  toggleDay(index: number): void {
    this.dayRows.update(rows => {
      const copy = [...rows];
      copy[index] = { ...copy[index], selected: !copy[index].selected };
      return copy;
    });
  }

  updateDayTime(index: number, field: 'start_time' | 'end_time', value: string): void {
    this.dayRows.update(rows => {
      const copy = [...rows];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const value = this.form.value;
    const id = this.editId();

    if (id) {
      const payload: UpdateProfileRequest = {
        full_name: value.full_name,
        role: value.role,
      };
      if (value.phone) payload.phone = value.phone;
      if (value.has_whatsapp) payload.has_whatsapp = value.has_whatsapp;
      if (value.document) payload.document = value.document;
      if (value.birth_date) payload.birth_date = `${value.birth_date}T00:00:00Z`;
      if (value.emergency_contact_name) payload.emergency_contact_name = value.emergency_contact_name;
      if (value.emergency_contact_phone) payload.emergency_contact_phone = value.emergency_contact_phone;

      this.collaboratorService.updateProfile(id, payload).subscribe({
        next: () => this.router.navigate(['/collaborators']),
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Erro ao atualizar colaborador.');
          this.isLoading.set(false);
        },
      });
    } else {
      const payload: CreateCollaboratorRequest = {
        full_name: value.full_name,
        role: value.role,
      };
      if (value.phone) payload.phone = value.phone;
      if (value.has_whatsapp) payload.has_whatsapp = value.has_whatsapp;
      if (value.document) payload.document = value.document;
      if (value.birth_date) payload.birth_date = `${value.birth_date}T00:00:00Z`;
      if (value.emergency_contact_name) payload.emergency_contact_name = value.emergency_contact_name;
      if (value.emergency_contact_phone) payload.emergency_contact_phone = value.emergency_contact_phone;

      if (value.clinic_id) {
        const selectedDays: ShiftPerDay[] = this.dayRows()
          .filter(d => d.selected)
          .map(d => ({ week_day: d.week_day, start_time: d.start_time, end_time: d.end_time }));

        payload.profile_clinics = [{
          clinic_id: value.clinic_id,
          slot_duration_minutes: value.slot_duration_minutes || 30,
          working_days: selectedDays,
        }];
      }

      this.collaboratorService.create(payload).subscribe({
        next: () => this.router.navigate(['/collaborators']),
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Erro ao criar colaborador.');
          this.isLoading.set(false);
        },
      });
    }
  }
}
