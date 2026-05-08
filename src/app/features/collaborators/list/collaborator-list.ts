import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CollaboratorService } from '../../../core/services/collaborator.service';
import { Collaborator } from '../../../core/models/collaborator.model';

const ROLE_LABELS: Record<string, string> = {
  dentist: 'Dentista',
  secretary: 'Secretária',
  admin: 'Admin',
};

@Component({
  selector: 'app-collaborator-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collaborator-list.html',
  styleUrls: ['./collaborator-list.scss'],
})
export class CollaboratorListComponent implements OnInit {
  private collaboratorService = inject(CollaboratorService);
  private router = inject(Router);

  collaborators = signal<Collaborator[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.isLoading.set(true);
    this.collaboratorService.list().subscribe({
      next: (res) => {
        this.collaborators.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao carregar colaboradores.');
        this.isLoading.set(false);
      },
    });
  }

  roleLabel(role: string): string {
    return ROLE_LABELS[role] ?? role;
  }

  clinicNames(collab: Collaborator): string {
    return collab.collaborator_clinics?.map(cc => cc.clinic?.name).filter(Boolean).join(', ') || '-';
  }

  formatAddress(collab: Collaborator): string {
    const addr = collab.profile?.address;
    if (!addr?.city && !addr?.state) return '-';
    return [addr.city, addr.state].filter(Boolean).join(' - ');
  }

  editCollaborator(profileId: string): void {
    this.router.navigate(['/collaborators', profileId, 'edit']);
  }

  deleteCollaborator(profileId: string, name: string): void {
    if (!confirm(`Remover o colaborador "${name}"? Esta ação não pode ser desfeita.`)) return;
    this.collaboratorService.deleteProfile(profileId).subscribe({
      next: () => {
        this.collaborators.update(list => list.filter(c => c.profile.id !== profileId));
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao remover colaborador.');
      },
    });
  }
}
