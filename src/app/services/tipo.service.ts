import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";;
import { InformacionBasica } from '../models/extras';

@Injectable({
  providedIn: 'root'
})
export class TipoService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }

  
  getAllTipoPago(): Observable<InformacionBasica[]> {
    return this.http.get(this.urlEndPoint + "/tipo/allTipoPagoVenta" , { headers: this.httpHeaders }).pipe(map(Response => Response as InformacionBasica[]))
  }


}
