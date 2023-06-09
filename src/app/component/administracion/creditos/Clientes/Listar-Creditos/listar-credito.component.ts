import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { DatePipe } from "@angular/common";
import { UsuarioService } from 'src/app/services/usuario.service';
import { Cliente } from 'src/app/models/cliente';
import { cedula, fechaActual, idUniversal } from 'src/environments/environment';
import { idEmpresa } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CreditoClienteService } from 'src/app/services/credito.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContenidoCreditoClienteRequest } from 'src/app/models/credito';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-listar-credito.component',
  templateUrl: './listar-credito.component.html',
  styleUrls: ['./listar-credito.component.css'],
})

export class ListarCreditosComponent implements OnInit {

  loaderActualizar: boolean;

  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellidos', 'telefono', 'usuario', 'nacimiento', 'correo', 'documento'];
  dataSource: MatTableDataSource<Cliente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dialogoEditarPrecioProveedor: boolean;

  formGroupPrecioProveedor = new FormGroup({
    proveedor: new FormControl<any>('', [Validators.required]),
    precio: new FormControl<any>('', [Validators.required, Validators.max(500)]),
  })


  public pagoListaGuardar: ContenidoCreditoClienteRequest = new ContenidoCreditoClienteRequest();

  constructor(
    private usuarioService: UsuarioService,
    private _snackBar: MatSnackBar,
    private creditoClienteService: CreditoClienteService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.listarInformacion();

  }

  public mostrarNuevo() {
    this.router.navigate(['/panel/biblioteca/creaModificarCliente']);
  }


  //LISTAR

  public listarInformacion() {
    this.loaderActualizar = true;
    this.creditoClienteService.getAlCresdito(idEmpresa.getIdEmpresa, false).subscribe(value => {
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loaderActualizar = false;
    })


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }


  ////Editar


  abrirDialogo(idCredito: any, totalPendiente: any) {

    this.pagoListaGuardar.idCreditoCliente = idCredito;
    this.dialogoEditarPrecioProveedor = true;

    this.formGroupPrecioProveedor.setValue({
      proveedor: totalPendiente.toFixed(2),
      precio: '',
    })


  }


  guardarEditar() {
    
    this.pagoListaGuardar.cedulaUsuario = cedula.getCedula;
    this.pagoListaGuardar.fechaPago = fechaActual.getFechaActual;
    this.pagoListaGuardar.valor = Object.values(this.formGroupPrecioProveedor.getRawValue())[1];

    this.creditoClienteService.createPago(this.pagoListaGuardar).subscribe(value => {
      this._snackBar.open('Precio Modidicado', 'ACEPTAR');


      this.dialogoEditarPrecioProveedor = false;

      this.listarInformacion();


    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      //this.loaderGuardar=false
    })



  }


  //Exportaciones de documento

  exportToExcel(): void {
    let element = document.getElementById('table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');
    XLSX.writeFile(book, 'Lista de Creditos.xlsx');
  }


  //Generar PDF
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



  
  generatePDF() {
    this.loaderActualizar = true
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();

    this.creditoClienteService.getAlCresdito(idEmpresa.getIdEmpresa, false).subscribe(value => {

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
            { text: 'CREDITOS PENDIENTES', fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Usuarios registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {
              table: {
                headerRows: 1,
                widths: ['7%', '10%', '19%', '19%', '11%', '23%', '10%'],
                body: [
                  ['ID', 'VENTA', 'CÉDULA', 'CLIENTE', 'FECHA', 'TOTAL', 'PENDIENTE'],
                  [value.map(function (item) {
                    return { text: item.id + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.secuencia + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.cedulaCliente + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.nombreCliente + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.fechaEmision + '', fontSize: 11 }
                  }),

                  value.map(function (item) {
                    return { text: item.total + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.total + '', fontSize: 11 }
                  })
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