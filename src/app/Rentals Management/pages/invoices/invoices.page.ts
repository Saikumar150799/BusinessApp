import { Component, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { SignaturePadComponent } from '../../components/signature-pad/signature-pad.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackComponent } from '../../modals/feedback/feedback.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit {
  public dueInvoices: Array<any> = [];
  public paidInvoices: Array<any> = [];
  public partialInvoices: Array<any> = [];
  public invoices: any;
  public emptyInvoice: boolean = false;
  public paramData: any = {};
  public address: any;
  constructor(
    public transService: translateService,
    public alertService: AlertServiceService,
    public checkInCheckOutService: CheckInCheckOutService,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { 
    this.activatedRoute.queryParamMap.subscribe((params: any)=>{
      this.paramData = JSON.parse(params.params.data);
      this.address = this.paramData.address ? this.paramData.address : '' ;
      
      if(this.paramData.items){
        this.paramData.items.forEach((item)=>{
          item.images ? delete item.images : '' ;
          const handover = item.handover;
          item.handover = Object.assign({}, item.takeover);
          item.takeover = Object.assign({}, handover);
        })
      }
    })
  }

  ngOnInit() {
    this.getInvoices();
    this.getChecklistByHome(this.paramData.home);
  }

  public async presentLoading(){
    const loader = await this.loadingCtrl.create({
      spinner: 'lines'
    })
    return loader.present();
  }

  getInvoices(){
    this.presentLoading();
    this.checkInCheckOutService.getInvoices({homeId: this.paramData.home}).subscribe((data: any)=>{
      console.log(data);
      this.invoices = data;
      if(data.rows.length > 0){
        this.dueInvoices = data.rows.filter(invoice => invoice.status === 'due');
        this.paidInvoices = data.rows.filter(invoice => invoice.status === 'paid');
        this.partialInvoices = data.rows.filter(invoice => invoice.status === 'partial');
      }
      this.emptyInvoice = data.rows.length === 0 ? true : false;
      this.loadingCtrl.dismiss();
    },(err)=>{
      this.loadingCtrl.dismiss();
      console.log(err);
      this.alertService.presentAlert('', err.error.message || 'Something went wrong');
    })
  }

  async sign(){
    const modal = await this.modalCtrl.create({
      component: SignaturePadComponent,
      cssClass: 'full-modal'
    });

    modal.onDidDismiss().then((data: any)=>{
      console.log("data",data);
      if(data.role == 'true' && data.data.files.length > 0){
        this.paramData.signature = data.data.files[0]._id;
        this.checkOut()
      }
    })
    return modal.present();
  }

  getChecklistByHome(homeId) {
    this.checkInCheckOutService.getChecklistByHome(homeId).subscribe(
      (data: any) => {
        this.paramData.acceptedTermAndCondition = data.checkOutTermAndCondition;
      },
      (err) => {
        console.log("Error", err);
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  public async checkOut(){
    this.paramData.address ? delete this.paramData.address : '';
    this.presentLoading();
    this.checkInCheckOutService.checkout(this.paramData).subscribe((data: any)=>{
      this.loadingCtrl.dismiss();
      this.router.navigate(['/rentals-checkout-details'],{queryParams: {type: 'checkout_completed', unitId: this.paramData.home }});
        this.presentFeedBackModal();
    },(err)=>{
      this.loadingCtrl.dismiss();
      this.alertService.presentAlert('', err.error.message || 'Something went wrong');
      console.log(err);
    })
  }
  
  async presentFeedBackModal(){
    const modal = await this.modalCtrl.create({
      component: FeedbackComponent,
      componentProps: {
        data: {
          home: this.paramData.home,
          address: this.address
        }
      },
      cssClass: 'feedback-alert-modal'
    });

    modal.onDidDismiss().then((data: any)=>{

    })

    return modal.present();
  }
}
