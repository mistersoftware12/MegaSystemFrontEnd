import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { DatePipe } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UsuarioService } from 'src/app/services/usuario.service';
import { Cliente } from 'src/app/models/cliente';
import { Usuario } from 'src/app/models/persona';
import { Sucursal } from 'src/app/models/sucursal';
import { cedula, fechaActual, idUniversal } from 'src/environments/environment';
import { idEmpresa } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
// @ts-ignore
import { default as _rollupMoment, Moment } from 'moment';
import { VentaService } from 'src/app/services/venta.service';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-listar-venta.component',
  templateUrl: './listar-venta.component.html',
  styleUrls: ['./listar-venta.component.css'],

  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class ListarVentaComponent implements OnInit {

  loaderActualizar: boolean;

  public UsuarioLista: Usuario[] = [];

  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'telefono', 'correo', 'pago', 'vendedor', 'total', 'documento'];
  dataSource: MatTableDataSource<Cliente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private ventaService: VentaService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {

    let text = fechaActual.getFechaActual;
    const myArray = text.split("-");

    this.listarInformacion(myArray[1], myArray[0]);
  }

  date = new FormControl(moment());

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    // this.anioInforme = normalizedMonthAndYear.year();
    //this.mesInforme = String(normalizedMonthAndYear.month() + 1);
    this.listarInformacion((normalizedMonthAndYear.month() + 1), normalizedMonthAndYear.year());
    datepicker.close();
  }

  convertirMes(mes: any, anio: any) {


    let mesconve;

    if (mes == "1" || mes == "01") {
      mesconve = "Enero";
    } else if (mes == "2" || mes == "02") {
      mesconve = "Febrero";
    } else if (mes == "3" || mes == "03") {
      mesconve = "Marzo";
    } else if (mes == "4" || mes == "04") {
      mesconve = "Abril";
    } else if (mes == "5" || mes == "05") {
      mesconve = "Mayo";
    } else if (mes == "6" || mes == "06") {
      mesconve = "Junio";
    } else if (mes == "7" || mes == "07") {
      mesconve = "Julio";
    } else if (mes == "8" || mes == "08") {
      mesconve = "Agosto";
    } else if (mes == "9" || mes == "09") {
      mesconve = "Septiembre";
    } else if (mes == "10") {
      mesconve = "Octubre";
    } else if (mes == "11") {
      mesconve = "Noviembre";
    } else if (mes == "12") {
      mesconve = "Diciembre";
    }
  }

  public mostrarNuevo() {
    this.router.navigate(['/panel/biblioteca/creaModificarVenta']);
  }

  public mostrarNuevoIngreso(id: any) {
    idUniversal.setIdUniversal = id;
    this.router.navigate(['/panel/biblioteca/creaModificarIngresoProducto']);
  }

  public mostrarNuevoBaja(id: any) {
    idUniversal.setIdUniversal = id;
    this.router.navigate(['/panel/biblioteca/creaModificarBajaProducto']);
  }

  //LISTAR

  public listarInformacion(mes: any, anio: any) {
    this.loaderActualizar = true;
    this.ventaService.getAlVenta(idEmpresa.getIdEmpresa, mes, anio).subscribe(value => {
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

  editarInformacion(id: any) {
    idUniversal.setIdUniversal = id;

    this.router.navigate(['/panel/biblioteca/creaModificarProducto']);
  }

  //Exportaciones de documento

  exportToExcel(): void {
    let element = document.getElementById('table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, 'Lista de Ventas.xlsx');
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
            { text: 'CLIENTES REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Usuarios registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {
              table: {
                headerRows: 1,
                widths: ['7%', '10%', '19%', '19%', '11%', '23%', '10%'],
                body: [
                  ['ID', 'CEDULA', 'NOMBRES', 'APELLIDOS', 'ROL', 'CORREO', 'TELEFONO'],
                  [value.map(function (item) {
                    return { text: item.id + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.cedula + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.nombres + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.apellidos + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.nombreRol + '', fontSize: 11 }
                  }),

                  value.map(function (item) {
                    return { text: item.email + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.telefono + '', fontSize: 11 }
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