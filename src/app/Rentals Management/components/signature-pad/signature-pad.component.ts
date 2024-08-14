import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { LoadingController, ModalController, ToastController, Platform } from "@ionic/angular";
import { translateService } from "src/app/common-services/translate/translate-service.service";
// import { SignaturePad } from "angular2-signaturepad/signature-pad";
import SignaturePad from 'signature_pad';
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { Device } from "@ionic-native/device/ngx";
@Component({
  selector: "app-signature-pad",
  templateUrl: "./signature-pad.component.html",
  styleUrls: ["./signature-pad.component.scss"],
})
export class SignaturePadComponent implements OnInit {

  @ViewChild('signaturePad') signaturePadElementRef:  ElementRef | undefined;
  signaturePad: any;
  @Input() public data: any;

  public signaturePadOptions: Object = {
    minWidth: 2,
  };
  public signatureImage: string;
  public signatureFile: any = {
    files: [],
  };
  private loadingInstence: HTMLIonLoadingElement;
  constructor(
    public transService: translateService,
    public modalController: ModalController,
    public alertService: AlertServiceService,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    private http: HttpClient,
    private screenOrientation: ScreenOrientation,
    private device: Device,
    private platform: Platform,
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      if(this.device.platform){
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      }
    })
  }

  public ngAfterViewInit(): void {
    if (this.signaturePadElementRef) {
      this.signaturePad = new SignaturePad(this.signaturePadElementRef.nativeElement);
    } else {
      console.error('SignaturePad element not found.');
    }
  }


  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await this.loadingInstence.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Signature is not present.',
      duration: 2000
    });
    toast.present();
  }

  async save() {
    this.signatureImage = this.signaturePad.toDataURL();
    if (this.signaturePad.isEmpty()) {
      this.presentToast();
    }else{
      await this.presentLoading();
      await this.hashSignatureData(this.signatureImage,this.signatureImage);
      this.alertService.getPutSignedUrl('Signature.jpeg').subscribe(async (res: any)=>{
        this.alertService.s3BucketFileTransfer(this.signatureImage, res.url).then(()=>{
          this.loadingCtrl.dismiss();
          this.signatureFile.signatureImage = this.signatureImage;
          res.fileName = 'signature';
          this.signatureFile.files.push(res);
          this.closeModal('true');
          console.log("res",res);
        })
      },(err)=>{
        this.loadingCtrl.dismiss();
        console.log("error",err);
      })
    }
  }
  async hashSignatureData(file,URl,mimeType: string = 'image/jpeg') {
    const data = this.DataURIToBlob(file);
    console.log('DataURIToBlob');
    console.log(data);
    const formData = new FormData();
    formData.append('file', data, 'fileNameTest.jpeg');
    return this.http.put(URl, formData.get('file'), { headers: new HttpHeaders({ 'Content-Type': mimeType }) })
  }
  private DataURIToBlob(dataURI: string): Blob {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString })
  }
 

  clear() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    } else {
      console.error('SignaturePad not initialized.');
    }

  }

  closeModal(value = '') {
    this.modalController.dismiss(this.signatureFile, value);
  }

  ngOnDestroy() {
    this.screenOrientation.lock( this.screenOrientation.ORIENTATIONS.PORTRAIT);
    // this.screenOrientation.unlock();
  }
}
