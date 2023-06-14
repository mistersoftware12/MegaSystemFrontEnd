
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cedula, fechaActual, idEmpresa } from 'src/environments/environment';


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
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/models/cliente';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CajaContenidoResponse, Reporte1Request } from 'src/app/models/caja';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-resumenGeneral.component',
  templateUrl: './resumenGeneral.component.html',
  styleUrls: ['./resumenGeneral.component.css'],


})

export class ResumenGeneralComponent implements OnInit {


  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'telefono', 'documento', 'categoria', 'proveedor'];
  dataSource: MatTableDataSource<Cliente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  public botonParaGuardar: Boolean = false;
  botonParaActualizar: Boolean = false;


  public controlInfoProveedor: Boolean = false;


  public numeroControl: number = 1;

  loaderActualizar: boolean;

  loaderCargaDatos: boolean;

  public dialogoEditarPrecioProveedor: boolean;




  formGrupos = new FormGroup({
    usuario: new FormControl<any>('', [Validators.required]),
    inicio: new FormControl<any>('', [Validators.required]),
    fin: new FormControl<any>('', [Validators.required]),

  })


  public UsuarioListaGuardar: Usuario = new Usuario();
  public ProveedorListaGuardar: Proveedor = new Proveedor();
  public CategoriaListaGuardar: Categoria = new Categoria();


  public fechaAactual: any;
  public fechaControl: any;


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
    this.filtrarResumenGeneralInfo();
    this.controlInicio();
    this.fechas();

  }


  fechas() {
    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    var hoy2: String = String(fecha.getDate() + 1);
    var mesActual: String = String(fecha.getMonth() + 1);

    if (hoy2.length == 1) {
      hoy2 = "0" + hoy2;
    }

    if (mesActual.length == 1) {
      mesActual = "0" + mesActual;
    }


    this.fechaAactual = String(añoActual + "-" + mesActual + "-" + hoy2);

    this.fechaControl = "2023-06-02";


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
        inicio: "",
        fin: "",

      })

      //this.filtrarInfo();

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }


  public subotal?: any;
  public descuento?: any;
  public iva?: any;
  public total?: any;

  public entrada?: any;
  public baja?: any;

  public apertura?: any;
  public cobrado?: any;
  public porCobrar?: any;
  public ganancia?: any;


  public buscaLista: Reporte1Request = new Reporte1Request();

  public visibilidad: Boolean = false;


  public filtrarInfo() {


    this.buscaLista.idEmpresa = idEmpresa.getIdEmpresa;
    this.buscaLista.idUsuario = Object.values(this.formGrupos.getRawValue())[0];
    this.buscaLista.fechaInicio = Object.values(this.formGrupos.getRawValue())[1];
    this.buscaLista.fechaFin = Object.values(this.formGrupos.getRawValue())[2];

    this.cajaService.createResumen(this.buscaLista).subscribe(value => {
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

      this.visibilidad = true;
    })
  }


  public productosTotal?: any;
  public stockTotal?: any;
  public compraEstimada?: any;
  public ventaEstimada?: any;
  public gananciaEstimada?: any;

  public filtrarResumenGeneralInfo() {

    this.cajaService.getResumenGeneralId(idEmpresa.getIdEmpresa).subscribe(value => {

    
      this.productosTotal= value.productosTotal;
      this.stockTotal=value.stockTotal;
      this.compraEstimada=value.compraEstimada.toFixed(2);
      this.ventaEstimada=value.ventaEstimada.toFixed(2);
      this.gananciaEstimada=value.gananciaEstimada.toFixed(2);
  
    })
  }

  public botonCancelarRegistro() {
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


  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        // @ts-ignore
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }


  public listaContenidoInfo: CajaContenidoResponse[] = [];
  public fechaInicio: any;
  public fechaFin: any;

  abrirDialogo(numero: any) {

    this.buscaLista.numero = numero;
    this.buscaLista.idEmpresa = idEmpresa.getIdEmpresa;
    this.buscaLista.idUsuario = Object.values(this.formGrupos.getRawValue())[0];
    this.buscaLista.fechaInicio = Object.values(this.formGrupos.getRawValue())[1];
    this.buscaLista.fechaFin = Object.values(this.formGrupos.getRawValue())[2];

    this.cajaService.createResumenVentas(this.buscaLista).subscribe(value => {
      this.fechaInicio = Object.values(value)[3];
      this.fechaFin = Object.values(value)[4];

      var quesirva = JSON.stringify(Object.values(value)[0])
      var coche = JSON.parse(quesirva);
      this.listaContenidoInfo = coche;
      if (numero == 1) {
        this.generatePDF()
      }

      if (numero == 2) {
        this.generatePDFEntrada("ENTRADAS REGISTRADAS")
      }

      if (numero == 3) {
        this.generatePDFBaja("BAJA REGISTRADAS")
      }

      if (numero == 4) {
        this.generatePDFCobro("COBRO CAJA")
      }

    })

  }


  generatePDF() {
    this.loaderActualizar = true
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();

    this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(value => {

      this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(async valueb => {

        const pdfDefinition: any = {

          footer: function (currentPage, pageCount) { return '.   Pagina ' + currentPage.toString() + ' de ' + pageCount; },
          header: function (currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element

            /*
            return [
              { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
              { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            ]*/
          },


          content: [
            { image: await this.getBase64ImageFromURL('assets/images/kadapaLogo.png'), width: 100 },
            {
              text: '_________________________________________________________________________________________',
              alignment: 'center'
            },
            // @ts-ignore
            { text: pipe.transform(dia, ' d  MMMM  y'), alignment: 'right' },
            { text: 'VENTAS REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Usuarios registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {

              layout: 'noBorders',
              table: {
                widths: ['50%', '50%'],
                body: [
                  [{
                    text: [
                      { text: 'DESDE: ', bold: true },
                      this.fechaInicio,
                    ]
                  }, {
                    text: [
                      { text: 'HASTA: ', bold: true },
                      this.fechaFin,
                    ]
                  }],

                ]
              }
            },
            { text: '    ' },

            {
              table: {
                headerRows: 1,
                widths: ['100%',],
                body: [
                  [
                    {
                      layout: 'noBorders',
                      table: {
                        widths: ['10%', '8%', '17%', '23%', '8%', '8%', '8%', '8%', '10%'],
                        body: [
                          [{ text: 'SECUENCIA', bold: true, alignment: 'center' }, { text: 'FECHA', bold: true, alignment: 'center' }, { text: 'USUARIO', bold: true, alignment: 'center' }, { text: 'PRODUCTO', bold: true, alignment: 'center' }, { text: 'CANT', bold: true, alignment: 'center' }, { text: 'P. UNI', bold: true, alignment: 'center' }, { text: 'P. IVA', bold: true, alignment: 'center' }, { text: 'TOTAL', bold: true, alignment: 'center' }, { text: 'GANANCIA', bold: true, alignment: 'center' }],
                        ]
                      }
                    }],
                  [
                    this.listaContenidoInfo.map(function (item) {
                      return {
                        layout: 'noBorders',

                        table: {
                          widths: ['10%', '8%', '17%', '23%', '8%', '8%', '8%', '8%', '8%'],
                          body: [
                            [

                              { text: '' + item.secuencia, fontSize: 10, alignment: 'center' },
                              { text: '' + item.fecha, fontSize: 10, alignment: 'center' },
                              { text: '' + item.nombreUsuario, fontSize: 10, alignment: 'center' },
                              { text: '' + item.nombreProducto, fontSize: 10, alignment: 'center' },
                              { text: '' + item.cantidad, fontSize: 10, alignment: 'center' },
                              { text: '' + item.precioUnitario.toFixed(2), fontSize: 10, alignment: 'center' },
                              { text: '' + item.precioIva.toFixed(2), fontSize: 10, alignment: 'center' },
                              { text: '' + item.total.toFixed(2), fontSize: 10, alignment: 'center' },
                              { text: '' + item.ganancia.toFixed(2), fontSize: 10, alignment: 'center', bold: true, },

                            ],

                          ]
                        }


                      }
                    }),



                  ],

                ]
              }

            },
            { text: '    ' },
            { text: '    ' },


            {
              table: {
                headerRows: 1,
                widths: ['100%'],
                heights: 20,
                body: [
                  ['USUARIO/A: ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().nombres + ' ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().apellidos],

                ]
              },
            },

          ],

          pageOrientation: 'landscape',
        }


        this.loaderActualizar = false
        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
      })
    })
  }


  generatePDFEntrada(titulo: any) {
    this.loaderActualizar = true
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();

    this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(value => {

      this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(async valueb => {

        const pdfDefinition: any = {

          footer: function (currentPage, pageCount) { return '.   Pagina ' + currentPage.toString() + ' de ' + pageCount; },
          header: function (currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element

            /*
            return [
              { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
              { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            ]*/
          },


          content: [
            { image: await this.getBase64ImageFromURL('assets/images/kadapaLogo.png'), width: 100 },
            {
              text: '_________________________________________________________________________________________',
              alignment: 'center'
            },
            // @ts-ignore
            { text: pipe.transform(dia, ' d  MMMM  y'), alignment: 'right' },
            { text: titulo, fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Usuarios registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {

              layout: 'noBorders',
              table: {
                widths: ['50%', '50%'],
                body: [
                  [{
                    text: [
                      { text: 'DESDE: ', bold: true },
                      this.fechaInicio,
                    ]
                  }, {
                    text: [
                      { text: 'HASTA: ', bold: true },
                      this.fechaFin,
                    ]
                  }],

                ]
              }
            },
            { text: '    ' },

            {
              table: {
                headerRows: 1,
                widths: ['100%',],
                body: [
                  [
                    {
                      layout: 'noBorders',
                      table: {
                        widths: ['10%', '19%', '33%', '10%', '10%', '10%'],
                        body: [
                          [{ text: 'FECHA', bold: true, alignment: 'center' }, { text: 'USUARIO', bold: true, alignment: 'center' }, { text: 'NOMBRE', bold: true, alignment: 'center' }, { text: 'CANT.', bold: true, alignment: 'center' }, { text: 'P. UNI', bold: true, alignment: 'center' }, { text: 'P. TOTAL', bold: true, alignment: 'center' }],
                        ]
                      }
                    }],
                  [
                    this.listaContenidoInfo.map(function (item) {
                      return {
                        layout: 'noBorders',

                        table: {
                          widths: ['10%', '19%', '33%', '10%', '10%', '10%'],
                          body: [
                            [

                              { text: '' + item.fecha, fontSize: 10, alignment: 'center' },
                              { text: '' + item.nombreUsuario, fontSize: 10, alignment: 'center' },
                              { text: '' + item.nombreProducto, fontSize: 10, alignment: 'center' },
                              { text: '' + item.cantidad, fontSize: 10, alignment: 'center' },
                              { text: '' + item.precioUnitario.toFixed(2), fontSize: 10, alignment: 'center' },
                              { text: '' + item.total.toFixed(2), fontSize: 10, alignment: 'center' },
                            ],

                          ]
                        }


                      }
                    }),



                  ],

                ]
              }

            },
            { text: '    ' },
            { text: '    ' },


            {
              table: {
                headerRows: 1,
                widths: ['100%'],
                heights: 20,
                body: [
                  ['USUARIO/A: ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().nombres + ' ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().apellidos],

                ]
              },
            },

          ],

          pageOrientation: 'landscape',
        }


        this.loaderActualizar = false
        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
      })
    })
  }

  generatePDFBaja(titulo: any) {
    this.loaderActualizar = true
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();

    this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(value => {

      this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(async valueb => {

        const pdfDefinition: any = {

          footer: function (currentPage, pageCount) { return '.   Pagina ' + currentPage.toString() + ' de ' + pageCount; },
          header: function (currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element

            /*
            return [
              { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
              { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            ]*/
          },


          content: [
            { image: await this.getBase64ImageFromURL('assets/images/kadapaLogo.png'), width: 100 },
            {
              text: '_________________________________________________________________________________________',
              alignment: 'center'
            },
            // @ts-ignore
            { text: pipe.transform(dia, ' d  MMMM  y'), alignment: 'right' },
            { text: titulo, fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Usuarios registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {

              layout: 'noBorders',
              table: {
                widths: ['50%', '50%'],
                body: [
                  [{
                    text: [
                      { text: 'DESDE: ', bold: true },
                      this.fechaInicio,
                    ]
                  }, {
                    text: [
                      { text: 'HASTA: ', bold: true },
                      this.fechaFin,
                    ]
                  }],

                ]
              }
            },
            { text: '    ' },

            {
              table: {
                headerRows: 1,
                widths: ['100%',],
                body: [
                  [
                    {
                      layout: 'noBorders',
                      table: {
                        widths: ['10%', '17%', '23%', '23%', '8%', '8%', '8%'],
                        body: [
                          [{ text: 'FECHA', bold: true, alignment: 'center' }, { text: 'USUARIO', bold: true, alignment: 'center' }, { text: 'NOMBRE', bold: true, alignment: 'center' }, { text: 'OBSERVACIÓN', bold: true, alignment: 'center' }, { text: 'CANT.', bold: true, alignment: 'center' }, { text: 'P. UNI', bold: true, alignment: 'center' }, { text: 'P. TOTAL', bold: true, alignment: 'center' }],
                        ]
                      }
                    }],
                  [
                    this.listaContenidoInfo.map(function (item) {
                      return {
                        layout: 'noBorders',

                        table: {
                          widths: ['10%', '17%', '23%', '23%', '8%', '8%', '8%'],
                          body: [
                            [

                              { text: '' + item.fecha, fontSize: 10, alignment: 'center' },
                              { text: '' + item.nombreUsuario, fontSize: 10, alignment: 'center' },
                              { text: '' + item.nombreProducto, fontSize: 10, alignment: 'center' },
                              { text: '' + item.secuencia, fontSize: 10, alignment: 'center' },
                              { text: '' + item.cantidad, fontSize: 10, alignment: 'center' },
                              { text: '' + item.precioUnitario.toFixed(2), fontSize: 10, alignment: 'center' },
                              { text: '' + item.total.toFixed(2), fontSize: 10, alignment: 'center' },
                            ],

                          ]
                        }


                      }
                    }),



                  ],

                ]
              }

            },
            { text: '    ' },
            { text: '    ' },


            {
              table: {
                headerRows: 1,
                widths: ['100%'],
                heights: 20,
                body: [
                  ['USUARIO/A: ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().nombres + ' ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().apellidos],

                ]
              },
            },

          ],

          pageOrientation: 'landscape',
        }


        this.loaderActualizar = false
        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
      })
    })
  }

  generatePDFCobro(titulo: any) {
    this.loaderActualizar = true
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();

    this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(value => {

      this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(async valueb => {

        const pdfDefinition: any = {

          footer: function (currentPage, pageCount) { return '.   Pagina ' + currentPage.toString() + ' de ' + pageCount; },
          header: function (currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element

            /*
            return [
              { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
              { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            ]*/
          },


          content: [
            { image: await this.getBase64ImageFromURL('assets/images/kadapaLogo.png'), width: 100 },
            {
              text: '_________________________________________________________________________________________',
              alignment: 'center'
            },
            // @ts-ignore
            { text: pipe.transform(dia, ' d  MMMM  y'), alignment: 'right' },
            { text: titulo, fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Usuarios registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {

              layout: 'noBorders',
              table: {
                widths: ['50%', '50%'],
                body: [
                  [{
                    text: [
                      { text: 'DESDE: ', bold: true },
                      this.fechaInicio,
                    ]
                  }, {
                    text: [
                      { text: 'HASTA: ', bold: true },
                      this.fechaFin,
                    ]
                  }],

                ]
              }
            },
            { text: '    ' },

            {
              table: {
                headerRows: 1,
                widths: ['100%',],
                body: [
                  [
                    {
                      layout: 'noBorders',
                      table: {
                        widths: ['10%', '13%', '13%', '30%', '12%', '12%', '12%'],
                        body: [
                          [{ text: 'ESTADO', bold: true, alignment: 'center' }, { text: 'F. CAJA', bold: true, alignment: 'center' }, { text: 'F. COBRO', bold: true, alignment: 'center' }, { text: 'USUARIO', bold: true, alignment: 'center' }, { text: 'S. APERTURA', bold: true, alignment: 'center' }, { text: 'S. VENTA', bold: true, alignment: 'center' }, { text: 'EFECTIVO', bold: true, alignment: 'center' }],
                        ]
                      }
                    }],
                  [
                    this.listaContenidoInfo.map(function (item) {
                      return {
                        layout: 'noBorders',

                        table: {
                          widths: ['10%', '13%', '13%', '30%', '12%', '12%', '12%'],
                          body: [
                            [
                              { text: 'Cobrado', fontSize: 10, alignment: 'center' },
                              { text: '' + item.fecha, fontSize: 10, alignment: 'center' },
                              { text: '' + item.fechaCobro, fontSize: 10, alignment: 'center' },
                              { text: '' + item.nombreUsuario, fontSize: 10, alignment: 'center' },
                              { text: '' + item.saldoApertura.toFixed(2), fontSize: 10, alignment: 'center' },
                              { text: '' + item.totalVenta.toFixed(2), fontSize: 10, alignment: 'center' },
                              { text: '' + item.total.toFixed(2), fontSize: 10, alignment: 'center', bold: true },

                            ],

                          ]
                        }


                      }
                    }),



                  ],

                ]
              }

            },
            { text: '    ' },
            { text: '    ' },


            {
              table: {
                headerRows: 1,
                widths: ['100%'],
                heights: 20,
                body: [
                  ['USUARIO/A: ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().nombres + ' ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().apellidos],

                ]
              },
            },

          ],

          pageOrientation: 'landscape',
        }


        this.loaderActualizar = false
        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
      })
    })
  }

}