import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule, SortIcon } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ProductoService } from '../../../core/services/producto';
import { CategoriaService } from '../../../core/services/categoria';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, CheckboxModule, DropdownModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  items: any[] = [];
  categorias: any[] = [];
  displayDialog: boolean = false;
  form: FormGroup;
  isEdit: boolean = false;
  selectedId: number | null = null;

  constructor(
    private service: ProductoService,
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      codigoBarras: [''],
      nombre: ['', Validators.required],
      principioActivo: [''],
      presentacion: [''],
      categoriaId: [null, Validators.required],
      proveedorId: [null, Validators.required],
      precioVenta: [null, Validators.required],
      requiereReceta: [false],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadCategorias();
  }

  loadCategorias() {
    this.categoriaService.findAll().subscribe(res => this.categorias = res.data);
  }

  loadData() {
    this.service.findAll().subscribe(res => this.items = res.data);
  }

  showDialogToAdd() {
    this.isEdit = false;
    this.selectedId = null;
    this.form.reset();
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
      this.service.update(this.selectedId, this.form.value).subscribe(() => {
        this.loadData();
        this.displayDialog = false;
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.loadData();
        this.displayDialog = false;
      });
    }
  }

  delete(item: any) {
    if(confirm('Are you sure you want to delete this item?')) {
      this.service.delete(item.id).subscribe(() => this.loadData());
    }
  }
}
