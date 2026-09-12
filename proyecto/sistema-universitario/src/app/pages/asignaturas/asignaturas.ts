import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asignaturas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './asignaturas.html',
  styleUrl: './asignaturas.scss'
})
export class Asignaturas implements OnInit {

  asignaturas: any[] = [];

  editando = false;
  claveOriginal = '';

  nuevaAsignatura = {
    clave_asig: '',
    nom_asig: '',
    horas_s: '',
    creditos: null as number | null
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAsignaturas();
  }

  cargarAsignaturas(): void {
    this.http
      .get<any[]>('http://127.0.0.1:8000/asignaturas')
      .subscribe({
        next: (datos) => {
          this.asignaturas = datos;
          this.cdr.detectChanges();
        }
      });
  }

  guardarAsignatura(): void {

    if (this.editando) {

      this.http
        .put(
          `http://127.0.0.1:8000/asignaturas/${this.claveOriginal}`,
          this.nuevaAsignatura
        )
        .subscribe({
          next: () => {
            alert('Asignatura actualizada');
            this.cancelarEdicion();
            this.cargarAsignaturas();
          }
        });

    } else {

      this.http
        .post(
          'http://127.0.0.1:8000/asignaturas',
          this.nuevaAsignatura
        )
        .subscribe({
          next: () => {
            alert('Asignatura agregada');
            this.limpiarFormulario();
            this.cargarAsignaturas();
          },
          error: (error) => {
            alert(error.error?.detail || 'Error al agregar');
          }
        });
    }
  }

  editarAsignatura(asignatura: any): void {

    this.editando = true;
    this.claveOriginal = asignatura.clave_asig;

    this.nuevaAsignatura = {
      clave_asig: asignatura.clave_asig,
      nom_asig: asignatura.nom_asig,
      horas_s: asignatura.horas_s,
      creditos: asignatura.creditos
    };
  }

  eliminarAsignatura(clave: string): void {

    if (!confirm('¿Eliminar esta asignatura?')) {
      return;
    }

    this.http
      .delete(
        `http://127.0.0.1:8000/asignaturas/${clave}`
      )
      .subscribe({
        next: () => {
          this.cargarAsignaturas();
        },
        error: (error) => {
          alert(error.error?.detail || 'No se pudo eliminar');
        }
      });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.claveOriginal = '';
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevaAsignatura = {
      clave_asig: '',
      nom_asig: '',
      horas_s: '',
      creditos: null
    };
  }
}