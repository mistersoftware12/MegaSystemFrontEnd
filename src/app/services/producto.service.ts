import { Injectable } from '@angular/core';
import { environment, idEmpresa } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";;
import { ProductoRequest, ProductoResponse, ProductoResponse1 } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }


  createProducto(data: ProductoRequest): Observable<ProductoRequest> {
    return this.http.post(environment.URL_APP + "/producto/registrarProducto", data, { headers: this.httpHeaders })
  }




  getAlProdducto(idEmpresa: any): Observable<ProductoResponse1[]> {
    return this.http.get(this.urlEndPoint + "/producto/allProductos/" + idEmpresa, { headers: this.httpHeaders }).pipe(map(Response => Response as ProductoResponse1[]))
  }

  getAlProdductoAguja(idEmpresa: any , aguja:any): Observable<ProductoResponse1[]> {
    return this.http.get(this.urlEndPoint + "/producto/allProductos/" + idEmpresa+"/"+aguja, { headers: this.httpHeaders }).pipe(map(Response => Response as ProductoResponse1[]))
  }


  getProductoId(id: any): Observable<ProductoResponse> {
    return this.http.get(environment.URL_APP + "/producto/producto/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as ProductoResponse))
  }

  getProductoCodigoBarra(codigoBarra: any): Observable<ProductoResponse> {
    return this.http.get(environment.URL_APP + "/producto/productoCodigo/" + idEmpresa.getIdEmpresa + "/" + codigoBarra, { headers: this.httpHeaders }).pipe(map(Response => Response as ProductoResponse))
  }

  putProducto(info: ProductoRequest): Observable<ProductoRequest> {
    return this.http.put(environment.URL_APP + "/producto/updateProducto", info, { headers: this.httpHeaders })
  }

}
