import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from './index';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  myForm: FormGroup;

  //Simulation properties
  data: string[] = ['Apple', 'Banana', 'Carrot', 'Donut', 'Egg', 'Fig', 'Grape', 'Halibut', 'Ice Cream', 'Jicama', 'Kumquat', 'Lima Bean'];
  filteredData: string[] = [];
  filtering: boolean = false;

  mimicPaging: boolean = false;
  itemCount: number = 10;

  //MULTISELECT PROPERTIES
  optionsModel: number[] = []; //index of default selected options
  multiSelectOptions: IMultiSelectOption[] = [];
  unFilteredTotalItems: number = 0;

  //Settings for Multi-select field types
  multiSelectSettings: IMultiSelectSettings = {};

  // Label configuration
  multiSelectLabels: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find...',
    defaultTitle: 'Find...',
    allSelected: 'All selected',
    /*new text for drop down*/
    findHelpText: 'Use Find and Filter to search full list.'
  };

  ngOnInit() {
    let group = {};
    group["ssmdOne"] = new FormControl(); //assume no validations
    this.myForm = new FormGroup(group);
    this.loadDropDown();
  }

  /*
    Called on click of one of the Load buttons
  */
  loadItems(itemCount: number) {
    this.filtering = false;
    this.itemCount = itemCount;
    if (this.itemCount > 30) { this.mimicPaging = true; } 
    this.loadDropDown();
  }

  /* Called when click on the mimic paging checkbox  */
  updatePaging() {
    this.filtering = false;
    this.loadDropDown();
  }

  /* Initializes multi-select options and settings.
     Then loads the drop down with dummy data or dummy filtered data.
  */
  loadDropDown() {
    this.multiSelectOptions = [];
    this.initMutliSelectSettings();

    console.log("filtering: " + this.filtering + " and this.mimicPaging: " + this.mimicPaging);
    this.multiSelectSettings.totalItems = this.filtering ? this.filteredData.length : this.itemCount;
    this.multiSelectSettings.itemsPerPage = this.mimicPaging ? 10 : this.itemCount;
    this.multiSelectSettings.enableSearch = this.itemCount > 10;
    this.multiSelectSettings.showPagingInfo = this.mimicPaging;

    //Create and Filter Dummy Data
    if (this.filtering) {
      for (var t = 0; t < this.filteredData.length; t++) {
        this.multiSelectOptions.push({ id: t, name: this.filteredData[t] });
      }
    } else {
      let dataIndex = 0;
      let displayCount = this.mimicPaging ? this.multiSelectSettings.itemsPerPage : this.itemCount;
      for (var i = 0; i < displayCount; i++) {
        let index = i > dataIndex ? dataIndex : i;
        this.multiSelectOptions.push({ id: i, name: this.data[index] + i });
        dataIndex = dataIndex >= this.data.length - 1 ? 0 : dataIndex + 1;
      }
    }
    //Dummy Data
  }

  /* 
    Set the default settings for the multi-select
    The css classes that begin with fa are part of font-awesome.
    Font-awesome is referenced in index.html along with bootstrap.css
  */
  initMutliSelectSettings() {
    this.multiSelectSettings = {};

    this.multiSelectSettings = {
      enableSearch: false,
      checkedStyle: 'glyphicon', //'checkboxes', 'glyphicon' or 'fontawesome'
      buttonClasses: 'btn btn-default btn-block',
      fixedTitle: false,
      itemClasses: '',
      containerClasses: 'dropdown-inline', //default is 'dropdown-inline'
      dynamicTitleMaxItems: 4,
      selectionLimit: 0,
      closeOnSelect: false,
      showCheckAll: false,
      showUncheckAll: true,
      displayAllSelectedText: true,
      maxHeight: '300px', //300px is the default
      /**
       * new settings are below
       */
      totalItems: 0,
      itemsPerPage: 0,
      showPagingInfo: true,
      searchButtonClasses: 'btn btn-xs ',
      searchGlyphiconClasses: 'fa fa-filter app-glyphicon-primary',
      pageInfoClasses: 'app-dropdown-paging-info ',
      uncheckAllOnReload: true
    };
  }

    /*
      LISTENER:  Event only emitted for multi-selects that have search fields visible.
      This event is listening for the filter button click on the search field.
    
      Filters results for this filter field (drop down)

      NEW event emitter for drop down
   */
    onPageFilterEmitted(searchText: string) {
    console.log("captured searchText of: " + searchText + ".  now hit the server and get more data using the searchText.");


    //ugly simpulation of hitting the serving and filtering on the total items....
    this.filteredData = [];
    let allData: string[] = [];
    let dataIndex = 0;
    for (var i = 0; i < this.itemCount; i++) {
      let index = i > dataIndex ? dataIndex : i;
      allData.push(this.data[index] + i); //itemCount number of names
      dataIndex = dataIndex >= this.data.length - 1 ? 0 : dataIndex + 1;
    }
    allData.forEach(item => {
      if (item.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
        this.filteredData.push(item);
      }
    });

    this.filtering = true;
    this.loadDropDown();
    //now that we have "retrieved" our filtered data from the full set of data...load the drop down
    //repeat of of loadDropDown to avoid making loadDropDown confusing
    //this.multiSelectOptions = [];
    //this.initMutliSelectSettings();

    //this.multiSelectSettings.totalItems = filteredData.length;
    //this.multiSelectSettings.itemsPerPage = 10;//this.mimicPaging ? 10 : this.itemCount;
    //this.multiSelectSettings.enableSearch = true;//this.itemCount > 10;
    //this.multiSelectSettings.showPagingInfo = this.mimicPaging;

    //for (var i = 0; i < filteredData.length; i++) {
    //  this.multiSelectOptions.push({ id: i, name: filteredData[i] });
    //}

  }


}
