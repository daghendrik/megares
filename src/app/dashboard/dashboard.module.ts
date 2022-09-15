import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { BrowseComponent } from './browse/browse.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { DownloadComponent } from './download/download.component';
import { ClassComponent } from './class/class.component';
import { GroupComponent } from './group/group.component';
import { MechanismComponent } from './mechanism/mechanism.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    HomeComponent,
    BrowseComponent,
    ChangelogComponent,
    DownloadComponent,
    ClassComponent,
    GroupComponent,
    MechanismComponent,
    AutoCompleteComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatSelectSearchModule,
    MatButtonModule,
    MatSelectInfiniteScrollModule,
    MatAutocompleteModule, 
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    DashboardRoutingModule,
    ScrollingModule
  ]
})
export class DashboardModule { }
