import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISampleFormProps {
 ListName:string;
 siteurl:string;
 context:WebPartContext;
 SingleOption:any;//Dropdown [1,2,3,4,5] 
 Multioption:any;//checkbox
 GenderOption:any;//any

}
