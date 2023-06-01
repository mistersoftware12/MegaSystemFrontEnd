import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";;
import { VentaContenidoRequest, VentaEncabezadoRequest, VentaResponse } from '../models/venta';
import { ContenidoCreditoClienteRequest } from '../models/credito';
import { Reporte1Response } from '../models/reporte';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }

  getByReporteCierreCaja(cedulaUsuario: any, fecha: any): Observable<Reporte1Response> {
    return this.http.get(this.urlEndPoint + "/reporte/cierredecaja/" + cedulaUsuario + "/" + fecha, { headers: this.httpHeaders }).pipe(map(Response => Response as Reporte1Response))
  }


}
