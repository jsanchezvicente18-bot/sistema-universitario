import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profesores.html',
  styleUrl: './profesores.scss'
})
export class Profesores implements OnInit {

  profesores: any[] = [];

  editando = false;

  claveOriginal = {
    num_inst: '',
    num_emp_p: '',
    num_g: ''
  };

  nuevoProfesor = {
    num_inst: '',
    nombre_prof: '',
    f_nac_p: '',
    correo_p: '',
    tel_p: null as number | null,
    num_emp_p: '',
    f_cont_p: '',
    salario_prof: null as number | null,
    grado_aca: '',
    num_g: ''
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProfesores();
  }

  cargarProfesores(): void {
    this.http
      .get<any[]>('http://127.0.0.1:8000/profesores')
      .subscribe({
        next: (datos) => {
          this.profesores = datos;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar profesores:', error);
        }
      });
  }

  guardarProfesor(): void {

    if (
      !this.nuevoProfesor.num_inst ||
      !this.nuevoProfesor.num_emp_p ||
      !this.nuevoProfesor.num_g
    ) {
      alert(
        'Número de institución, número de empleado y grupo son obligatorios'
      );
      return;
    }

    if (this.editando) {

      const url =
        `http://127.0.0.1:8000/profesores/` +
        `${this.claveOriginal.num_inst}/` +
        `${this.claveOriginal.num_emp_p}/` +
        `${this.claveOriginal.num_g}`;

      this.http
        .put(url, this.nuevoProfesor)
        .subscribe({
          next: () => {
            alert('Profesor actualizado correctamente');
            this.cancelarEdicion();
            this.cargarProfesores();
          },
          error: (error) => {
            console.error(error);
            alert(
              error.error?.detail ||
              'Error al actualizar el profesor'
            );
          }
        });

    } else {

      this.http
        .post(
          'http://127.0.0.1:8000/profesores',
          this.nuevoProfesor
        )
        .subscribe({
          next: () => {
            alert('Profesor agregado correctamente');
            this.limpiarFormulario();
            this.cargarProfesores();
          },
          error: (error) => {
            console.error(error);
            alert(
              error.error?.detail ||
              'Error al agregar el profesor'
            );
          }
        });
    }
  }

  editarProfesor(profesor: any): void {

    this.editando = true;

    this.claveOriginal = {
      num_inst: profesor.num_inst,
      num_emp_p: profesor.num_emp_p,
      num_g: profesor.num_g
    };

    this.nuevoProfesor = {
      num_inst: profesor.num_inst,
      nombre_prof: profesor.nombre_prof,
      f_nac_p: profesor.f_nac_p,
      correo_p: profesor.correo_p,
      tel_p: profesor.tel_p,
      num_emp_p: profesor.num_emp_p,
      f_cont_p: profesor.f_cont_p,
      salario_prof: profesor.salario_prof,
      grado_aca: profesor.grado_aca,
      num_g: profesor.num_g
    };
  }

  eliminarProfesor(profesor: any): void {

    if (!confirm('¿Seguro que deseas eliminar este profesor?')) {
      return;
    }

    const url =
      `http://127.0.0.1:8000/profesores/` +
      `${profesor.num_inst}/` +
      `${profesor.num_emp_p}/` +
      `${profesor.num_g}`;

    this.http
      .delete(url)
      .subscribe({
        next: () => {
          alert('Profesor eliminado correctamente');
          this.cargarProfesores();
        },
        error: (error) => {
          console.error(error);
          alert(
            error.error?.detail ||
            'No se pudo eliminar el profesor'
          );
        }
      });
  }

  cancelarEdicion(): void {
    this.editando = false;

    this.claveOriginal = {
      num_inst: '',
      num_emp_p: '',
      num_g: ''
    };

    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoProfesor = {
      num_inst: '',
      nombre_prof: '',
      f_nac_p: '',
      correo_p: '',
      tel_p: null,
      num_emp_p: '',
      f_cont_p: '',
      salario_prof: null,
      grado_aca: '',
      num_g: ''
    };
  }
}