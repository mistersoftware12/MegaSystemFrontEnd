import { Injectable } from '@angular/core';
import { environment, idEmpresa } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";;
import { ContenidoProduccion, ProductoRequest, ProductoResponse, ProductoResponse1 } from '../models/producto';
import { ProduccionRequest } from '../models/produccion';


@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }

  createProducto(data: ProduccionRequest): Observable<ProduccionRequest> {
    return this.http.post(environment.URL_APP + "/produccion/registrarProduccion", data, { headers: this.httpHeaders })
  }

  getAlProdducto(idEmpresa: any): Observable<ProduccionRequest[]> {
    return this.http.get(this.urlEndPoint + "/produccion/allProduccion/" + idEmpresa, { headers: this.httpHeaders }).pipe(map(Response => Response as ProduccionRequest[]))
  }

  getAlProdductoAguja(idEmpresa: any , aguja:any): Observable<ProduccionRequest[]> {
    return this.http.get(this.urlEndPoint + "/produccion/allProduccion/" + idEmpresa+"/"+aguja, { headers: this.httpHeaders }).pipe(map(Response => Response as ProduccionRequest[]))
  }

  getProduccionId(id: any): Observable<ProduccionRequest> {
    return this.http.get(environment.URL_APP + "/produccion/produccion/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as ProduccionRequest))
  }

  getProductoCodigoBarra(codigoBarra: any): Observable<ProduccionRequest> {

    return this.http.get(environment.URL_APP + "/produccion/produccionBarra/" + idEmpresa.getIdEmpresa+ "/" + codigoBarra, { headers: this.httpHeaders }).pipe(map(Response => Response as ProduccionRequest))
  }

  putProduccion(info: ProduccionRequest): Observable<ProduccionRequest> {
    return this.http.put(environment.URL_APP + "/produccion/updateProduccion", info, { headers: this.httpHeaders })
  }

  ////////////////////Contenido

  createContenidoProducto(data: ContenidoProduccion): Observable<ContenidoProduccion> {
    return this.http.post(environment.URL_APP + "/produccion/registrarContenidoProduccion", data, { headers: this.httpHeaders })
  }

  putContendidoProduccion(info: ContenidoProduccion): Observable<ContenidoProduccion> {
    return this.http.put(environment.URL_APP + "/produccion/updateContenidoProduccion", info, { headers: this.httpHeaders })
  }


}
