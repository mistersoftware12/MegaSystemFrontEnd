import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";;
import { VentaResponse } from '../models/venta';
import { ContenidoCreditoClienteRequest } from '../models/credito';

@Injectable({
  providedIn: 'root'
})
export class CreditoClienteService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }

  getAlCresdito(idEmpresa: any, estado: any): Observable<VentaResponse[]> {
    return this.http.get(this.urlEndPoint + "/creditocliente/allCreditoCliente/" + idEmpresa + "/" + estado, { headers: this.httpHeaders }).pipe(map(Response => Response as VentaResponse[]))
  }

  createPago(data: ContenidoCreditoClienteRequest): Observable<ContenidoCreditoClienteRequest> {
    return this.http.post(environment.URL_APP + "/creditocliente/registrarPagoCredito", data, { headers: this.httpHeaders })
  }


}
