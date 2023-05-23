
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { idEmpresa } from 'src/environments/environment';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { Router } from '@angular/router';
import Swal from 'sweetalert2';


import { idUniversal } from 'src/environments/environment';
import { Usuario } from 'src/app/models/persona';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-crearModificarUsuario.component',
  templateUrl: './crearModificarUsuario.component.html',
  styleUrls: ['./crearModificarUsuario.component.css'],


})

export class CrearModificarUsuarioComponent implements OnInit {


  public botonParaGuardar: Boolean = false;
  botonParaActualizar: Boolean = false;


  public controlInfoProveedor: Boolean = false;


  public numeroControl: number = 1;

  loaderActualizar: boolean;

  loaderCargaDatos: boolean;


  formGrupos = new FormGroup({
    cedula: new FormControl<String>('', [Validators.required, Validators.maxLength(13), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    fecha: new FormControl<any>(null,),
    nombres: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    apellidos: new FormControl<String>(null, [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    email: new FormControl<String>('', [Validators.required, Validators.email]),
    clave: new FormControl<String>('', [Validators.required]),
    telefono: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
    idRol: new FormControl<Number>(null, [Validators.required]),

  })


  public UsuarioListaGuardar: Usuario = new Usuario();

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private usuarioService: UsuarioService,
  ) {
  }

  ngOnInit(): void {
    this.controlInicio();

  }
  public fechaNacimiento: any;
  public controlFecha: Boolean = false;

  public controlInicio() {

    if (idUniversal.getIdUniversal == 0) {
      this.botonParaGuardar = true;
      this.botonParaActualizar = false;

    } else {

      this.loaderCargaDatos = true;

      console.info(idUniversal.getIdUniversal)
      
      this.usuarioService.getUsuarioId(idUniversal.getIdUniversal).subscribe(value => {

        console.info(value
          )
        this.UsuarioListaGuardar.id = value.id;
        this.UsuarioListaGuardar.idPersona = value.idPersona;

        this.fechaNacimiento = value.fechaNacimiento;
        var fecha = new Date(value.fechaNacimiento);
        var dias = 1; // Número de días a agregar
        fecha.setDate(fecha.getDate() + dias);

        this.formGrupos.setValue({
          cedula: value.cedula,
          fecha: value.fechaNacimiento,
          nombres: value.nombres,
          apellidos: value.apellidos,
          email: value.email,
          clave: '',
          telefono: value.telefono,
          idRol: value.idRol,
        })

        this.loaderCargaDatos = false;
      })

      this.botonParaGuardar = false;
      this.botonParaActualizar = true;

    }

  }


  public botonCancelarRegistro() {
    this.router.navigate(['/panel/biblioteca/administracionusuarios']);
    idUniversal.setIdUniversal = 0;
  }

  vaciarFormulario() {
    this.controlInfoProveedor = false;
  }


  public guardarInformacion() {
    this.loaderActualizar = true;
    this.UsuarioListaGuardar.cedula = Object.values(this.formGrupos.getRawValue())[0];
    this.UsuarioListaGuardar.fechaNacimiento = Object.values(this.formGrupos.getRawValue())[1];
    this.UsuarioListaGuardar.nombres = Object.values(this.formGrupos.getRawValue())[2];
    this.UsuarioListaGuardar.apellidos = Object.values(this.formGrupos.getRawValue())[3];
    this.UsuarioListaGuardar.email = Object.values(this.formGrupos.getRawValue())[4];
    this.UsuarioListaGuardar.clave = Object.values(this.formGrupos.getRawValue())[5];
    this.UsuarioListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[6];
    this.UsuarioListaGuardar.idRol = Object.values(this.formGrupos.getRawValue())[7];
    this.UsuarioListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;


    console.info(this.UsuarioListaGuardar)
    this.usuarioService.createUsuario(this.UsuarioListaGuardar).subscribe(value => {
      this._snackBar.open('Usuario registrado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }


  public fechacontrol() {
    this.controlFecha = true;
  }

  public guardarInformacionEditar() {
    this.loaderActualizar = true;
    this.UsuarioListaGuardar.cedula = Object.values(this.formGrupos.getRawValue())[0];

    if (this.controlFecha == true) {
      this.UsuarioListaGuardar.fechaNacimiento = Object.values(this.formGrupos.getRawValue())[1];
    } else {
      this.UsuarioListaGuardar.fechaNacimiento = this.fechaNacimiento;
    }

    this.UsuarioListaGuardar.nombres = Object.values(this.formGrupos.getRawValue())[2];
    this.UsuarioListaGuardar.apellidos = Object.values(this.formGrupos.getRawValue())[3];
    this.UsuarioListaGuardar.email = Object.values(this.formGrupos.getRawValue())[4];
    this.UsuarioListaGuardar.clave = Object.values(this.formGrupos.getRawValue())[5];
    this.UsuarioListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[6];
    this.UsuarioListaGuardar.idRol = Object.values(this.formGrupos.getRawValue())[7];
    this.UsuarioListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;


    console.info(this.UsuarioListaGuardar)

    this.usuarioService.putUsuario(this.UsuarioListaGuardar).subscribe(value => {
      this._snackBar.open('Usuario actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }

}