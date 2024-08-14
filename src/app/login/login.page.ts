import { Component, OnInit } from '@angular/core';
import {
  NavController,
  ModalController,
  LoadingController,
  AlertController,
  MenuController,
  PopoverController,
} from '@ionic/angular';
import * as _ from 'lodash';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';
import { CountrycodemodalComponent } from './countrycodemodal/countrycodemodal.component';
import { LoginService } from '../common-services/login.service';
import { AlertServiceService } from '../common-services/alert-service.service';
import { translateService } from '../common-services/translate/translate-service.service';
import { StorageService } from '../common-services/storage-service.service';
import { Router } from '@angular/router';
import { SelectOrganizationComponent } from '../common-components/select-organization/select-organization.component';
import { SelectOrganizationComponent as RenatalOrganizationSelectionComponent } from '../Rentals Management/components/select-organization/select-organization.component';
import { AddUserComponent } from '../common-components/add-user/add-user.component';
import { NeedHelpComponent } from '../common-components/need-help/need-help.component';
import { HTTP } from '@ionic-native/http/ngx';
import { AppComponent } from '../app.component';
import { LanguageComponent } from '../Rentals Management/components/language/language.component';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateService } from '@ngx-translate/core';
import * as orgFile from '../conatants/organization.json';
import { GoogleService } from '../google.service';
import { async } from '@angular/core/testing';
import { RsaEncryptionService } from '../common-services/rsa-encrypt/rsa-encryption-service.service';
import { Device } from '@ionic-native/device/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public displayFooter: boolean = orgFile.displayFooter;
  public commonAuth: boolean = orgFile.CommonAuth || false;
  private loadingInstence: HTMLIonLoadingElement;
  constructor(
    private loginService: LoginService,
    private loading: LoadingController,
    private router: Router,
    private alertService: AlertServiceService,
    private modalCtrl: ModalController,
    private http: HTTP,
    private appSetting: MainAppSetting,
    public alertController: AlertController,
    private navCtrl: NavController,
    public translateService: translateService,
    public TranslateService: TranslateService,
    // private mixpanel: Mixpanel,
    // private smsRetriever: SmsRetriever,
    private MenuController: MenuController,
    private popover: PopoverController,
    private storageService: StorageService,
    private appComponent: AppComponent,
    private splashScreen: SplashScreen,
    private googleService: GoogleService,
    private rsaEncryptionService: RsaEncryptionService,
    private device: Device,

  ) {
    // this.TranslateService.use('en')
    MenuController.enable(false);
    // this.mixpanel.init('1350cf4808c3adbdd9ef79625d091dc7').then(success => {
    // }).catch(err => {
    // })

  }

  // To store the form data
  loginData: any = {
    countryCode: orgFile.countryCode,
    loginType: 'login',
    appName: orgFile.appName,
    source: 'business-app',
    appVersion: orgFile.appVersion
  };

  public app: string = orgFile.appBundleId;
  appSrc;
  // To display error message when both the password is not correct while setting password
  passwordMismatch = false;
  passwordValidated = false;
  missingValidations = [];
  passwordType = 'password';
  confirmPasswordType = 'password';
  passwordCheckObject = {
    minCharacters: false,
    lowerCase: false,
    upperCase: false,
    digits: false,
    symbols: false,
    noSequence: true,
    noUserInfo: true,
    unusedPassword: true,
  }
  isAccountLocked = false;
  lockedMessage = '';
  isPasswordExpired = false;
  showOtpCounter = false;
  timeLeft: number = 60;
  interval;
  eventCopy: any;
  public lang: string = '';
  /* This variable will decide which input block is visible on screen
  values are ['phoneInput', 'passwordInput', 'otpInput', 'passwordSetInput', 'sendOtpInput']
  */
  visibleBlock = 'phoneInput';

  // Only these user types are allowd to use this app
  allowedUsers = ['employee', 'admin', 'technician', 'housekeeper'];


  public route: boolean = true;


  arabicNumberConverter(str: any) {
    let output: string = '';
    console.log(str);
    typeof str === 'string' ? '' : JSON.stringify(str);
    console.log(str);
    for (var i = 0; i < str.length; i++) {
      output = output.concat(this.translateService.getTranslatedData(str.charAt(i)));
    }
    console.log(output);
    return output;
  }


  ionViewDidLeave() {
    this.MenuController.enable(true);
  }

  ngOnInit() {
    this.alertService.getDataFromLoaclStorage('lang').then((val: string) => {
      console.log(val);

      val == null && this.app === 'com.aqaraty.fm' ? this.selectLanguageModal() : '';
    });
  }

  setVisibleBlock(type) {
    this.visibleBlock = type;

    if (type === 'sendOtpInput') {
      this.loginData.action = 'resetPassword';
    } else {
      this.loginData.action = 'login';
    }

    console.log(this.visibleBlock);
  }


  // This function will display loading screen

  async presentLoading() {
    this.loadingInstence = await this.loading.create({
      spinner: 'lines'
    });
    await this.loadingInstence.present();

  }

  // This function will check for user's platform based on his phone number

  async checkPlatform() {

    window.localStorage.clear();

    this.loginData.accessCode = '';
    this.loginData.accessCode1 = '';
    this.loginData.accessCode2 = '';
    this.loginData.accessCode3 = '';
    this.loginData.accessCode4 = '';

    window.localStorage.removeItem('platform');
    await this.storageService.removeItem('platform');
    this.appSetting.platform = '';
    if (!this.verifyPhone()) {
      this.alertService.presentAlert('', this.translateService.getTranslatedData('Please enter a valid phone number'));
    } else {

      localStorage.setItem('phoneNumber', this.loginData.phoneNumber);
      this.storageService.storeDataToIonicStorage('phoneNumber', this.loginData.phoneNumber);

      localStorage.setItem('countryCode', this.loginData.countryCode);
      this.storageService.storeDataToIonicStorage('countryCode', this.loginData.countryCode);

      await this.presentLoading();

      if (this.appSetting.ORG == 'Both') {
        this.loginService.checkPlatform(this.loginData)
          .subscribe(async (data: any) => {

            this.loadingInstence.dismiss();

            console.log(data);
            if (data.type === 'multi') {
              this.showProductSelectionPopup(data);
            } else if (data.type === 'bm') {
              this.handleUser(data, 'bm');
            } else if (data.type === 'rm') {
              this.handleUser(data, 'rm');
            }

            // this.mixpanel.track('User called checkplatform service', {
            //   "userdata": this.loginData
            // })

          }, async (err: any) => {

            this.loadingInstence.dismiss();

            // this.mixpanel.track(' checkplatform service error', {
            //   "userdata": this.loginData
            // })
            this.visibleBlock = 'onboardUser';
            // this.alertService.presentAlert("", err.error);

          });
      } else {

        this.commonAuth ? this.commonAuthService(true) : this.verifyPhoneService();
      }

    }
  }


  // If user is found on multiple platforms this function will display a popup to select between platforms

  async showProductSelectionPopup(data?) {
    this.popover.create({
      component: SelectOrganizationComponent,
      mode: 'md',
      componentProps: { data: data },
      cssClass: 'select-org-popover'
    }).then(d => {
      d.present();
      d.onDidDismiss().then(async (data: any) => {
        if (data) {
          await this.handleUser(data.data, data.role, true);
        }
      });
    });
  }


  // Check id user is allowed to use this app

  async handleUser(data, type, hidethisotp?: boolean) {

    console.log('--------******-----------');
    console.log(data);
    console.log(type);
    this.loginData.action = data[type].action;
    this.loginData.loginType = data[type].action;
    console.log(this.loginData);
    console.log('--------******-----------');

    await this.appSetting.setPlatformAfterLogin(JSON.stringify(type));
    window.localStorage.setItem('platform', type);
    await this.alertService.saveToLocalStorage('platform', type);

    window.localStorage.setItem('types', data[type].types);
    this.alertService.saveToLocalStorage('types', data[type].types);


    if (type === 'bm') {
      window.localStorage.setItem('appSrc', 'building-management');
      this.alertService.saveToLocalStorage('appSrc', 'building-management');
      this.appComponent.setAppSrcForFirstLogin('building-management');

    } else {
      window.localStorage.setItem('appSrc', 'rentals');
      this.alertService.saveToLocalStorage('appSrc', 'rentals');
      this.appComponent.setAppSrcForFirstLogin('rentals');

    }

    if (this.isUserAllowed(data[type].types)) {
      // if (data[type].action === 'login') {
      //   this.visibleBlock = 'passwordInput';
      // } else {
      if (hidethisotp == true || data[type].action === 'login') {

        this.verifyPhoneService(true);
      } else {
        this.visibleBlock = 'otpInput';
      }
      // }
    } else {
      this.alertService.presentAlert('', this.translateService.getTranslatedData('You are not allowed to use this app'));
    }
  }

  // thios method will check if user is alloued to use this app or not 

  isUserAllowed(types) {
    // this.alertService.presentAlert ('Alert',(_.intersection(this.allowedUsers, types).length > 0 ? true : false));
    return (_.intersection(this.allowedUsers, types).length > 0 ? true : false);
  }

  // Common function to set values to localstorage

  saveToLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }


  saveToIonicStorage(key, value) {
    this.storageService.storeDataToIonicStorage(key, value);
  }
  keyup(val, next, prev, current) {
    // this.checkFocus(current,val)
    // console.log("------------------------")
    // console.log("val"+val);

    if (val == '') {
      // console.log("ionChange prev");
      if (this.route == true) {
        prev.setFocus();
      }

    } else {
      // console.log("ionChange text");
      if (val !== '') {
        next.setFocus();
      }

    }
    //       // }
    //       // console.log('prev');
    //     } else if (event.key !== 'Backspace') {
    //       this.checkFocus(current)
    //       next.setFocus()
    //     }
  }

  checkFocus(val) {
    // console.log("ionFocus" + val);
    if (val == '') {
      this.route = true;

    } else {
      this.route = false;

    }
  }

  next(el, prev, value) {

    this.eventCopy = event;

    if (value) {
      console.log('contains');
    } else {
      console.log('empty');
    }

    if (this.eventCopy.key == 'Backspace' && !value) {
      if (prev) {
        prev.setFocus();
      }
    }
    else if (this.eventCopy.key == 'Backspace' && value) {
      // DO nothing
    }
    else {
      el.setFocus();
    }
  }



  // }

  // onchange(val) { }
  // {

  //   if (current.value == '') {
  //     this.route = true
  //   } else {
  //     this.route = false
  //   }

  // }

  reload() {
    // window.location.reload();
    this.isAccountLocked = false;
  }

  //checking the password and confirm password are equal or not
  passwordMatch() {
    if (this.loginData.password
      && this.loginData.passwordCheck) {
      if (String(this.loginData.password) === String(this.loginData.passwordCheck)) {
        this.passwordMismatch = false;
      } else {
        this.passwordMismatch = true;
      }
    }else{
      this.passwordMismatch = false;
    }
  }

  //validation check for the password
  async validatePassword() {
    let password;
    if(this.loginData){
      password = this.loginData.password;
    }

    if (password === undefined || password === null || password === "") {
      this.passwordValidated = false;
      this.missingValidations = [];
      this.passwordCheckObject = {
        minCharacters: false,
        lowerCase: false,
        upperCase: false,
        digits: false,
        symbols: false,
        noSequence: true,
        noUserInfo: true,
        unusedPassword: true,
      }
      return;
    }

    if (this.loginData && this.loginData.password) {

      // const encryptedPassword = this.rsaEncryptionService.encrypt(this.loginData.password);

      const payload = {
        phoneNumber: this.loginData.phoneNumber || "",
        password: this.loginData.password || "",
      };

      this.loginService.validatePassword(payload)
        .subscribe(
          async (data: any) => {

            this.passwordCheckObject = {
              minCharacters: true,
              lowerCase: true,
              upperCase: true,
              digits: true,
              symbols: true,
              noSequence: true,
              noUserInfo: true,
              unusedPassword: true,
            }

            if (data && data.valid === true) {

              this.passwordValidated = true;

            } else {

              this.passwordValidated = false;
              this.missingValidations = data.detailedResponse || [];

              const validationMap = {
                reusedPassword: 'unusedPassword',
                min: 'minCharacters',
                lowercase: 'lowerCase',
                uppercase: 'upperCase',
                digits: 'digits',
                symbols: 'symbols',
                spaces: 'spaces',
                usingPlugin: {
                  'Password cannot contain sequential characters.': 'noSequence',
                  'Password cannot contain user information.': 'noUserInfo',
                },
              };

              this.missingValidations.forEach((item) => {
                const key = validationMap[item.validation];
                if (key) {
                  if (item.validation === 'usingPlugin') {
                    const subKey = validationMap[item.validation][item.message];
                    if (subKey) {
                      this.passwordCheckObject[subKey] = false;
                    }
                  } else {
                    this.passwordCheckObject[key] = false;
                  }
                }
              })

            }
          },
          async err => {

            this.passwordValidated = false;
            this.alertService.presentAlert('', err.error.message);

          }
        );
    }

  }

  togglePasswordType(value= 'passwordType') {
      if(this[value] === "text") {
        this[value] = "password";
      } else if (this[value] === "password") {
        this[value] = "text";
      } else {
        this[value] = "password";
      }
  }

  validetPhoneNumber() {

    const phoneno = /^[6-9]\d{9}$/;

    if (this.loginData.phoneNumber) {

      // localStorage.setItem('phoneNumber', this.loginData.phoneNumber);
      // localStorage.setItem('countryCode', this.loginData.countryCode);

      if (this.loginData.countryCode === '+91') {

        return this.loginData.phoneNumber.match(phoneno) ? true : false;

      } else {

        return this.loginData.phoneNumber.length > 4 ? true : false;

      }
    } else {
      return false;
    }
  }

  async setValues(data) {

    await this.storageService.getDatafromIonicStorage('appSrc').then(data => {
      this.appSrc = data;
    });

    try {
      console.log(data);
      window.localStorage.setItem('isLoggedIn', 'true');
      this.storageService.storeDataToIonicStorage('isLoggedIn', 'true');

      window.localStorage.setItem('user_id', data.uid);
      this.storageService.storeDataToIonicStorage('user_id', data.uid);

      window.localStorage.setItem('token', data.token);
      this.storageService.storeDataToIonicStorage('token', data.token);
      this.appSetting.setTokenAferLogin(data.token);

      window.localStorage.setItem('currencyCode', data.currencyCode);
      this.storageService.storeDataToIonicStorage('currencyCode', data.currencyCode);

      window.localStorage.setItem('organization', data.organization);
      this.storageService.storeDataToIonicStorage('organization', data.organization);

      window.localStorage.setItem('sortByValue','-startDate');
      await this.storageService.storeDataToIonicStorage('sortByValue','-startDate');

      window.localStorage.setItem('hasAccessToOnHoldTicket', JSON.stringify( data.role.onHoldTicket || false));
      this.storageService.storeDataToIonicStorage('hasAccessToOnHoldTicket', JSON.stringify( data.role.onHoldTicket || false));

      window.localStorage.setItem('hasAccessToReOpenedTicket', JSON.stringify(data.role.reOpenedTicket || false));
      this.storageService.storeDataToIonicStorage('hasAccessToReOpenedTicket', JSON.stringify(data.role.reOpenedTicket || false));

      data.role.module.other = {};
      window.localStorage.setItem('moduleAccess', JSON.stringify(data.role.module));
      await this.storageService.storeDataToIonicStorage('moduleAccess', JSON.stringify(data.role.module));
      this.appComponent.moduleAccess = data.role.module
      this.googleService.initiateGoogleAnalytics(data.uid, data.organization);
    }
    catch (err) {

    }
    finally {

      await this.navCtrl.navigateRoot(`/${this.appSrc}-home`);
      // this.router.navigateByUrl(`/${window.localStorage.getItem('appSrc')}-home`);
    }




  }

  async login() {
    await this.presentLoading();

    // if (this.loginData.accessCode1 && this.loginData.accessCode2 && this.loginData.accessCode3 && this.loginData.accessCode4) {
    //   this.loginData.accessCode = this.loginData.accessCode1 + "" + this.loginData.accessCode2 + "" + this.loginData.accessCode3 + "" + this.loginData.accessCode4
    // }


    this.loginService.login(this.loginData)
      .subscribe(async (data: any) => {

        this.loadingInstence.dismiss();

        this.setValues(data);
      },
        async err => {

          this.loadingInstence.dismiss();

          this.alertService.presentAlert('', this.translateService.getTranslatedData(err.error.message));
        }
      );
  }

  async verifyOtp() {

    await this.presentLoading();

    this.loginData.accessCode = this.loginData.accessCode1 + '' + this.loginData.accessCode2 + '' + this.loginData.accessCode3 + '' + this.loginData.accessCode4;

    this.loginService.verifyOtp(this.loginData)
      .subscribe(async (data: any) => {

        this.loadingInstence.dismiss();

        this.showOtpCounter = false;
        this.visibleBlock = 'passwordSetInput';
        // this.alertService.presentAlert ('Alert',"otp verifies")
        // this.presentAddUserModal();
        // this.mixpanel.track('User called verify otp service', {
        //   "userdata": this.loginData,
        // });
      },
        async err => {

          this.loadingInstence.dismiss();

          // this.mixpanel.track('verify otp service error', {
          //   "userdata": this.loginData,
          //   "error": err
          // });
          this.alertService.presentAlert('', this.translateService.getTranslatedData(err.error.message));
        }
      );
  }
  async presentAddUserModal() {
    await this.modalCtrl.create({
      component: AddUserComponent
    }).then(modal => {
      modal.present();
    });
  }

  async sendOtp() {

    // this.alertService.presentAlert ('Alert',"send otp called");
    if (!this.validetPhoneNumber()) {
      this.alertService.presentAlert('', this.translateService.getTranslatedData('Please enter a valid phone number'));
    } else {
      this.loginData.accessCode = this.loginData.accessCode1 + '' + this.loginData.accessCode2 + '' + this.loginData.accessCode3 + '' + this.loginData.accessCode4;
      localStorage.setItem('phoneNumber', this.loginData.phoneNumber);
      localStorage.setItem('countryCode', this.loginData.countryCode);
      await this.presentLoading();
      this.loginService.sendOtp(this.loginData)
        .subscribe(
          async (data: any) => {

            this.loadingInstence.dismiss();

            // this.smsRetriever.startWatching()
            //   .then((res: any) => {
            //     // console.log(res)
            //     this.retrieveOtp(res.Message, 'verify')
            //   })
            //   .catch((error: any) => console.error(error));

            this.visibleBlock = 'verifyOtpInput';
            this.startTimer();
          },
          async err => {

            this.loadingInstence.dismiss();

            this.alertService.presentAlert('', this.translateService.getTranslatedData(err.error.message));
            // this.mixpanel.track('OTP service error', {
            //   "userdata": this.loginData,
            //   "error": err
            // });
          }
        );
    }
  }

  async resetPassword() {
    // let encryptedPassword;
    // if (this.loginData && this.loginData.password) {
    //   encryptedPassword = this.rsaEncryptionService.encrypt(this.loginData.password);
    // }
    // let payload = _.cloneDeep(this.loginData);
    // payload.password = encryptedPassword;
    // delete payload['passwordCheck']; 
    await this.presentLoading();
    this.loginService.reserPassword(this.loginData)
      .subscribe(
        async (data: any) => {


          this.loadingInstence.dismiss();

          this.setValues(data);
        },
        async err => {

          this.loadingInstence.dismiss();

          // this.mixpanel.track('password reset service error', {
          //   "userdata": this.loginData,
          //   error: err
          // });
          this.alertService.presentAlert('', this.translateService.getTranslatedData(err.error.message));
        }
      );
  }

  async signIn() {
    if(this.device && this.device.platform) {
      this.loginData.platform = this.device.platform.toLowerCase()
    }
    // let encryptedPassword;
    // if (this.loginData && this.loginData.password) {
    //   encryptedPassword = this.rsaEncryptionService.encrypt(this.loginData.password);
    // }
    // let payload = _.cloneDeep(this.loginData);
    // payload.password = encryptedPassword;
    // delete payload['passwordCheck']; 
    await this.presentLoading();
    if (this.loginData.loginType == 'register') {
      this.loginService.register(this.loginData)
        .subscribe(async (data: any) => {

          this.loadingInstence.dismiss();

          this.setValues(data);
        },(err) => {
          this.loadingInstence.dismiss();

          if (err.error && (err.error.message.includes("Your account has been locked"))) {
            this.customerErrorHandler(err);
          } else if (err.data && (err.error.message.includes("Your password has expired"))) {
            this.isPasswordExpired = true;
          } else {
            this.alertService.presentAlert('', err.error.message);
          }

        });
    }
    else {
      this.loginService.signIn(this.loginData)
        .subscribe(
          async (data: any) => {


            this.loadingInstence.dismiss();

            this.setValues(data);


          },
          async err => {

            this.loadingInstence.dismiss();

            // this.mixpanel.track('password reset service error', {
            //   "userdata": this.loginData,
            //   error: err
            // });
            if (err.error && (err.error.message.includes("Your account has been locked"))) {
              this.customerErrorHandler(err);
            } else if (err.data && (err.error.message.includes("Your password has expired"))) {
              this.isPasswordExpired = true;
            } else {
              this.alertService.presentAlert('', err.error.message);
            }
            
          }
        );
    }
  }

  async customerErrorHandler(err){
    const alert = await this.alertController.create({
      subHeader: this.translateService.getTranslatedData(err.error.message || 'Something went wrong'),
      buttons: [
        {
          text: 'Ok',
          role: 'Ok',
          handler: ()=>{}
        }
      ]
    })
    await alert.present()
    alert.onDidDismiss().then(() => {
      window.location.reload();
    })
  }

  // This function will user based on his phone number

  async verifyPhoneService(showlaoding?: boolean) {

    if (this.verifyPhone()) {
      if (showlaoding == true) {

        await this.presentLoading();
      }
      this.loginService.verifyPhone(this.loginData)
        .subscribe(
          async (data: any) => {

            this.loadingInstence.dismiss();


            console.log('Sending otp');

            // this.smsRetriever.startWatching()
            //   .then((res: any) => {
            //     // console.log(res)
            //     this.retrieveOtp(res.Message, 'login')
            //   })
            //   .catch((error: any) => console.error(error));

            console.log('-------------------------');
            console.log(data.action);
            console.log('-------------------------');

            window.localStorage.setItem('organizationType', data.organization.type || 'residential');
            this.alertService.saveToLocalStorage('organizationType', data.organization.type || 'residential');

            if (this.isUserAllowed(data.types)) {
              if (data.action == 'login') {

                window.localStorage.setItem('types', data.types);
                this.alertService.saveToLocalStorage('types', data.types);
                this.loginData.loginType = 'login';
                this.visibleBlock = 'passwordInput';

              }
              else {
                window.localStorage.setItem('types', data.types);
                this.alertService.saveToLocalStorage('types', data.types);
                this.loginData.loginType = 'register';
                this.visibleBlock = 'otpInput';
                this.startTimer();

              }

            }
            // else if (data.types.indexOf('owner') > -1) {
            //   this.alertService.presentAlert ('Alert','Owner login is coming soon');
            // }
            else {
              this.alertService.presentAlert('', this.translateService.getTranslatedData('You must be an Admin/Staff to use this app'));
            }
            // this.mixpanel.track('User tried calling varify phone service ', {
            //   "userdata": this.loginData,
            // });
          },
          async (err: any) => {

            this.loadingInstence.dismiss();

            console.log(err);
            if (err.error.message == `User not found with the phone number - ${this.loginData.countryCode} ${this.loginData.phoneNumber}.`) {
              this.visibleBlock = 'onboardUser';
              // this.showProductSelectionPopup()
              // this.alertService.presentAlert("", "It seems you are not in our system")
            }else if (err.error && (err.error.message.includes("Your account has been locked"))) {
              this.lockedMessage = err.error.message;
              this.isAccountLocked = true;
            }else {
              this.alertService.presentAlert('', this.translateService.getTranslatedData('something went wrong please try again'));
            }
            // this.mixpanel.track("verify phone service error", {
            //   "userdata": this.loginData,
            //   "error": err
            // });
          });
    } else {
      this.alertService.presentAlert('', this.translateService.getTranslatedData('Please enter a valid phone number'));
    }

  }

  async commonAuthService(showlaoding?: boolean) {
    if (!showlaoding) {
      this.presentLoading();
    }

    this.loginService.commonAuth(this.loginData).subscribe(
      (data: any) => {

        this.loadingInstence.dismiss();

        if(data.organizations.length > 1) {
          this.presentOrganizationSelectionModal(data);
        }else{

          window.localStorage.setItem('baseURL',data.organizations[0].baseURL);
          this.storageService.storeDataToIonicStorage('baseURL',data.organizations[0].baseURL);

          window.localStorage.setItem('organization', data.organizations[0].organizationId);
          this.storageService.storeDataToIonicStorage('organization', data.organizations[0].organizationId);

          window.localStorage.setItem('organizationType', data.organization.type || 'residential');
          this.alertService.saveToLocalStorage('organizationType', data.organization.type || 'residential');


          if (this.isUserAllowed(data.types)) {
            if (data.action == 'login') {
              window.localStorage.setItem('types', data.types);
              this.alertService.saveToLocalStorage('types', data.types);
              this.loginData.loginType = 'login';
              this.visibleBlock = 'passwordInput';
            }
            else {
              window.localStorage.setItem('types', data.types);
              this.alertService.saveToLocalStorage('types', data.types);
              this.loginData.loginType = 'register';
              this.visibleBlock = 'otpInput';
              this.startTimer();
            }
          } else {
            this.alertService.presentAlert('', this.translateService.getTranslatedData('You are not allowed to use this app'));
          }
        }
      },
      (err) => {
        this.loadingInstence.dismiss();
        console.log("Error", err);
        this.alertService.presentAlert(
          "",
          err.error.message || "Something went wrong"
        );
      }
    );
  }

  //  This function will validate phone number on the basis of ragex phone number

  verifyPhone() {
    let phoneno = /^[6-9]\d{9}$/;

    if (this.loginData.phoneNumber) {
      // this._storage.set("phoneNumber", this.loginData.phoneNumber)
      // this._storage.set("countryCode", this.loginData.countryCode)

      if (this.loginData.countryCode === '+91') {
        return this.loginData.phoneNumber.match(phoneno) ? true : false;
      }
      else {
        return this.loginData.phoneNumber.length > 4 ? true : false;
      }
    }
    else {
      return false;
    }

  }

  async presentOrganizationSelectionModal (data) {
    this.popover
      .create({
        component: RenatalOrganizationSelectionComponent,
        componentProps: { data: data },
        mode: "md",
        cssClass: "select-org-popover",
      })
      .then((d) => {
        d.present();
        d.onDidDismiss().then(async (data: any) => {

          if (data && data.data) {
            this.loginData.organizationId = data.data.organizationId;

            window.localStorage.setItem('baseURL',data.data.baseURL);
            this.storageService.storeDataToIonicStorage('baseURL',data.data.baseURL);

            window.localStorage.setItem('organization', data.data.organizationId);
            this.storageService.storeDataToIonicStorage('organization', data.data.organizationId);

            this.verifyPhoneService(true);
          }
        });
      });
  }

  async showCountryCodeModal() {
    await this.modalCtrl.create({
      component: CountrycodemodalComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: { 'value': this.loginData.countryCode }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then((data: any) => {
        this.loginData.countryCode = data.data ? data.data : this.loginData.countryCode;
        // console.log(data.data, "Data from country code modal");
      });
    });


  }

  startTimer() {
    this.timeLeft = 60;
    this.showOtpCounter = true;
    this.interval = setInterval(() => {
      if (this.timeLeft == 0) {
        this.showOtpCounter = false;
        clearInterval(this.interval);
      } else {
        this.timeLeft--;
      }
    }, 1000);
  }

  retrieveOtp(string, action) {

    // console.log(string);

    const pattern = /\d{4}/;
    let messageData = string;
    try {
      let otp = (messageData.match(pattern)[0]);
      if (otp) {
        this.loginData.accessCode = otp;
      }
      otp = otp.split('');
      otp.forEach((element, index) => {
        this.loginData[`accessCode${index + 1}`] = element;
        // console.log(element, index);
        // console.log(this.loginData)
      });
      if (action == 'login') {
        this.login();
      } else {
        this.verifyOtp();
      }
    } catch (err) {
      // console.log(err);
    }

  }

  needHelp() {
    this.modalCtrl.create({
      component: NeedHelpComponent,
    }).then(modal => {
      modal.present();
    });
  }


  public async selectLanguageModal() {
    await this.popover.create({
      component: LanguageComponent,
      componentProps: {
        event: event,
        // mode: 'ios',
        componentProps: {
          lang: this.lang
        }
      }
    }).then(popover => {
      popover.present();
      popover.onDidDismiss().then((data: any) => {
        if (data.data) {
          this.lang = data.data;
          this.changeLanguage(data.data);
        }
      });
    });
  }

  public changeLanguage(lang: string) {
    console.log('finale code', this.lang);

    this.splashScreen.show();
    this.alertService.saveToLocalStorage('lang', lang);
    this.TranslateService.use(lang);
    lang === 'ar' ? document.body.style.setProperty('--direction', 'rtl') : document.body.style.setProperty('--direction', 'ltr');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

}
