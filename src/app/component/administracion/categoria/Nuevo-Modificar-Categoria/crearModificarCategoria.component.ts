
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
import { Proveedor, Usuario } from 'src/app/models/persona';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';


@Component({
  selector: 'app-crearModificarCategoria.component',
  templateUrl: './crearModificarCategoria.component.html',
  styleUrls: ['./crearModificarCategoria.component.css'],


})

export class CrearModificarCategoriaComponent implements OnInit {


  public botonParaGuardar: Boolean = false;
  botonParaActualizar: Boolean = false;


  public controlInfoProveedor: Boolean = false;


  public numeroControl: number = 1;

  loaderActualizar: boolean;

  loaderCargaDatos: boolean;


  formGrupos = new FormGroup({
    nombre: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
   
  })


  public UsuarioListaGuardar: Usuario = new Usuario();
  public ProveedorListaGuardar: Proveedor = new Proveedor();
  public CategoriaListaGuardar: Categoria = new Categoria();

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
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



      this.categoriaService.getCategoriaId(idUniversal.getIdUniversal).subscribe(value => {

        this.CategoriaListaGuardar.id = value.id;

        this.formGrupos.setValue({
          nombre: value.nombre,
        })

        this.loaderCargaDatos = false;
      })

      this.botonParaGuardar = false;
      this.botonParaActualizar = true;

    }

  }


  public botonCancelarRegistro() {
    this.router.navigate(['/panel/biblioteca/administracioncategoria']);
    idUniversal.setIdUniversal = 0;
  }

  vaciarFormulario() {
    this.controlInfoProveedor = false;
  }


  public guardarInformacion() {
    this.loaderActualizar = true;

    this.CategoriaListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.CategoriaListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;


    this.categoriaService.createCategoria(this.CategoriaListaGuardar).subscribe(value => {
      this._snackBar.open('Categoria registrado', 'ACEPTAR');
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

    this.CategoriaListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.CategoriaListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;

    this.categoriaService.putCategoria(this.CategoriaListaGuardar).subscribe(value => {
      this._snackBar.open('Categoria actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }

}