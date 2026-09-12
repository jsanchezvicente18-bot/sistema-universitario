from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mariadb

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def obtener_conexion():
    try:
        return mariadb.connect(
            user="root",
            password="",
            host="localhost",
            port=3306,
            database="sistema_uni"
        )
    except mariadb.Error as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@app.get("/")
def inicio():
    return {"mensaje": "Backend conectado a MariaDB"}


# =====================================================
# ASIGNATURAS
# =====================================================

class Asignatura(BaseModel):
    clave_asig: str
    nom_asig: str
    horas_s: str | None = None
    creditos: int | None = None


@app.get("/asignaturas")
def obtener_asignaturas():
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            SELECT clave_asig, nom_asig, horas_s, creditos
            FROM asignatura
            ORDER BY clave_asig
        """)

        return [
            {
                "clave_asig": fila[0],
                "nom_asig": fila[1],
                "horas_s": str(fila[2]) if fila[2] is not None else None,
                "creditos": fila[3]
            }
            for fila in cursor.fetchall()
        ]
    finally:
        cursor.close()
        conexion.close()


@app.post("/asignaturas")
def crear_asignatura(asignatura: Asignatura):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            INSERT INTO asignatura
            (clave_asig, nom_asig, horas_s, creditos)
            VALUES (?, ?, ?, ?)
        """, (
            asignatura.clave_asig,
            asignatura.nom_asig,
            asignatura.horas_s,
            asignatura.creditos
        ))

        conexion.commit()
        return {"mensaje": "Asignatura agregada correctamente"}

    except mariadb.Error as error:
        conexion.rollback()
        raise HTTPException(status_code=400, detail=str(error))

    finally:
        cursor.close()
        conexion.close()


@app.put("/asignaturas/{clave}")
def editar_asignatura(clave: str, asignatura: Asignatura):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            UPDATE asignatura
            SET nom_asig = ?,
                horas_s = ?,
                creditos = ?
            WHERE clave_asig = ?
        """, (
            asignatura.nom_asig,
            asignatura.horas_s,
            asignatura.creditos,
            clave
        ))

        conexion.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Asignatura no encontrada"
            )

        return {"mensaje": "Asignatura actualizada"}

    finally:
        cursor.close()
        conexion.close()


@app.delete("/asignaturas/{clave}")
def eliminar_asignatura(clave: str):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            DELETE FROM asignatura
            WHERE clave_asig = ?
        """, (clave,))

        conexion.commit()

        return {"mensaje": "Asignatura eliminada"}

    except mariadb.Error as error:
        conexion.rollback()
        raise HTTPException(status_code=400, detail=str(error))

    finally:
        cursor.close()
        conexion.close()


# =====================================================
# GRUPOS
# =====================================================

class Grupo(BaseModel):
    num_g: str
    horario: str | None = None
    salon: str | None = None
    cupo: int | None = None


@app.get("/grupos")
def obtener_grupos():
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            SELECT num_g, horario, salon, cupo
            FROM grupo
            ORDER BY num_g
        """)

        return [
            {
                "num_g": fila[0],
                "horario": str(fila[1]) if fila[1] is not None else None,
                "salon": fila[2],
                "cupo": fila[3]
            }
            for fila in cursor.fetchall()
        ]

    finally:
        cursor.close()
        conexion.close()


@app.post("/grupos")
def crear_grupo(grupo: Grupo):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            INSERT INTO grupo
            (num_g, horario, salon, cupo)
            VALUES (?, ?, ?, ?)
        """, (
            grupo.num_g,
            grupo.horario,
            grupo.salon,
            grupo.cupo
        ))

        conexion.commit()
        return {"mensaje": "Grupo agregado correctamente"}

    except mariadb.Error as error:
        conexion.rollback()
        raise HTTPException(status_code=400, detail=str(error))

    finally:
        cursor.close()
        conexion.close()


@app.put("/grupos/{num_g}")
def editar_grupo(num_g: str, grupo: Grupo):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            UPDATE grupo
            SET horario = ?,
                salon = ?,
                cupo = ?
            WHERE num_g = ?
        """, (
            grupo.horario,
            grupo.salon,
            grupo.cupo,
            num_g
        ))

        conexion.commit()

        return {"mensaje": "Grupo actualizado"}

    finally:
        cursor.close()
        conexion.close()


@app.delete("/grupos/{num_g}")
def eliminar_grupo(num_g: str):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            DELETE FROM grupo
            WHERE num_g = ?
        """, (num_g,))

        conexion.commit()

        return {"mensaje": "Grupo eliminado"}

    except mariadb.Error as error:
        conexion.rollback()
        raise HTTPException(status_code=400, detail=str(error))

    finally:
        cursor.close()
        conexion.close()


# =====================================================
# PROFESORES
# =====================================================

class Profesor(BaseModel):
    num_inst: str
    nombre_prof: str | None = None
    f_nac_p: str | None = None
    correo_p: str | None = None
    tel_p: int | None = None
    num_emp_p: str
    f_cont_p: str | None = None
    salario_prof: float | None = None
    grado_aca: str | None = None
    num_g: str


@app.get("/profesores")
def obtener_profesores():
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            SELECT
                num_inst,
                nombre_prof,
                f_nac_p,
                correo_p,
                tel_p,
                num_emp_p,
                f_cont_p,
                salario_prof,
                grado_aca,
                num_g
            FROM profesor
            ORDER BY nombre_prof
        """)

        return [
            {
                "num_inst": fila[0],
                "nombre_prof": fila[1],
                "f_nac_p": str(fila[2]) if fila[2] else None,
                "correo_p": fila[3],
                "tel_p": fila[4],
                "num_emp_p": fila[5],
                "f_cont_p": str(fila[6]) if fila[6] else None,
                "salario_prof": float(fila[7]) if fila[7] else None,
                "grado_aca": fila[8],
                "num_g": fila[9]
            }
            for fila in cursor.fetchall()
        ]

    finally:
        cursor.close()
        conexion.close()


@app.post("/profesores")
def crear_profesor(profesor: Profesor):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            INSERT INTO profesor (
                num_inst,
                nombre_prof,
                f_nac_p,
                correo_p,
                tel_p,
                num_emp_p,
                f_cont_p,
                salario_prof,
                grado_aca,
                num_g
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            profesor.num_inst,
            profesor.nombre_prof,
            profesor.f_nac_p,
            profesor.correo_p,
            profesor.tel_p,
            profesor.num_emp_p,
            profesor.f_cont_p,
            profesor.salario_prof,
            profesor.grado_aca,
            profesor.num_g
        ))

        conexion.commit()
        return {"mensaje": "Profesor agregado correctamente"}

    except mariadb.Error as error:
        conexion.rollback()
        raise HTTPException(status_code=400, detail=str(error))

    finally:
        cursor.close()
        conexion.close()


@app.put("/profesores/{num_inst}/{num_emp_p}/{num_g}")
def editar_profesor(
    num_inst: str,
    num_emp_p: str,
    num_g: str,
    profesor: Profesor
):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            UPDATE profesor
            SET nombre_prof = ?,
                f_nac_p = ?,
                correo_p = ?,
                tel_p = ?,
                f_cont_p = ?,
                salario_prof = ?,
                grado_aca = ?
            WHERE num_inst = ?
              AND num_emp_p = ?
              AND num_g = ?
        """, (
            profesor.nombre_prof,
            profesor.f_nac_p,
            profesor.correo_p,
            profesor.tel_p,
            profesor.f_cont_p,
            profesor.salario_prof,
            profesor.grado_aca,
            num_inst,
            num_emp_p,
            num_g
        ))

        conexion.commit()

        return {"mensaje": "Profesor actualizado"}

    finally:
        cursor.close()
        conexion.close()


@app.delete("/profesores/{num_inst}/{num_emp_p}/{num_g}")
def eliminar_profesor(
    num_inst: str,
    num_emp_p: str,
    num_g: str
):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            DELETE FROM profesor
            WHERE num_inst = ?
              AND num_emp_p = ?
              AND num_g = ?
        """, (
            num_inst,
            num_emp_p,
            num_g
        ))

        conexion.commit()

        return {"mensaje": "Profesor eliminado"}

    finally:
        cursor.close()
        conexion.close()


# =====================================================
# APERTURAS
# =====================================================

class Apertura(BaseModel):
    clave_asig: str
    num_g: str


@app.get("/aperturas")
def obtener_aperturas():
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            SELECT clave_asig, num_g
            FROM apertura
            ORDER BY clave_asig, num_g
        """)

        return [
            {
                "clave_asig": fila[0],
                "num_g": fila[1]
            }
            for fila in cursor.fetchall()
        ]

    finally:
        cursor.close()
        conexion.close()


@app.post("/aperturas")
def crear_apertura(apertura: Apertura):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            INSERT INTO apertura
            (clave_asig, num_g)
            VALUES (?, ?)
        """, (
            apertura.clave_asig,
            apertura.num_g
        ))

        conexion.commit()

        return {"mensaje": "Apertura agregada correctamente"}

    except mariadb.Error as error:
        conexion.rollback()
        raise HTTPException(status_code=400, detail=str(error))

    finally:
        cursor.close()
        conexion.close()


@app.put("/aperturas/{clave}/{num_g}")
def editar_apertura(
    clave: str,
    num_g: str,
    apertura: Apertura
):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            UPDATE apertura
            SET clave_asig = ?,
                num_g = ?
            WHERE clave_asig = ?
              AND num_g = ?
        """, (
            apertura.clave_asig,
            apertura.num_g,
            clave,
            num_g
        ))

        conexion.commit()

        return {"mensaje": "Apertura actualizada"}

    except mariadb.Error as error:
        conexion.rollback()
        raise HTTPException(status_code=400, detail=str(error))

    finally:
        cursor.close()
        conexion.close()


@app.delete("/aperturas/{clave}/{num_g}")
def eliminar_apertura(clave: str, num_g: str):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            DELETE FROM apertura
            WHERE clave_asig = ?
              AND num_g = ?
        """, (
            clave,
            num_g
        ))

        conexion.commit()

        return {"mensaje": "Apertura eliminada"}

    except mariadb.Error as error:
        conexion.rollback()
        raise HTTPException(status_code=400, detail=str(error))

    finally:
        cursor.close()
        conexion.close()