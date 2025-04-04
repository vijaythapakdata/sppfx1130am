import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISampleFormProps {
 ListName:string;
 siteurl:string;
 context:WebPartContext;
 SingleOption:any;//Dropdown
 Multioption:any;//checkbox
 GenderOption:any;//any

}
