import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { DbService } from '../../db.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {

  theClass: string = '';
  mechanism: string = '';
  group: string = '';    
  description: string = '';
  links: string[] = [];
  otherGroups: Set<string> = new Set();
  fastas: Set<string> = new Set();
  sequenceDownload: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private db:DbService) {
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(x => {
        this.updateView();
      })      
    }

  private updateView(): void {
    this.theClass = '';
    this.mechanism = '';  
    this.group = '';
    this.description = '';
    this.links = [];
    this.otherGroups = new Set();
    this.fastas = new Set();    
    this.sequenceDownload = '';

    const classy = this.activatedRoute.snapshot.paramMap.get('classdesc');
    const mech = this.activatedRoute.snapshot.paramMap.get('mechanismdesc');    
    const gr = this.activatedRoute.snapshot.paramMap.get('groupdesc');
    if (classy && mech && gr){
      this.theClass = this.removeUnderscores(classy);
      this.mechanism = this.removeUnderscores(mech);
      this.group = this.removeUnderscores(gr);

      this.db.fetchDescriptionOfTerm(this.group).then(res => {
        this.description = res.description;
        this.links = res.links.split(',');
        if (this.links.length && this.links[0] == '0'){
          this.links = [];
        }
      });

      this.db.fetchGroupsOfClassAndMechanism(this.theClass, this.mechanism).then(res => {
        res.forEach((entry: any) => {
          const group: string = entry.group;
          if (group !== this.group){
            this.otherGroups.add(group);
          }          
        });
      });

      this.db.fetchFastaOfClassAndMechanismAndGroup(this.theClass, this.mechanism, this.group).then(res => {
        res.forEach((entry: any) => {
          this.fastas.add(`>${entry.header}<br>${entry.fasta}`);          
          this.sequenceDownload = this.sequenceDownload + `>${entry.header}\r\n${entry.fasta}\r\n`
        })        
      });    
    }  
  }

  removeUnderscores(title: string): string {
    return title.replace(/_/g, ' ');
  }

  getOtherGroupsLink(group: string): string {
    return `../${this.addUnderscores(group)}`;
  }

  addUnderscores(title: string): string {
    return encodeURIComponent(title.replace(/ /g, '_'));
  } 
  
  getClassRoute(): string {
    return `../../../${this.theClass}`.replace(/ /g, '_');
  }

  getMechanismRoute(): string {
    return `../../${this.mechanism}`.replace(/ /g, '_');
  }

  downloadText() {
    try {
      const blob = new Blob([this.sequenceDownload], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'sequences.txt');
    } catch (error) {
      console.log(error);
    }
  }  

}
