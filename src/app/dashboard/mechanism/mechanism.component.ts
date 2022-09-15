import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs';
import { DbService } from '../../db.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-mechanism',
  templateUrl: './mechanism.component.html',
  styleUrls: ['./mechanism.component.css']
})
export class MechanismComponent {

  theClass: string = '';
  mechanism: string = '';
  description: string = '';
  links: string[] = [];
  otherMechanisms: Set<string> = new Set();
  groups: Set<string> = new Set();
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
    this.description = '';
    this.links = [];
    this.otherMechanisms = new Set();
    this.groups = new Set();
    this.sequenceDownload = '';

    const classy = this.activatedRoute.snapshot.paramMap.get('classdesc');
    const mech = this.activatedRoute.snapshot.paramMap.get('mechanismdesc');
    if (classy && mech){
      this.theClass = this.removeUnderscores(classy);
      this.mechanism = this.removeUnderscores(mech);

      this.db.fetchDescriptionOfTerm(this.mechanism).then(res => {
        this.description = res.description;
        this.links = res.links.split(',');
        if (this.links.length && this.links[0] == '0'){
          this.links = [];
        }        
      });

      this.db.fetchMechanismsOfClass(this.theClass).then(res => {            
        res.forEach((entry: any) => {
          const mechanism: string = entry.mechanism;
          if (mechanism !== this.mechanism){
            this.otherMechanisms.add(mechanism);
          }          
        });
      });
      
      this.db.fetchGroupsOfClassAndMechanism(this.theClass, this.mechanism).then(res => {
        res.forEach((entry: any) => {
          this.groups.add(entry.group);
        })
      });

      this.db.fetchFastaOfClassAndMechanism(this.theClass, this.mechanism).then(res => {
        res.forEach((entry: any) => {
          this.sequenceDownload = this.sequenceDownload + `>${entry.header}\r\n${entry.fasta}\r\n`
        })
      });
    }
  }

  removeUnderscores(title: string): string {
    return title.replace(/_/g, ' ');
  }

  getOtherMechanismLink(mechanism: string): string {
    return `../${this.addUnderscores(mechanism)}`;
  }

  addUnderscores(title: string): string {
    return encodeURIComponent(title.replace(/ /g, '_'));
  }

  getClassRoute(): string {
    return `../../${this.theClass}`.replace(/ /g, '_');
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
