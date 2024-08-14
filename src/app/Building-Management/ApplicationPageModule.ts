import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AgoFilter } from './pipes/agofilter';
import { CreateNoticeComponent } from './modals/create-notice/create-notice.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        AgoFilter,
        CreateNoticeComponent
    ],
    entryComponents: [],
    exports: [
        AgoFilter,
        CreateNoticeComponent
    ]
})
export class ApplicationPageModule {

}