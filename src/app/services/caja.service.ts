import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";;
import { VentaResponse } from '../models/venta';
import { ContenidoCreditoClienteRequest } from '../models/credito';
import { InformacionBasica } from '../models/extras';
import { CajaContenidoResponse, CajaRequest, CajaResponse, CajaResponse1, CierreCaja, Reporte1Request } from '../models/caja';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }

  getApertura(cedulaUsuario: any, fecha: any): Observable<InformacionBasica> {
    return this.http.get(this.urlEndPoint + "/caja/contarApertura/" + cedulaUsuario + "/" + fecha, { headers: this.httpHeaders }).pipe(map(Response => Response as InformacionBasica))
  }

  getCajaNoCobrado(idEmpresa: any): Observable<CajaResponse[]> {
    return this.http.get(this.urlEndPoint + "/caja/allCajaNoCobrado/" + idEmpresa, { headers: this.httpHeaders }).pipe(map(Response => Response as CajaResponse[]))
  }

  createApertura(data: CajaRequest): Observable<CajaRequest> {
    console.info(data)
    return this.http.post(environment.URL_APP + "/caja/registrarAperturaCaja", data, { headers: this.httpHeaders })
  }


  createCierreCaja(data: CierreCaja): Observable<CierreCaja> {
    console.info(data)
    return this.http.post(environment.URL_APP + "/caja/registrarCierreCaja", data, { headers: this.httpHeaders })
  }

  createCobroCaja(data: CajaRequest): Observable<CajaRequest> {
    console.info(data)
    return this.http.post(environment.URL_APP + "/caja/registrarCobroCaja", data, { headers: this.httpHeaders })
  }

  getResumen(idUsuario: any, idEmpresa: any, fechInicio: any, fechaFin: any): Observable<CajaResponse1> {
    return this.http.get(this.urlEndPoint + "/caja/resumen/" + idUsuario + "/" + idEmpresa + "/" + fechInicio + "/" + fechaFin, { headers: this.httpHeaders }).pipe(map(Response => Response as CajaResponse1))
  }

  createResumen(data: Reporte1Request): Observable<Reporte1Request> {
    return this.http.post(environment.URL_APP + "/caja/consultaResumen1", data, { headers: this.httpHeaders })
  }

  createResumenVentas(data: CajaContenidoResponse): Observable<CajaContenidoResponse> {
    return this.http.post(environment.URL_APP + "/caja/reporteVenta1", data, { headers: this.httpHeaders })
  }


}
