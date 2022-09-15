import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/db.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

  classes: Set<string> = new Set();

  constructor(private db: DbService) { }
  
  ngOnInit(): void {
    this.db.fetchClasses().then(result => {
      result.forEach(entry => {
        this.classes?.add(entry.class);
      })
    }); 
  }
  
  getLink(className: string): string {
    return './'+encodeURIComponent(className.replace(/ /g, '_'));
  }

}
