import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  apiUrl = 'https://alpha.thehousemonk.com';

  constructor(
    private http: HttpClient,
    public appSettings: MainAppSetting
  ) {
  }

  getTicketStats(): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/stats/business-app`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  getTickets(
    skip,
    status,
    ticketBelongsTo,
    type,
    projects,
    priority,
    startDate,
    endDate,
    contactPoint,
    agent,
    asset): Observable<any> {
    console.log(asset);
    return this.http.get(`${this.appSettings.getApi()}/api/ticket?${status}&limit=10&sortBy=-createdAt&skip=${skip}&ticketBelongsTo=${ticketBelongsTo}&type=${type}&projects=${projects}&priority=${priority}&startDate=${startDate}&endDate=${endDate}&contactPoint=${contactPoint}&agent=${agent}&asset=${asset}`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  getTicketCategories(filterData): Observable<any> {


    return this.http.get(`${this.appSettings.getApi()}/api/category?belongsTo=${filterData.ticketBelongsTo}&${filterData.ticketBelongsTo.toLowerCase()}=${filterData.ticketBelongsToRefId}&status=active&status=inactive`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  createTicket(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/ticket`, data,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  updateTicket(data): Observable<any> {
    return this.http.put(`${this.appSettings.getApi()}/api/ticket/${data._id}`, data,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  getTicketById(ticketId): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/ticket/${ticketId}?populate=estimates&populate=assets&populate=contactPoint&populate=raisedBy&populate=agent&populate=itemDetails.product`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  getTicketComments(ticketId): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/ticket/${ticketId}/comments`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  createComment(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/comment`, data,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  searchMaterials(filterData): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/product-and-service?type=inventory&searchText=${filterData.searchText}&skip=${filterData.skip}&limit=10&status=active`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  searchAssert(data): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/asset/${data}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }
  
}
