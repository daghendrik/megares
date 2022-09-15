import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseComponent } from './browse/browse.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { ClassComponent } from './class/class.component';
import { DashboardComponent } from './dashboard.component';
import { DownloadComponent } from './download/download.component';
import { GroupComponent } from './group/group.component';
import { HomeComponent } from './home/home.component';
import { MechanismComponent } from './mechanism/mechanism.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      {path: '', component: HomeComponent},
      {path: 'browse', component: BrowseComponent},
      {path: 'browse/:classdesc', component: ClassComponent},  
      {path: 'browse/:classdesc/:mechanismdesc', component: MechanismComponent},
      {path: 'browse/:classdesc/:mechanismdesc/:groupdesc', component: GroupComponent},
      {path: 'download', component: DownloadComponent},
      {path: 'changelog', component: ChangelogComponent},
    ]    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
