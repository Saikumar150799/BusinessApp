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

  getTicketStats(filterData): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/stats/business-app?limit=${filterData.limit}&page=${filterData.page}`,
      this.appSettings.getHttpHeadesWithToken());
  }

  getTickets(
    page,
    searchText,
    status,
    ticketBelongsTo,
    type,
    projects,
    priority,
    startDate,
    endDate,
    contactPoint,
    agent,
    asset,
    ticketBelongsToRefId,
    categories,
    subCategories,
    createdBy,
    filterBy = '',
    showFutureTickets = false,
    sort = ['-createdAt']
    ): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/ticket/v2?${status}&limit=10&page=${page}&${ticketBelongsTo}${ticketBelongsToRefId ? '&ticketBelongsToRefId=' + ticketBelongsToRefId : ''}${type}&projects=${projects}&perRow=10&q=${searchText}&skip=0&sort=${sort}${priority}${startDate}${endDate}${agent}${contactPoint}${asset}${categories ? '&categories=' + categories : ''}${subCategories ? '&subCategories=' + subCategories : ''}${createdBy ? createdBy : ''}${filterBy}${showFutureTickets ? `&showFutureTickets=${showFutureTickets}`: ''}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  getTicketCategories(filterData): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/category?belongsTo=${filterData.ticketBelongsTo}&${filterData.ticketBelongsTo.toLowerCase()}=${filterData.ticketBelongsToRefId}&status=active&limit=${filterData.limit}&page=${filterData.page}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  getTicketCategoriesV2(filterData): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/category/v2?belongsTo=${filterData.ticketBelongsTo}&status=active&limit=${filterData.limit}&page=${filterData.page}`,
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

  updateTicketStatus(data): Observable<any> {
    return this.http.put(`${this.appSettings.getApi()}/api/ticket/${data.ticketId}/update-status`, data,
      this.appSettings.getHttpHeadesWithToken());
  }

  getTicketById(ticketId): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/ticket/${ticketId}?populate=estimates&populate=assets&populate=contactPoint&populate=contactPoints&populate=raisedBy&populate=agents&populate=itemDetails.product&populate=facility`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  getPointOfContacts(pocFilterData): Observable<any> {
    const ticketSubCategory = pocFilterData.ticketSubCategory !='' ? `&ticketSubCategory=${pocFilterData.ticketSubCategory}` : '';
    return this.http.get(`${this.appSettings.getApi()}/api/ticket/contact-point?ticketBelongsTo=${pocFilterData.ticketBelongsTo}&ticketBelongsToRefId=${pocFilterData.ticketBelongsToRefId}&ticketCategory=${pocFilterData.ticketCategory}${ticketSubCategory}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  getTicketComments(data: any): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/ticket/${data.ticket}/comments?ticketCommentType=${data.ticketCommentType}&limit=${Number.MAX_SAFE_INTEGER}&sort=createdAt`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  createComment(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/comment`, data,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  searchMaterials(filterData): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/product-and-service?type=inventory&searchText=${filterData.searchText}&page=${filterData.page}&limit=15&status=active`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  searchAssert(data): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/asset?limit=10&page=1&q=${data}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  getCheckListByTicketId(ticketId): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/ticket/${ticketId}/get-checklist?populate=checklist.checklistSections.checklistItems.files&populate=checklist.completionSection.files`,
    this.appSettings.getHttpHeadesWithToken()
  );
  }

  updateChecklistSection(data): Observable<any> {
    return this.http.put(`${this.appSettings.getApi()}/api/ticket/${data.ticketId}/checklistSection/update`, data,
    this.appSettings.getHttpHeadesWithToken()
  );
  }

  updateCheckList(ticketId,formData = {}): Observable<any>{
    return this.http.put(`${this.appSettings.getApi()}/api/ticket/${ticketId}/update/checklist`,formData,
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  sendChecklistReport(ticketId,userId): Observable<any>{
    return this.http.get(`${this.appSettings.getApi()}/api/ticket/${ticketId}/sendChecklistReport?userId=${userId}&populate=checklist.checklistSections.checklistItems.files&populate=checklist.completionSection.files`,
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  getAssets({limit, page, searchText, filterBy}): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/asset?limit=${limit}&page=${page}&q=${searchText}&status=active${filterBy}`,
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  getChecklist({page, limit, searchText}): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/checklist?checklistType=ticket&status=active&page=${page}&limit=${limit}&q=${searchText}`,
    this.appSettings.getHttpHeadesWithToken())
  }
}
