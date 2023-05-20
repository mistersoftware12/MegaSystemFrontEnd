
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sucursal } from 'src/app/models/sucursal';
import { EstadoFD } from 'src/app/models/estado';
import { cedula } from 'src/environments/environment';

import { MatTable } from '@angular/material/table';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { idUniversal } from 'src/environments/environment';
import { Proveedor } from 'src/app/models/persona';

export interface PeriodicElement {

  id?: any;
  idArticuloProveedor?: any;
  idArticulo?: any;
  idProveedor?: any;
  nombreProveedor?: any;
  nombreArticulo?: any;
  codigoBarra?: any;
  foto?: any;
  precioCompra?: any;
  costoUnitario?: any;
  iva?: any;
  costoTotal?: any;
  cantidad?: any;

}

const ELEMENT_DATA: PeriodicElement[] = [

];


@Component({
  selector: 'app-crearModificarUsuario.component',
  templateUrl: './crearModificarUsuario.component.html',
  styleUrls: ['./crearModificarUsuario.component.css'],


})

export class CrearModificarUsuarioComponent implements OnInit {

  public idCatalogo: any;
  public botonParaGuardar: Boolean = true;


  public controlInfoProveedor: Boolean = false;

  public dialogoEditarCantidadEstado: boolean;

  public numeroControl: number = 1;

  loaderActualizar: boolean;
  loaderActualizarTabla: boolean;
  loaderCargaDatos: boolean;


  base64Output: string;

  public controlArticulos: Boolean = false;
  public controlProductos: Boolean = false;



  //public ordenListaGuardar: OrdenPedido = new OrdenPedido();

  //public contenidoArticuloOrdenListaGuardar: ArticuloProveedorOrden = new ArticuloProveedorOrden();
  //public articuloProveedorLista: ArticuloProveedorOrden[] = [];
  //public almacenbodegaTallerLista: Bodega[] = [];


  public codigoBarra: any;




  //public articuloLista: Articulo[] = [];
  public estadoLista: EstadoFD[] = [{ id: 0, nombres: 'Principal', value: 'true' }, { id: 1, nombres: 'Almacen', value: 'false' }, { id: 2, nombres: 'Bodega', value: 'false' }, { id: 3, nombres: 'Taller', value: 'false' }];
  public estadoIva: EstadoFD[] = [{ id: 1, nombres: 'Si', value: true }, { id: 2, nombres: 'No', value: false }];


  public idProductoArticulo = [];
  public proveedorLista: Proveedor[] = [];


  //Desde Aqui;
  public datoSecuencia: any;
  public controlRequerimiente: Boolean = false;
  public precioTotal: any = 0;



  formGrupos = new FormGroup({
    fechaemision: new FormControl<Date>(null),
    requerimiento: new FormControl<number>(0, [Validators.required]),
    local: new FormControl<number>(1,),
    responsable: new FormControl<String>('', [Validators.required]),
  })



  formGrupoSecuencia = new FormGroup({
    secuencia1: new FormControl<String>('', [Validators.required]),

  })

  formGrupoIdCompra = new FormGroup({
    compra: new FormControl<Number>(0, [Validators.required]),
  })



  forGrupoArticulo = new FormGroup({
    articulo: new FormControl<any>('',),
    cantidad: new FormControl<any>(1, [Validators.required, Validators.pattern("[0-9]+")]),
    iva: new FormControl<Boolean>(null, [Validators.required]),
    costounitario: new FormControl<Number>(0, [Validators.required]),

  })




  formGrupoEditar = new FormGroup({
    nombre: new FormControl<String>('', [Validators.required]),
    cantidad: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
  })


  formGrupoProveedor = new FormGroup({
    proveedor: new FormControl<String>('', [Validators.required]),
    cedula: new FormControl<String>('',),
    telefono: new FormControl<String>('',),
    nombrecomercial: new FormControl<String>('',),


  })


  displayedColumns: string[] = ['id', 'nombre', 'logo', 'estado', 'documento'];
  dataSource: MatTableDataSource<Sucursal>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  displayedColumns1: string[] = ['codigo', 'codigobarra', 'nombre', 'cantidad', 'preciocostounitario', 'iva', 'estado', 'weight'];
  dataSource1 = [...ELEMENT_DATA];

  @ViewChild(MatTable) table: MatTable<PeriodicElement>;

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,


  ) {
  }

  ngOnInit(): void {
    this.controlInicio();
   
  }


  public controlInicio() {

    
    
    
    if (idUniversal.getIdUniversal == 0) {
      this.botonParaGuardar = true;
/*
      this.ordenReciboService.getSecuencia().subscribe(value => {

        this.formGrupoSecuencia.setValue({
          secuencia1: value.maximoDato,
        })
      })*/

    } else {

      /*
      this.loaderCargaDatos = true;

      this.ordenReciboService.getOrdenReciboDetallado(idUniversal.getIdUniversal).subscribe(value => {

        var quesirva = JSON.stringify(Object.values(value)[3])
        var coche = JSON.parse(quesirva);

        this.dataSource1 = coche;
        this.table.renderRows();


        this.precioTotal = value.totalPagar.toFixed(2);


        this.formGrupoSecuencia.setValue({
          secuencia1: value.secuencia,
        })

        this.formGrupoIdCompra.setValue({
          compra: value.id,
        })

        this.loaderCargaDatos = false;
      })

      this.botonParaGuardar = false;

*/
    }

  }

  public mostrarNuevo() {


    if (this.numeroControl == 3) {
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.numeroControl = 1;
    }

  }
  public botonCancelarRegistro() {
    this.router.navigate(['/panel/biblioteca/administracionOrdenRecibo']);
    idUniversal.setIdUniversal = 0;
  }
  vaciarFormulario() {

    this.controlInfoProveedor = false;
  }


  /*
  public listarLugares() {
    if (Object.values(this.formGrupos.getRawValue())[1] == 0) {
      this.controlRequerimiente = false;
    }

    if (Object.values(this.formGrupos.getRawValue())[1] == 1) {
      this.empresaService.getAlmacenAll().subscribe(value => {
      //  this.almacenbodegaTallerLista = value;
        this.controlRequerimiente = true;
      })
    }

    if (Object.values(this.formGrupos.getRawValue())[1] == 2) {
      this.empresaService.getBodegaAll().subscribe(value => {
        this.almacenbodegaTallerLista = value;
        this.controlRequerimiente = true;
      })
    }

    if (Object.values(this.formGrupos.getRawValue())[1] == 3) {
      this.empresaService.getTallerAll().subscribe(value => {
        this.almacenbodegaTallerLista = value;
        this.controlRequerimiente = true;
      })
    }


  }
  public cargaInformacionProveedor() {


    this.controlInfoProveedor = true;

    for (var i = 0; i < this.proveedorLista.length; i++) {

      if (this.proveedorLista[i].idProveedor == Object.values(this.formGrupoProveedor.getRawValue())[0]) {

        this.ordenListaGuardar.idProveedor = this.proveedorLista[i].idProveedor;

        this.formGrupoProveedor.setValue({
          proveedor: Object.values(this.formGrupoProveedor.getRawValue())[0],
          cedula: this.proveedorLista[i].cedula,
          telefono: this.proveedorLista[i].telefono,
          nombrecomercial: this.proveedorLista[i].nombreComercial,

        })


      }
    }

    this.listarArticulos();
  }
  articuloAgregar() {
    var precioCosto = 0;

    
    for (var i = 0; i < this.articuloLista.length; i++) {

      if (this.articuloLista[i].id == Object.values(this.forGrupoArticulo.getRawValue())[0]) {
        precioCosto = this.articuloLista[i].precioCosto;
      }
    }

    this.controlArticulos = true;
this.forGrupoArticulo.setValue({
  articulo: Object.values(this.forGrupoArticulo.getRawValue())[0],
  cantidad: 1,
  iva: false,
  costounitario: 0,

})

  }

  public precioCompra: Number = 0;
  public costoUnitario: Number = 0;
  public costoTotal: Number = 0;

  public agregarArticuloProducto() {

  this.precioTotal = 0;
  var contador = 0;

  this.articuloProveedorLista = [];
  this.articuloProveedorLista = this.dataSource1;

  var idArtPr = Number(Object.values(this.forGrupoArticulo.getRawValue())[0]);
  var cati = Number(Object.values(this.forGrupoArticulo.getRawValue())[1]);


  for (var i = 0; i < this.articuloProveedorLista.length; i++) {

    if (this.articuloProveedorLista[i].idArticulo == Object.values(this.forGrupoArticulo.getRawValue())[0]) {
      contador = 1;
    }

  }



  if (contador == 0) {
    var iva;
    this.precioCompra = Object.values(this.forGrupoArticulo.getRawValue())[3].toFixed(2);
    this.costoUnitario = Object.values(this.forGrupoArticulo.getRawValue())[3].toFixed(2);
    this.costoTotal = 10;
    var costoUni;

    if (Object.values(this.forGrupoArticulo.getRawValue())[2] == true) {

      iva = (Number(this.precioCompra) * Number(0.12)).toFixed(2)
      costoUni = (Number(this.costoUnitario) - Number(iva)).toFixed(2);

    } else {

      iva = 0.00;
      costoUni = this.costoUnitario;
    }

    this.costoTotal = Number(this.precioCompra) * Number(cati);

    this.loaderActualizarTabla = true;

    this.articuloService.getArticuloId(Object.values(this.forGrupoArticulo.getRawValue())[0]).subscribe(value1 => {

      this.dataSource1.push({ id: 0, idArticuloProveedor: idArtPr, idArticulo: value1.id, idProveedor: 0, nombreProveedor: "", nombreArticulo: value1.nombre, codigoBarra: value1.codigoBarra, foto: value1.foto, precioCompra: this.precioCompra, costoUnitario: costoUni, iva: iva, costoTotal: this.costoTotal, cantidad: cati });

      this.sumarTotal();

      this.table.renderRows();

      this.loaderActualizarTabla = false;
    })

  }



  this.forGrupoArticulo.setValue({
    articulo: "",
    cantidad: "0",
    iva: true,
    costounitario: 0,

  })

  this.sumarTotal();
  this.controlArticulos = false;


}


sumarTotal() {

  this.precioTotal = 0;
  this.articuloProveedorLista = [];
  this.articuloProveedorLista = this.dataSource1;
  for (var i = 0; i < this.articuloProveedorLista.length; i++) {
    this.precioTotal = Number(this.precioTotal) + Number(this.articuloProveedorLista[i].costoTotal);
  }

  this.precioTotal = this.precioTotal.toFixed(2);
}


removeData(codigb: any, id: any) {
  Swal.fire({
    title: 'Estas seguro?',
    text: "No podrás revertir esto.!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar !'
  }).then((result) => {
    if (result.isConfirmed) {
      this.dataSource1 = this.dataSource1.filter((item) => item.codigoBarra !== codigb);
      this.table.renderRows();

      if (id != 0) {
        this.idProductoArticulo.push(id);
      }

      this.sumarTotal();

    }


  })



}

  public guardarInformacion() {
  if (this.dataSource1.length != 0) {

    this.loaderActualizar = true;

    this.ordenListaGuardar.totalOrden = this.precioTotal;
    this.ordenListaGuardar.cedula = cedula.getCedula;

    if (Object.values(this.formGrupos.getRawValue())[1] == 0) {
      this.ordenListaGuardar.idAlmacenBodegaTaller = 1;
      this.contenidoArticuloOrdenListaGuardar.idAlmacenBodegaTaller = 1;
    } else {
      this.ordenListaGuardar.idAlmacenBodegaTaller = Object.values(this.formGrupos.getRawValue())[2];
      this.contenidoArticuloOrdenListaGuardar.idAlmacenBodegaTaller = Object.values(this.formGrupos.getRawValue())[2];
    }

    this.ordenListaGuardar.tipoEstructura = Object.values(this.formGrupos.getRawValue())[1];

    this.ordenListaGuardar.responsable = Object.values(this.formGrupos.getRawValue())[3];
    console.info(this.ordenListaGuardar);

    this.ordenReciboService.createOrdenRecibo(this.ordenListaGuardar).subscribe(value => {
      this._snackBar.open('Orden Recibo Creado', 'ACEPTAR');

      this.formGrupoIdCompra.setValue({
        compra: value.id,
      })

      this.guardarContenidoCatalogo();
      this.vaciarFormulario();
      this.loaderActualizar = false;
      this.dataSource1 = [];
      this.botonCancelarRegistro();

    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
      this.loaderActualizar = false;

    })
  } else {
    this._snackBar.open('Agregue al menos un artículo', 'ACEPTAR');
  }

}

  public guardarContenidoCatalogo() {

  this.articuloProveedorLista = [];
  this.articuloProveedorLista = this.dataSource1;
  this.contenidoArticuloOrdenListaGuardar.idOrdenRecibo = Object.values(this.formGrupoIdCompra.getRawValue())[0];


  for (var i = 0; i < this.articuloProveedorLista.length; i++) {

    this.contenidoArticuloOrdenListaGuardar.cantidad = this.articuloProveedorLista[i].cantidad;
    this.contenidoArticuloOrdenListaGuardar.costoUnitario = this.articuloProveedorLista[i].costoUnitario;
    this.contenidoArticuloOrdenListaGuardar.iva = this.articuloProveedorLista[i].iva;
    this.contenidoArticuloOrdenListaGuardar.costoTotal = this.articuloProveedorLista[i].costoTotal.toFixed(2);
    this.contenidoArticuloOrdenListaGuardar.idArticulo = this.articuloProveedorLista[i].idArticulo;
    this.contenidoArticuloOrdenListaGuardar.id = this.articuloProveedorLista[i].id;
    this.contenidoArticuloOrdenListaGuardar.idArticuloProveedor = this.articuloProveedorLista[i].idArticuloProveedor;


    console.info(this.contenidoArticuloOrdenListaGuardar)
    if (this.articuloProveedorLista[i].id == 0) {
      this.ordenReciboService.createContenidoOrdenRecibo(this.contenidoArticuloOrdenListaGuardar).subscribe(value => {
      })
    } else {

      this.ordenReciboService.putContenidoOrdenRecibo(this.contenidoArticuloOrdenListaGuardar).subscribe(value => {
      })
    }

  }

}

////Editar



abrirEditarPrecio(nombre: any, codigoBarra: any, cantidad: any) {

  this.codigoBarra = codigoBarra;

  this.formGrupoEditar.setValue({
    nombre: nombre,
    cantidad: cantidad,
  })

  this.dialogoEditarCantidadEstado = true;

}


  public guardarEditar() {


  this.articuloProveedorLista = [];
  this.articuloProveedorLista = this.dataSource1;


  var cati = Number(Object.values(this.formGrupoEditar.getRawValue())[1]);

  for (var i = 0; i < this.articuloProveedorLista.length; i++) {

    if (this.articuloProveedorLista[i].codigoBarra == this.codigoBarra) {

      this.articuloProveedorLista[i].cantidad = cati;
      this.articuloProveedorLista[i].costoTotal = this.articuloProveedorLista[i].precioCompra * this.articuloProveedorLista[i].cantidad;
    }

  }

  this.sumarTotal();

  this.table.renderRows();
}

*/

}