
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fechaActual, idEmpresa } from 'src/environments/environment';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { Router } from '@angular/router';
import Swal from 'sweetalert2';


import { idUniversal } from 'src/environments/environment';
import { Proveedor, Usuario } from 'src/app/models/persona';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CajaService } from 'src/app/services/caja.service';
import { PersonaUsuario } from 'src/app/models/personaUsuario';


@Component({
  selector: 'app-resumenGeneral.component',
  templateUrl: './resumenGeneral.component.html',
  styleUrls: ['./resumenGeneral.component.css'],


})

export class ResumenGeneralComponent implements OnInit {


  public botonParaGuardar: Boolean = false;
  botonParaActualizar: Boolean = false;


  public controlInfoProveedor: Boolean = false;


  public numeroControl: number = 1;

  loaderActualizar: boolean;

  loaderCargaDatos: boolean;


  formGrupos = new FormGroup({
    usuario: new FormControl<any>('', [Validators.required]),
    inicio: new FormControl<any>('', [Validators.required]),
    fin: new FormControl<any>('', [Validators.required]),

  })


  public UsuarioListaGuardar: Usuario = new Usuario();
  public ProveedorListaGuardar: Proveedor = new Proveedor();
  public CategoriaListaGuardar: Categoria = new Categoria();


  public UsuarioLista: PersonaUsuario[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private cajaService: CajaService,
  ) {
  }

  ngOnInit(): void {
    this.controlInicio();

  }
  public fechaNacimiento: any;
  public controlFecha: Boolean = false;

  public controlInicio() {

    this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(value => {
      this.UsuarioLista = value;


      var fecha = new Date(fechaActual.getFechaActual);
      var dias = 1; // Número de días a agregar
      fecha.setDate(fecha.getDate() + dias);
      this.formGrupos.setValue({
        usuario: 0,
        inicio: fecha,
        fin: fecha,

      })

      this.filtrarInfo();

    })






    if (idUniversal.getIdUniversal == 0) {
      this.botonParaGuardar = true;
      this.botonParaActualizar = false;

    } else {

      this.loaderCargaDatos = true;



      this.categoriaService.getCategoriaId(idUniversal.getIdUniversal).subscribe(value => {

        this.CategoriaListaGuardar.id = value.id;

        this.loaderCargaDatos = false;
      })

      this.botonParaGuardar = false;
      this.botonParaActualizar = true;

    }

  }


  public subotal?: any;
  public descuento?: any;
  public iva?: any;
  public  total?: any;

  public entrada?: any;
  public baja?: any;

  public apertura?: any;
  public cobrado?: any;
  public porCobrar?: any;
  public ganancia?: any;


  public filtrarInfo() {

    this.cajaService.getResumen(Object.values(this.formGrupos.getRawValue())[0], idEmpresa.getIdEmpresa, Object.values(this.formGrupos.getRawValue())[1], Object.values(this.formGrupos.getRawValue())[2]).subscribe(value => {
      console.info(value)
      this.subotal = value.subotal.toFixed(2);
      this.descuento = value.descuento.toFixed(2);
      this.iva = value.iva.toFixed(2);
      this.total = value.total.toFixed(2);
      this.entrada = value.entrada.toFixed(2);
      this.baja = value.baja.toFixed(2);
      this.apertura = value.apertura.toFixed(2);
      this.cobrado = value.cobrado.toFixed(2);
      this.porCobrar = value.porCobrar.toFixed(2);
      this.ganancia = value.ganancia.toFixed(2);

    })
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