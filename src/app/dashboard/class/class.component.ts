import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbService } from '../../db.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {

  theClass: string = '';  
  description: string = '';
  links: string[] = [];
  mechanisms: Set<string> = new Set();
  sequenceDownload: string = '';

  constructor( private activatedRoute: ActivatedRoute, private db:DbService) { }

  ngOnInit(): void {
    const classy = this.activatedRoute.snapshot.paramMap.get('classdesc');
    if (classy){
      this.theClass = this.removeUnderscores(classy);
      
      this.db.fetchDescriptionOfTerm(this.theClass).then(res => {
        this.description = res.description;
        this.links = res.links.split(',');
        if (this.links.length && this.links[0] == '0'){
          this.links = [];
        }              
      });
  
      this.db.fetchMechanismsOfClass(this.theClass).then(res => {            
        res.forEach((entry: any)  => {
          this.mechanisms.add(entry.mechanism);
        })
      });

      this.db.fetchFastaOfClass(this.theClass).then(res => {
        res.forEach((entry: any) => {
          this.sequenceDownload = this.sequenceDownload + `>${entry.header}\r\n${entry.fasta}\r\n`
        })
      });      
    }    
  }

  removeUnderscores(title: string): string {    
      return title.replace(/_/g, ' ');    
  }

  addUnderscores(title: string): string {
    return './'+encodeURIComponent(title.replace(/ /g, '_'));
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
