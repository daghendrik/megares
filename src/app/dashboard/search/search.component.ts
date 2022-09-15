import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { DbService } from '../../db.service';
import {map, startWith} from 'rxjs/operators';
import Fuse from 'fuse.js'

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
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  options:any;
  fuse:any;
  myControl = new FormControl('');    
  searchData: Array<SearchObject> = [];
  filteredSearchData!: Observable<SearchObject[]>;

  constructor(private db: DbService) {
    this.filteredSearchData = this.myControl.valueChanges.pipe(
      startWith(''),
      map(term => (term ? this._filterSequences(term) : this.searchData.slice())),
    );    
    
    this.options = {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 16,
      keys: [{
          name: 'search_terms'          
      }]
    };
    
  }

  ngOnInit(): void {
    this.db.fetchSearchData().then((data: Sequence[]) => {
      this.searchData = this.mapToSearchObject(data);
      this.fuse = new Fuse(this.searchData, this.options);
    }); 
  }

  private _filterSequences(value: string): SearchObject[] {
    const filterValue = value.toLowerCase();

    return this.fuse.search(filterValue).slice(0, 10);
    //return this.searchData.filter(searchobj => searchobj.search_terms.toLowerCase().includes(filterValue));
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
          url: `/browse/${this.addUnderscores(r.class)}/`
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
          search_terms: `${r.class} ${r.mechanism}`,
          url: `/browse/${this.addUnderscores(r.class)}/${this.addUnderscores(r.mechanism)}/`
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
          search_terms: `${r.class} ${r.mechanism} ${r.group}`,
          url: `/browse/${this.addUnderscores(r.class)}/${this.addUnderscores(r.mechanism)}/${this.addUnderscores(r.group)}/`
        });      
        cur_group = r.group;
      }
      data.push({
        class: r.class,
        mech: r.mechanism,
        group : r.group,
        header : r.header,
        search_terms: `${r.header}`,
        url: `/browse/${this.addUnderscores(r.class)}/${this.addUnderscores(r.mechanism)}/${this.addUnderscores(r.group)}/`
      });      
    });
    return data;
  }

  addUnderscores(title: string): string {
    return encodeURIComponent(title.replace(/ /g, '_'));
  }
  
  renderItem(item: SearchObject) : string {
    let str = item.class;
    if (item.mech != '')
      str = str + ' | ' + item.mech;
    if (item.group != '')
        str = str + " | " + item.group;
    if (item.header != '')
        str = str + ' <br><small>' + item.header + '</small>';
    return str;
  }

  optionSelected(obj:SearchObject){
    console.log(obj);
  }



}
