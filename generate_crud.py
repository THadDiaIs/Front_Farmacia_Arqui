import os
import re

components = [
    {
        "name": "Products",
        "entity": "Producto",
        "service": "ProductoService",
        "api_path": "producto",
        "path": "src/app/features/admin/products",
        "fields": [
            {"name": "id", "type": "number", "label": "ID"},
            {"name": "nombre", "type": "string", "label": "Name"},
            {"name": "precio", "type": "number", "label": "Price"},
            {"name": "stock", "type": "number", "label": "Stock"}
        ]
    },
    {
        "name": "Categories",
        "entity": "Categoria",
        "service": "CategoriaService",
        "api_path": "categoria",
        "path": "src/app/features/admin/categories",
        "fields": [
            {"name": "id", "type": "number", "label": "ID"},
            {"name": "nombre", "type": "string", "label": "Name"},
            {"name": "descripcion", "type": "string", "label": "Description"}
        ]
    },
    {
        "name": "Inventory",
        "entity": "Inventario",
        "service": "InventarioService",
        "api_path": "inventario",
        "path": "src/app/features/admin/inventory",
        "fields": [
            {"name": "id", "type": "number", "label": "ID"},
            {"name": "productoId", "type": "number", "label": "Product ID"},
            {"name": "cantidad", "type": "number", "label": "Quantity"},
            {"name": "fechaActualizacion", "type": "Date", "label": "Last Updated"}
        ]
    },
    {
        "name": "Customers",
        "entity": "Cliente",
        "service": "ClienteService",
        "api_path": "cliente",
        "path": "src/app/features/admin/customers",
        "fields": [
            {"name": "id", "type": "number", "label": "ID"},
            {"name": "nombre", "type": "string", "label": "Name"},
            {"name": "email", "type": "string", "label": "Email"},
            {"name": "telefono", "type": "string", "label": "Phone"}
        ]
    },
    {
        "name": "Branches",
        "entity": "Sucursal",
        "service": "SucursalService",
        "api_path": "sucursal",
        "path": "src/app/features/admin/branches",
        "fields": [
            {"name": "id", "type": "number", "label": "ID"},
            {"name": "nombre", "type": "string", "label": "Name"},
            {"name": "direccion", "type": "string", "label": "Address"}
        ]
    }
]

base_dir = "/home/nda/Documents/Projects/farmacia-front"

# Create Services
for comp in components:
    svc_code = f"""import {{ Injectable }} from '@angular/core';
import {{ HttpClient }} from '@angular/common/http';
import {{ Observable }} from 'rxjs';

@Injectable({{
  providedIn: 'root'
}})
export class {comp['service']} {{
  private apiUrl = '/api/{comp['api_path']}';

  constructor(private http: HttpClient) {{ }}

  getAll(): Observable<any[]> {{
    return this.http.get<any[]>(this.apiUrl);
  }}

  create(data: any): Observable<any> {{
    return this.http.post<any>(this.apiUrl, data);
  }}

  update(id: number, data: any): Observable<any> {{
    return this.http.put<any>(`${{this.apiUrl}}/${{id}}`, data);
  }}

  delete(id: number): Observable<any> {{
    return this.http.delete<any>(`${{this.apiUrl}}/${{id}}`);
  }}
}}
"""
    svc_path = os.path.join(base_dir, f"src/app/core/services/{comp['api_path']}.ts")
    with open(svc_path, "w") as f:
        f.write(svc_code)

# Create Components
for comp in components:
    comp_ts = f"""import {{ Component, OnInit }} from '@angular/core';
import {{ CommonModule }} from '@angular/common';
import {{ ReactiveFormsModule, FormBuilder, FormGroup, Validators }} from '@angular/forms';
import {{ TableModule }} from 'primeng/table';
import {{ DialogModule }} from 'primeng/dialog';
import {{ ButtonModule }} from 'primeng/button';
import {{ InputTextModule }} from 'primeng/inputtext';
import {{ {comp['service']} }} from '../../../core/services/{comp['api_path']}';

@Component({{
  selector: 'app-{comp['name'].lower()}',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './{comp['name'].lower()}.html',
  styleUrls: ['./{comp['name'].lower()}.css']
}})
export class {comp['name']}Component implements OnInit {{
  items: any[] = [];
  displayDialog: boolean = false;
  form: FormGroup;
  isEdit: boolean = false;
  selectedId: number | null = null;

  constructor(private service: {comp['service']}, private fb: FormBuilder) {{
    this.form = this.fb.group({{
"""
    for field in comp['fields']:
        if field['name'] != 'id':
            comp_ts += f"      {field['name']}: ['', Validators.required],\n"
    comp_ts += f"""    }});
  }}

  ngOnInit(): void {{
    this.loadData();
  }}

  loadData() {{
    this.service.getAll().subscribe(data => this.items = data);
  }}

  showDialogToAdd() {{
    this.isEdit = false;
    this.selectedId = null;
    this.form.reset();
    this.displayDialog = true;
  }}

  showDialogToEdit(item: any) {{
    this.isEdit = true;
    this.selectedId = item.id;
    this.form.patchValue(item);
    this.displayDialog = true;
  }}

  save() {{
    if (this.form.invalid) return;
    
    if (this.isEdit && this.selectedId) {{
      this.service.update(this.selectedId, this.form.value).subscribe(() => {{
        this.loadData();
        this.displayDialog = false;
      }});
    }} else {{
      this.service.create(this.form.value).subscribe(() => {{
        this.loadData();
        this.displayDialog = false;
      }});
    }}
  }}

  delete(item: any) {{
    if(confirm('Are you sure you want to delete this item?')) {{
      this.service.delete(item.id).subscribe(() => this.loadData());
    }}
  }}
}}
"""
    comp_html = f"""<div class="p-6 bg-white rounded-lg shadow-md m-4 border border-gray-100">
  <div class="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
    <h1 class="text-2xl font-semibold text-gray-800 tracking-tight">{comp['name']} Management</h1>
    <p-button label="Add {comp['entity']}" icon="pi pi-plus" (onClick)="showDialogToAdd()" styleClass="p-button-success bg-green-500 hover:bg-green-600 border-none rounded-md px-4 py-2 text-white shadow-sm transition-colors duration-200"></p-button>
  </div>

  <p-table [value]="items" [paginator]="true" [rows]="10" styleClass="p-datatable-sm p-datatable-gridlines border border-gray-200 rounded overflow-hidden shadow-sm" [globalFilterFields]="['nombre']" responsiveLayout="scroll">
    <ng-template pTemplate="header">
      <tr class="bg-gray-50 text-gray-700">
"""
    for field in comp['fields']:
        comp_html += f"        <th pSortableColumn=\"{field['name']}\" class=\"font-medium py-3 px-4 text-left border-b border-gray-200\">{field['label']} <p-sortIcon field=\"{field['name']}\"></p-sortIcon></th>\n"
    
    comp_html += f"""        <th class="font-medium py-3 px-4 text-center border-b border-gray-200">Actions</th>
      </tr>
    </ng-template>
    <ng-template pTemplate="body" let-item>
      <tr class="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100">
"""
    for field in comp['fields']:
        comp_html += f"        <td class=\"py-3 px-4 text-gray-600\">{{{{item.{field['name']}}}}}</td>\n"

    comp_html += f"""        <td class="py-3 px-4 text-center space-x-2">
          <p-button icon="pi pi-pencil" (onClick)="showDialogToEdit(item)" styleClass="p-button-rounded p-button-text p-button-info text-blue-500 hover:bg-blue-50"></p-button>
          <p-button icon="pi pi-trash" (onClick)="delete(item)" styleClass="p-button-rounded p-button-text p-button-danger text-red-500 hover:bg-red-50"></p-button>
        </td>
      </tr>
    </ng-template>
  </p-table>

  <p-dialog header="{{{{isEdit ? 'Edit {comp['entity']}' : 'Add {comp['entity']}'}}}}" [(visible)]="displayDialog" [modal]="true" [style]="{{width: '450px'}}" styleClass="rounded-lg shadow-xl overflow-hidden">
    <form [formGroup]="form" class="p-fluid grid grid-cols-1 gap-5 pt-4">
"""
    for field in comp['fields']:
        if field['name'] != 'id':
            comp_html += f"""      <div class="field flex flex-col gap-2">
        <label for="{field['name']}" class="text-sm font-medium text-gray-700">{field['label']}</label>
        <input pInputText id="{field['name']}" formControlName="{field['name']}" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
      </div>
"""

    comp_html += f"""    </form>
    <ng-template pTemplate="footer">
      <div class="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
        <p-button label="Cancel" icon="pi pi-times" (onClick)="displayDialog=false" styleClass="p-button-text text-gray-600 hover:bg-gray-100 px-4 py-2 rounded"></p-button>
        <p-button label="Save" icon="pi pi-check" (onClick)="save()" [disabled]="form.invalid" styleClass="bg-blue-600 hover:bg-blue-700 text-white border-none px-4 py-2 rounded shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"></p-button>
      </div>
    </ng-template>
  </p-dialog>
</div>
"""
    comp_path_ts = os.path.join(base_dir, f"{comp['path']}/{comp['name'].lower()}.ts")
    comp_path_html = os.path.join(base_dir, f"{comp['path']}/{comp['name'].lower()}.html")
    
    with open(comp_path_ts, "w") as f:
        f.write(comp_ts)
        
    with open(comp_path_html, "w") as f:
        f.write(comp_html)

print("Done generating files")
