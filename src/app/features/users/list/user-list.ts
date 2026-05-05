import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss'],
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  users = signal<User[]>([]);
  user = signal<User | null>(null);
  isLoading = signal(false);
  isLoadingList = signal(false);
  errorMessage = signal('');
  searched = signal(false);

  searchForm = this.fb.group({ user_id: [''] });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoadingList.set(true);
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users.set(res.data ?? []);
        this.isLoadingList.set(false);
      },
      error: () => {
        this.isLoadingList.set(false);
      },
    });
  }

  search(): void {
    const id = this.searchForm.get('user_id')?.value?.trim();
    if (!id) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.searched.set(true);
    this.user.set(null);

    this.userService.getById(id).subscribe({
      next: (res) => {
        this.user.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Usuário não encontrado.');
        this.isLoading.set(false);
      },
    });
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
