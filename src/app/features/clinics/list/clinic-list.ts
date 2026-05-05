import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClinicService } from '../../../core/services/clinic.service';
import { Clinic } from '../../../core/models/clinic.model';

@Component({
  selector: 'app-clinic-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './clinic-list.html',
  styleUrls: ['./clinic-list.scss'],
})
export class ClinicListComponent implements OnInit {
  private clinicService = inject(ClinicService);

  clinics = signal<Clinic[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.clinicService.list().subscribe({
      next: (res) => {
        this.clinics.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao carregar clínicas.');
        this.isLoading.set(false);
      },
    });
  }

  remove(id: string): void {
    if (!confirm('Remover esta clínica?')) return;
    this.clinicService.remove(id).subscribe({
      next: () => this.clinics.update(list => list.filter(c => c.id !== id)),
      error: (err) => this.errorMessage.set(err?.error?.message ?? 'Erro ao remover clínica.'),
    });
  }

  formatDays(days: string[]): string {
    const map: Record<string, string> = {
      monday: 'Seg', tuesday: 'Ter', wednesday: 'Qua',
      thursday: 'Qui', friday: 'Sex', saturday: 'Sáb', sunday: 'Dom',
    };
    return days?.map(d => map[d] ?? d).join(', ') ?? '-';
  }
}
