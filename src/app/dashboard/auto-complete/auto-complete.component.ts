import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { DbService } from '../../db.service';
import Fuse from 'fuse.js'
import { Router } from '@angular/router';

interface Sequence {
  id: number;
  header: string;
  fasta: string;
  type: string;
  class: string;
  mechanism: string;
  group: string;  
}

interface SearchObject {
  class: string;
  mech: string;
  group: string;
  header: string;
  search_terms: string    
  url: string;
  render: string;
}

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {
  public searchData: SearchObject[] = [];
  public control = new FormControl();
  public filteredOptions: SearchObject[] = [];
  public height!: string;

  searchOptions:any;
  fuse:any;

  constructor(private router: Router, private db: DbService) {
    this.searchOptions = {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 16,
      keys: [
        { name: 'search_terms', getFn: (obj:SearchObject) => obj.search_terms }
      ]
    };      
  }

  ngOnInit(): void {
    this.db.fetchSearchData().then((data: Sequence[]) => {
      this.searchData = this.mapToSearchObject(data);                  
      this.fuse = new Fuse(this.searchData, this.searchOptions);
      // Listen for changes to the input
      this.control.valueChanges
        .pipe(
          startWith(''),
          map(value => {
            // Filter the options            
            this.filteredOptions = this.fuse.search(value).slice(0,10)
            // Recompute how big the viewport should be.
            if (this.filteredOptions.length < 4) {
              this.height = (this.filteredOptions.length * 50) + 'px';
            } else {
              this.height = '200px'
            }
          })
        ).subscribe();        
    });    
  }

  private mapToSearchObject(result: Sequence[]): SearchObject[] {        
    let data: Array<SearchObject> = [];
    let cur_class = '';
    let cur_mech = '';
    let cur_group = '';
    result.forEach((r:Sequence) => {
      if (cur_class != r.class) {
        data.push({
          class: r.class,
          mech: '',
          group : '',
          header : '',
          search_terms: r.class,
          url: `/browse/${this.addUnderscores(r.class)}/`,
          render: this.renderItem(r.class, '', '', '')
        });
        cur_class = r.class;
        cur_mech = '';
        cur_group = '';
      }
      if(cur_mech != r.mechanism) {
        data.push({
          class: r.class,
          mech: r.mechanism,
          group : '',
          header : '',
          search_terms: `${r.class}${r.mechanism}`,
          url: `/browse/${this.addUnderscores(r.class)}/${this.addUnderscores(r.mechanism)}/`,
          render: this.renderItem(r.class, r.mechanism, '', '')
        });
        cur_mech = r.mechanism;
        cur_group = '';
      }
      if(cur_group != r.group) {
        data.push({
          class: r.class,
          mech: r.mechanism,
          group : r.group,
          header : '',
          search_terms: `0${r.group}`,
          url: `/browse/${this.addUnderscores(r.class)}/${this.addUnderscores(r.mechanism)}/${this.addUnderscores(r.group)}/`,
          render: this.renderItem(r.class, r.mechanism, r.group, '')
        });      
        cur_group = r.group;
      }
      data.push({
        class: r.class,
        mech: r.mechanism,
        group : r.group,
        header : r.header,
        search_terms: `${r.header}`,
        url: `/browse/${this.addUnderscores(r.class)}/${this.addUnderscores(r.mechanism)}/${this.addUnderscores(r.group)}/`,
        render: this.renderItem(r.class, r.mechanism, r.group, r.header)
      });      
    });
    return data;
  }

  private addUnderscores(title: string): string {
    return encodeURIComponent(title.replace(/ /g, '_'));
  }

  private renderItem(theClass: string, mechanism: string, group: string, header: string): string {
    let str = theClass;
    if (mechanism != '')
      str = str + ' | ' + mechanism;
    if (group != '')
        str = str + " | " + group;
    return str;    
  }
  
  optionSelected(url:string){
    this.router.navigate([url])
  }  

}
