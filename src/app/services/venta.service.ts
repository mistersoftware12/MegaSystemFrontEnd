import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";;
import { VentaContenidoRequest, VentaEncabezadoRequest, VentaResponse } from '../models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }

  createVenta(data: VentaEncabezadoRequest): Observable<VentaEncabezadoRequest> {
    return this.http.post(environment.URL_APP + "/venta/registrarVenta", data, { headers: this.httpHeaders })
  }

  createContenidoVenta(data: VentaContenidoRequest, idVentaEncabezado: any): Observable<VentaContenidoRequest> {
    return this.http.post(environment.URL_APP + "/venta/registrarContenidoVenta/" + idVentaEncabezado, data, { headers: this.httpHeaders })
  }

  getAlVenta(idEmpresa: any, mes: any, anio: any): Observable<VentaResponse[]> {
    return this.http.get(this.urlEndPoint + "/venta/allVentas/" + idEmpresa + "/" + mes + "/" + anio, { headers: this.httpHeaders }).pipe(map(Response => Response as VentaResponse[]))
  }

}
