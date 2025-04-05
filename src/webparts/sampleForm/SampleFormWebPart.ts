import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'SampleFormWebPartStrings';
import SampleForm from './components/SampleForm';
import { ISampleFormProps } from './components/ISampleFormProps';
// import {sp} from "@pnp/sp";
import { sp } from '@pnp/sp/presets/all';

export interface ISampleFormWebPartProps {
ListName: string;
}
export default class SampleFormWebPart extends BaseClientSideWebPart<ISampleFormWebPartProps> {
  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
     sp.setup({
     spfxContext:this.context
     });
    });
  }
  public async render(): Promise<void> {
    const element: React.ReactElement<ISampleFormProps> = React.createElement(
      SampleForm,
      {
       ListName:this.properties.ListName,
       siteurl:this.context.pageContext.web.absoluteUrl,
       context:this.context,
       SingleOption:await this.getChoiceFields(this.context.pageContext.web.absoluteUrl,"Department"),
       Multioption:await this.getChoiceFields(this.context.pageContext.web.absoluteUrl,"Skills"),
       GenderOption:await this.getChoiceFields(this.context.pageContext.web.absoluteUrl,"Gender")
      }
    );

    ReactDom.render(element, this.domElement);
  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('ListName', {
                  label: strings.ListFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
  //Get Choice Fields

  private async getChoiceFields(siteurl:string,fieldvalue:string):Promise<any>{
    try{
      const respone=await fetch(`${siteurl}/_api/web/lists/getbytitle('First List')/fields?$filter=EntityPropertyName eq '${fieldvalue}'`,

{
  method:'GET',
  headers:{
    'Accept':'application/json;odata=nometadata',
    'Content-Type':'application/json;odata=nometadata',
    'odata-version':''
  }
}

      );
      if(!respone.ok){
        throw new Error('Error fetching choice fields');
      }
      const data=await respone.json();
      const choice=data?.value[0]?.Choices; //["A","B","C"] 0,1,2
      return choice.map((item:any)=>({
        key:item,
        text:item
      }));
    }
    catch(err){
      console.error('Error fetching choice fields:',err);
    }
  }
}
