
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
  selector: 'app-crearModificarCliente.component',
  templateUrl: './crearModificarCliente.component.html',
  styleUrls: ['./crearModificarCliente.component.css'],


})

export class CrearModificarClienteComponent implements OnInit {


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
    telefono: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
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



      this.usuarioService.getClienteId(idUniversal.getIdUniversal).subscribe(value => {


        this.UsuarioListaGuardar.id = value.id;
        this.UsuarioListaGuardar.idPersona = value.idPersona;


        this.fechaNacimiento = value.fechaNacimiento;
        var fecha = new Date(value.fechaNacimiento);
        var dias = 1; // Número de días a agregar
        fecha.setDate(fecha.getDate() + dias);

        this.UsuarioListaGuardar.fechaNacimiento = fecha;

        this.formGrupos.setValue({
          cedula: value.cedula,
          fecha: fecha,
          nombres: value.nombres,
          apellidos: value.apellidos,
          email: value.email,
          telefono: value.telefono,
        })

        this.loaderCargaDatos = false;
      })

      this.botonParaGuardar = false;
      this.botonParaActualizar = true;

    }

  }


  public botonCancelarRegistro() {
    this.router.navigate(['/panel/biblioteca/administracionclientes']);
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
    this.UsuarioListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[5];
    this.UsuarioListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;


    this.usuarioService.createCliente(this.UsuarioListaGuardar).subscribe(value => {
      this._snackBar.open('Cliente registrado', 'ACEPTAR');
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
    }

    this.UsuarioListaGuardar.nombres = Object.values(this.formGrupos.getRawValue())[2];
    this.UsuarioListaGuardar.apellidos = Object.values(this.formGrupos.getRawValue())[3];
    this.UsuarioListaGuardar.email = Object.values(this.formGrupos.getRawValue())[4];
    this.UsuarioListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[5];
    this.UsuarioListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;



    this.usuarioService.putCliente(this.UsuarioListaGuardar).subscribe(value => {
      this._snackBar.open('Cliente actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }

}