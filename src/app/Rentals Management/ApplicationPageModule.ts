import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AgoFilter } from './pipes/agofilter';
import { CreateNoticeComponent } from './modals/create-notice/create-notice.component';
import { ImageHelperPipe } from './pipes/image-helper.pipe';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        AgoFilter,
        ImageHelperPipe,
        CreateNoticeComponent
    ],
    entryComponents: [],
    exports: [
        AgoFilter,
        CreateNoticeComponent,
        ImageHelperPipe
    ]
})
export class ApplicationPageModule {

}