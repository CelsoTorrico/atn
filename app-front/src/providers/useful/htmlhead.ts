import { Injectable } from '@angular/core';

/*
  Generated class for the HtmlheadService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class HtmlheadService {

  constructor() {
	console.log('Hello HtmlheadService Provider');
  }

  clearHead(){
	// Try to remove all META-Informaiton
	this.removeDescription();
	this.removeKeywords();
	this.removeStructuredData();
	// Add standard structured data
	this.addStructuredDataWebSite();
	this.addStructuredDataOrganisation();
  }

  removeDescription(){
	// Try to remove META-Tags
	try{
	  document.querySelector("meta[name='description']").remove();
	} catch (e){

	}
  }

  addDescription(content){
	// Add the new META-Tags
	var description = document.createElement('meta');
	description.name = "description";
	description.content = content;
	document.getElementsByTagName('head')[0].appendChild(description);
  }

  removeKeywords(){
	// Try to remove META-Tags
	try{
	  document.querySelector("meta[name='keywords']").remove();
	} catch (e){

	}
  }

  addKeywords(content){
	var keywords = document.createElement('meta');
	keywords.name = "keywords";
	keywords.content = content;
	document.getElementsByTagName('head')[0].appendChild(keywords);
  }

  removeStructuredData(){
	// Remove all Structured Data
	try{
	  while (document.querySelector("script[type='application/ld+json']")){
		document.querySelector("script[type='application/ld+json']").remove();
	  }
	} catch (e){

	}
  }

  addStructuredDataWebSite(){
	var script = document.createElement('script');
	script.type = "application/ld+json";
	script.innerText = '{"@context": "http://schema.org","@type": "WebSite","name": "Weeklystyle.de","alternateName": "Weeklystyle","url": "http://www.weeklystyle.de","sameAs": ["https://twitter.com/weeklystylede","https://www.pinterest.de/weeklystylede/"]}';
	document.getElementsByTagName('head')[0].appendChild(script);
  }

  addStructuredDataOrganisation(){
	var script = document.createElement('script');
	script.type = "application/ld+json";
	script.innerText = '{"@context": "http://schema.org","@type": "Organization","url":"http://www.weeklystyle.de","logo":"http://weeklystyle.de/assets/img/weeklyStyle/category.png"}';
	document.getElementsByTagName('head')[0].appendChild(script);
  }

}