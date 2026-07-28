import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { SucursalService } from '../../../core/services/sucursal';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, ToastModule, ConfirmDialogModule, CheckboxModule],
  templateUrl: './branches.html',
  styleUrls: ['./branches.css']
})
export class BranchesComponent implements OnInit {
  items: any[] = [];
  displayDialog: boolean = false;
  form: FormGroup;
  isEdit: boolean = false;
  selectedId: number | null = null;

  constructor(private service: SucursalService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.findAll().subscribe((res: any) => {
      this.items = res.data || [];
    });
  }

  showDialogToAdd() {
    this.isEdit = false;
    this.selectedId = null;
    this.form.reset({ activo: true });
    this.displayDialog = true;
  }

  showDialogToEdit(item: any) {
    this.isEdit = true;
    this.selectedId = item.id;
    this.form.patchValue(item);
    this.displayDialog = true;
  }

  save() {
    if (this.form.invalid) return;
    
    if (this.isEdit && this.selectedId) {
      this.service.update(this.selectedId, this.form.value).subscribe((res: any) => {
        this.loadData();
        this.displayDialog = false;
      });
    } else {
      this.service.create(this.form.value).subscribe((res: any) => {
        this.loadData();
        this.displayDialog = false;
      });
    }
  }

  delete(item: any) {
    if(confirm('Are you sure you want to delete this item?')) {
      this.service.delete(item.id).subscribe((res: any) => this.loadData());
    }
  }
}
