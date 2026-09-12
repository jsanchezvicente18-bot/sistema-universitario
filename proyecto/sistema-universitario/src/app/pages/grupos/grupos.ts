import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './grupos.html',
  styleUrl: './grupos.scss'
})
export class Grupos implements OnInit {

  grupos: any[] = [];

  editando = false;
  grupoOriginal = '';

  nuevoGrupo = {
    num_g: '',
    horario: '',
    salon: '',
    cupo: null as number | null
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.http
      .get<any[]>('http://127.0.0.1:8000/grupos')
      .subscribe({
        next: (datos) => {
          this.grupos = datos;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(
            'Error al cargar grupos:',
            error
          );
        }
      });
  }

  guardarGrupo(): void {

    if (
      !this.nuevoGrupo.num_g
    ) {
      alert('El número de grupo es obligatorio');
      return;
    }

    if (this.editando) {

      this.http
        .put(
          `http://127.0.0.1:8000/grupos/${this.grupoOriginal}`,
          this.nuevoGrupo
        )
        .subscribe({
          next: () => {
            alert('Grupo actualizado correctamente');
            this.cancelarEdicion();
            this.cargarGrupos();
          },
          error: (error) => {
            console.error(error);
            alert(
              error.error?.detail ||
              'Error al actualizar el grupo'
            );
          }
        });

    } else {

      this.http
        .post(
          'http://127.0.0.1:8000/grupos',
          this.nuevoGrupo
        )
        .subscribe({
          next: () => {
            alert('Grupo agregado correctamente');
            this.limpiarFormulario();
            this.cargarGrupos();
          },
          error: (error) => {
            console.error(error);
            alert(
              error.error?.detail ||
              'Error al agregar el grupo'
            );
          }
        });
    }
  }

  editarGrupo(grupo: any): void {

    this.editando = true;
    this.grupoOriginal = grupo.num_g;

    this.nuevoGrupo = {
      num_g: grupo.num_g,
      horario: grupo.horario,
      salon: grupo.salon,
      cupo: grupo.cupo
    };
  }

  eliminarGrupo(num_g: string): void {

    if (!confirm('¿Seguro que deseas eliminar este grupo?')) {
      return;
    }

    this.http
      .delete(
        `http://127.0.0.1:8000/grupos/${num_g}`
      )
      .subscribe({
        next: () => {
          alert('Grupo eliminado correctamente');
          this.cargarGrupos();
        },
        error: (error) => {
          console.error(error);

          alert(
            error.error?.detail ||
            'No se pudo eliminar el grupo'
          );
        }
      });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.grupoOriginal = '';
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoGrupo = {
      num_g: '',
      horario: '',
      salon: '',
      cupo: null
    };
  }
}