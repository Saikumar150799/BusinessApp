import { AlertController, ActionSheetController, Platform, ModalController, NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { MainAppSetting } from '../conatants/MainAppSetting';
import { Storage } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { translateService } from './translate/translate-service.service';
import * as jsonFile from '../conatants/organization.json';
import * as localeFile from '../conatants/LOCALE_STRING.json';
import { Device } from '@ionic-native/device/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SuccessAlertModalComponent } from '../Rentals Management/modals/success-alert-modal/success-alert-modal.component';
import { Router } from '@angular/router';
import { StorageService } from "src/app/common-services/storage-service.service";
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {
  public jsonFile: any = jsonFile;
  public localeFile: any = localeFile;
  public currencyCode: string;
  public data: any = {};
  public respData: any = {};
  public fileURL: any;
  public apiUrl: any;
  public countDown: number = 5;
  constructor(
    private alrtCtrl: AlertController,
    private camera: Camera,
    private transfer: FileTransfer,
    private appSetting: MainAppSetting,
    private actionSheet: ActionSheetController,
    private storage: Storage,
    private translateService: translateService,
    private device: Device,
    private filaPath: FilePath,
    private http: HttpClient,
    private imagePicker: ImagePicker,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private modalCtrl: ModalController,
    private router: Router,
    public storageService: StorageService,
    public _navCtrl: NavController,
    private splashScreen: SplashScreen
  ) {
    this.storage.get("currencyCode").then((val) => {
      this.currencyCode = val;
    });
  }


  private options: CameraOptions = {
    quality: 15,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
  };

  saveToLocalStorage(key, value) {
    this.storage.set(key, value);
  }

  getDataFromLoaclStorage(key) {
    return this.storage.get(key);
  }

  public async checkCameraPermission(options) {
    return this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
       async result => {
        if (!result.hasPermission) {
          return await this.requestCameraPermission(options);
        }
        return result.hasPermission;
      },
      err => {
        console.error(err);
      }
    );
  }
  
  public async requestCameraPermission(options) {
     return this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      async success => {
        return success.hasPermission;
      },
      err => {
        console.error(err);
      }
    );
  }

  public async selectImage(options){
      const imagePickerOptions = {
        maximumImagesCount: 1,
        width: 800, 
        height: 800,
        quality: 100, // Image quality (0-100)
      };

      this.imagePicker.getPictures(imagePickerOptions).then(
        (results) => {
         console.log("Result",results);
        },
        (err) => console.log(err)
      );

      await this.camera.getPicture(options).then(
        (imageData) => {
          if (imageData) {
            this.fileURL = imageData;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    return this.fileURL;
  }

  public async capturePhoto(sourcetype) {
    this.fileURL = "";
    this.options.sourceType =
      sourcetype == "library"
        ? this.camera.PictureSourceType.PHOTOLIBRARY
        : this.camera.PictureSourceType.CAMERA;
    this.options.destinationType = this.camera.DestinationType.FILE_URI;

    if(this.device.platform.toLowerCase() === 'android' && this.device.version >= "13"){
      const permission = await this.checkCameraPermission(this.options);
      if(permission === true){
        await this.selectImage(this.options);
      }
    }else{
      await this.camera.getPicture(this.options).then(
        (imageData) => {
          if (imageData) {
            this.fileURL = imageData;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
    return this.fileURL;
  }

  public getPutSignedUrl(img: string): Observable<any> {
    return this.http.post(
      `${this.appSetting.getApi()}/api/document/presigned`,
      { fileName: this.onCaptureImage(img) },
      this.appSetting.getHttpHeadesWithToken()
    );
  }

  private onCaptureImage(fileURI) {
    console.log("from on capture image", fileURI);
    return fileURI.substring(7);
  }

  public s3BucketFileTransfer(fileURI1: string, url) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    const uploadOpts: FileUploadOptions = {
      fileKey: "file",
      httpMethod: "PUT",
      fileName: fileURI1.substr(fileURI1.lastIndexOf("/") + 1),
      mimeType: "image/jpeg",
      chunkedMode: false,
      headers: {
        "Content-Type": "image/jpeg",
      },
    };
    const promise = new Promise(async (resolve, reject) => {
      await fileTransfer
        .upload(fileURI1, url, uploadOpts)
        // tslint:disable-next-line: no-shadowed-variable
        .then(
          (data) => {
            console.log("SUCCESS FROM .then UPLOAD METHOD", data);
            this.respData = data;
            this.fileURL = this.respData.fileUrl;
            resolve(this.respData);
            // return JSON.stringify(data);
          },
          (err) => {
            console.log("ERROR FROM .then UPLOAD METHOD", err.body);
            reject(err.body);
          }
        );
      console.log("Before Returning data", this.respData);
    });
    return promise;
  }

  public emptyStorage() {
    return this.storage.clear();
  }

  async presentAlert(header: string, subheader: string) {
    const alert = await this.alrtCtrl.create({
      header:
        header.length > 0
          ? this.translateService.getTranslatedData(header)
          : header,
      subHeader:
        subheader.length > 0
          ? this.translateService.getTranslatedData(subheader)
          : subheader,
      cssClass: "alert-header gotham",
      buttons: [
        {
          text: this.translateService.getTranslatedData("Ok"),
          cssClass: "float-right",
        },
      ],
    });
    await alert.present();
  }

  async customPresentAlert(header: string, subheader: string) {
    const alert = await this.alrtCtrl.create({
      header:
        header.length > 0
          ? this.translateService.getTranslatedData(header)
          : header,
      subHeader:
        subheader.length > 0
          ? this.translateService.getTranslatedData(subheader)
          : subheader,
      cssClass: "alert-header gotham",
      buttons: [
        {
          text: this.translateService.getTranslatedData("Ok"),
          cssClass: "float-right",
          handler: () => {
            this.router.navigateByUrl('/rentals-home');
          },
        },
      ],
    });
    await alert.present();
  }

  public presentSuccessModal(type: string = 'ticket', facilityData?: any): Promise<HTMLIonModalElement> {
    console.log("c99999");
    return this.modalCtrl.create({
      component: SuccessAlertModalComponent,
      cssClass: 'success-alert-modal'
    })
  }
  

  public async upload(fileURI1, data, type) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    console.log(fileURI1);

    const uploadOpts: FileUploadOptions = {
      fileKey: "Display Picture",
      params: {
        data: JSON.stringify(data),
      },
      fileName: fileURI1.substr(fileURI1.lastIndexOf("/") + 1),
      headers: {
        authorization: window.localStorage.getItem("token"),
      },
    };

    if (type == "RAISETICKET") {
      this.apiUrl = `${this.appSetting.getApi()}/api/ticket`;
      uploadOpts.httpMethod = "post";
    } else if (type == "UPDATETICKET") {
      uploadOpts.httpMethod = "put";
      this.apiUrl = `${this.appSetting.getApi()}/api/ticket/${data._id}`;
    } else if (type == "CREATENOTICE") {
      uploadOpts.httpMethod = "post";
      console.log(uploadOpts);

      this.apiUrl = `${this.appSetting.getApi()}/api/discussion`;
    } else if (type == "ADDTOTICKETDETAIL") {
      this.apiUrl = `${this.appSetting.getApi()}/api/ticket/${data._id}`;
      uploadOpts.httpMethod = "put";
    } else if (type == "PROJECTUPDATE") {
      this.apiUrl = `${this.appSetting.getApi()}/api/project/${data._id}`;
      uploadOpts.httpMethod = "post";
    }

    console.log(uploadOpts);
    console.log("******** FIle Url *******");
    console.log(fileURI1);
    console.log("******** API Url *******");

    console.log(this.apiUrl);

    const promise = new Promise(async (resolve, reject) => {
      await fileTransfer.upload(fileURI1, this.apiUrl, uploadOpts).then(
        (data) => {
          this.respData = JSON.parse(data.response);
          console.log(this.respData);
          this.fileURL = this.respData.fileUrl;
          resolve(this.respData);
        },
        (err) => {
          reject(err);
        }
      );
    });

    console.log("Before Returning data", this.respData);
    return promise;
  }

  getNumberFormat(number: number) {
    // return Intl.NumberFormat(this.jsonFile.default[this.currencyCode] ? this.jsonFile.default[this.currencyCode] : 'en-IN', { style: 'currency', currency: this.jsonFile.default[this.currencyCode] ? this.currencyCode : 'INR' }).format(number ? number : 0)
    return this.jsonFile.default.appBundleId === "com.aqaraty.fm"
      ? Intl.NumberFormat("en-Us").format(number ? number : 0)
      : // Intl.NumberFormat(this.localeFile.default[this.currencyCode] ?
      //   this.localeFile.default[this.currencyCode]
      //   : 'en-IN',
      //   {
      //     style: 'currency', currency: this.localeFile.default[this.currencyCode] ?
      //       this.currencyCode
      //       : 'INR'
      //   }).format(number ? number : 0)
      Number(number ? number : 0).toLocaleString(
        this.localeFile.default[this.currencyCode]
          ? this.localeFile.default[this.currencyCode]
          : "en-IN",
        {
          style: "currency",
          currency: this.currencyCode ? this.currencyCode : "INR",
          minimumFractionDigits: 0,
        }
      );
  }

  public async presentInvalidTokenAlert() {
      
    const alert = await this.alrtCtrl.create({
      header: 'Authorization Token is Invalid',
      message: `You will be logged out in ${this.countDown} seconds`,
      backdropDismiss: false,
      cssClass: "invalid-token-alert",
    });

    const updateAlertMessage =()=> {
      alert.message = `You will be logged out in ${this.countDown} seconds`;
    }

    let intervalId = setInterval(() => {
      this.countDown--;
      updateAlertMessage();

      if (this.countDown <= 0) {
        clearInterval(intervalId);
        alert.dismiss();
        window.localStorage.clear();
        this.storageService.emptyStorage();
        this._navCtrl.navigateRoot('/login');
        this.splashScreen.show();

        setTimeout(()=> {
          window.location.reload();
        },1000)
      }
    }, 1000);

    await alert.present();
  }
}
