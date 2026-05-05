import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClinicService } from '../../../core/services/clinic.service';
import { WEEKDAYS } from '../../../core/models/clinic.model';
import { environment } from '../../../../environments/environment';

export const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

@Component({
  selector: 'app-clinic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './clinic-form.html',
  styleUrls: ['./clinic-form.scss'],
})
export class ClinicFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private clinicService = inject(ClinicService);

  form!: FormGroup;
  isLoading = signal(false);
  isCepLoading = signal(false);
  isEdit = signal(false);
  clinicId = signal('');
  errorMessage = signal('');
  weekdays = WEEKDAYS;
  brazilStates = BRAZIL_STATES;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit.set(!!id);
    this.clinicId.set(id ?? '');

    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      open_time: [''],
      close_time: [''],
      operating_days: [[]],
      address: this.fb.group({
        street: [''],
        number: [''],
        complement: [''],
        neighborhood: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: [''],
        postal_code: [''],
      }),
    });

    if (id) {
      this.clinicService.getById(id).subscribe({
        next: (res) => this.form.patchValue(res.data),
        error: () => this.errorMessage.set('Clínica não encontrada.'),
      });
    }
  }

  get name() { return this.form.get('name'); }
  get city() { return this.form.get('address.city'); }
  get state() { return this.form.get('address.state'); }

  formatCep(event: Event): void {
    const input = event.target as HTMLInputElement;
    let raw = input.value.replace(/\D/g, '').slice(0, 8);
    if (raw.length > 5) {
      raw = raw.slice(0, 5) + '-' + raw.slice(5);
    }
    input.value = raw;
    this.form.get('address.postal_code')?.setValue(raw, { emitEvent: false });
  }

  lookupCep(): void {
    const addr = this.form.get('address');
    const rawCep = addr?.get('postal_code')?.value ?? '';
    const cep = rawCep.replace(/\D/g, '');

    if (cep.length !== 8) return;

    // const street = addr?.get('street')?.value ?? '';
    // const neighborhood = addr?.get('neighborhood')?.value ?? '';
    // const city = addr?.get('city')?.value ?? '';
    // const state = addr?.get('state')?.value ?? '';

    // if (street || neighborhood || city || state) return;

    this.isCepLoading.set(true);
    this.http.get<any>(`${environment.apiUrl}/v1/api/cep/${cep}`).subscribe({
      next: (res) => {
        const d = res?.data ?? res;
        addr?.patchValue({
          street: d.street ?? d.logradouro ?? '',
          complement: d.complement ?? d.complemento ?? '',
          neighborhood: d.neighborhood ?? d.bairro ?? '',
          city: d.city ?? d.localidade ?? '',
          state: d.state ?? d.uf ?? '',
        });
        this.isCepLoading.set(false);
      },
      error: () => this.isCepLoading.set(false),
    });
  }

  toggleDay(day: string): void {
    const current: string[] = this.form.get('operating_days')?.value ?? [];
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    this.form.get('operating_days')?.setValue(updated);
  }

  isDaySelected(day: string): boolean {
    return (this.form.get('operating_days')?.value ?? []).includes(day);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const action = this.isEdit()
      ? this.clinicService.update(this.clinicId(), this.form.value)
      : this.clinicService.create(this.form.value);

    action.subscribe({
      next: () => this.router.navigate(['/clinics']),
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao salvar clínica.');
        this.isLoading.set(false);
      },
    });
  }
}
