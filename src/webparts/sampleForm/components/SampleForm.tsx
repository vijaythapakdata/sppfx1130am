import * as React from 'react';
// import styles from './SampleForm.module.scss';
import type { ISampleFormProps } from './ISampleFormProps';
import { ISampleFormState } from './ISampleFormState';
import { useState } from 'react';
import { Web } from '@pnp/sp/webs';
import { Dialog } from '@microsoft/sp-dialog';

const datePickerStrings:IDatePickerStrings={
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  shortDays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  goToToday: "Go to today",
  prevMonthAriaLabel: "Previous month",
  nextMonthAriaLabel: "Next month",
  prevYearAriaLabel: "Previous year",
  nextYearAriaLabel: "Next year",
}

const formateDate=(date:any):string=>{
  // if(!date){
  //   return "";
  
  // }
  // const year=date?.getFullYear();
  // const month=(date.getMonth()+1).toString();
  // const day=date.getDate().toString();
  // return `${month}/${day}/${year}`;

//   var date1=new Date(date);
//   var year=date1.getFullYear();
//   var month=(1+date1.getMonth()).toString();
//   month=month.length>1?month:"0"+month;
//   var day=date1.getDate().toString();
// day=day.length>1?day:"0"+day;
//   return month+"/"+day+"/"+year;
if(!date) return '';
const d=(typeof date==="string")?new Date(date):date;
if(isNaN(d.getTime())) return '';
const year=d.getFullYear();
const month=(d.getMonth()+1).toString();
const day=d.getDate().toString();
return `${month}/${day}/${year}`;
}
import { ChoiceGroup, DatePicker, Dropdown, IDatePickerStrings, IDropdownOption, PrimaryButton, TextField } from '@fluentui/react';
const  SampleForm:React.FC<ISampleFormProps>=(props)=>{
  const[formState,setFormState]=useState<ISampleFormState>({
    Name:"",
    EmailAddress:"",
    Age:"",
    Department:"",
    Gender:"",
    Skills:[],
    City:"",
    DOB:""
  });
  const createTask=async()=>{
    let web=Web(props.siteurl);
    try{
await web.lists.getByTitle(props.ListName).items.add({
  Title:formState.Name,
  EmailAddress:formState.EmailAddress,
  Age:parseInt(formState.Age),
  Department:(formState.Department),
  Gender:(formState.Gender),
  Skills:{results:formState.Skills},
  CityId:formState.City,
  DOB:formateDate(new Date(formState.DOB))
});
Dialog.alert("Task created successfully");
setFormState({
  Name:"",
  EmailAddress:"",
  Age:"",
  Gender:"",
  Department:"",
  Skills:[],
  City:"",
  DOB:""
});

    }
    catch(error){
      console.error("Error creating task:",error);

    }

  }
  //Form Handle
  const handleChange=(field:keyof ISampleFormState,value:string)=>{
   setFormState(prevState=>({...prevState,[field]:value}))
  }
  //Multiselect dropdown option
  const onSkillsChange=(_:any,option:IDropdownOption)=>{
    setFormState(prevState=>({  ...prevState,Skills:option.selected?[...prevState.Skills,option.key as string]:prevState.Skills.filter((key:any)=>key!==option.key)

    }));
  }
  return(
    <>
    <TextField value={formState.Name} label='Name' onChange={(_,event)=>handleChange("Name",event||"")}/>
    <TextField value={formState.EmailAddress} label='Email Address' onChange={(_,event)=>handleChange("EmailAddress",event||"")}/>
    <TextField value={formState.Age} label='Age' onChange={(_,event)=>handleChange("Age",event||"")}/>
    <Dropdown options={props.SingleOption}
    label='Department'
    selectedKey={formState.Department}
    onChange={(_,option)=>handleChange("Department",option?.key as string)}
    
    />
     <ChoiceGroup options={props.GenderOption}
    label='Gender'
    selectedKey={formState.Gender}
    onChange={(_,option)=>handleChange("Gender",option?.key as string)}
    
    />
    <Dropdown options={props.Multioption}
    defaultSelectedKeys={formState.Skills} onChange={onSkillsChange}
    multiSelect label='Skills'
    />
     <Dropdown options={props.CityOptions}
    label='City'
    selectedKey={formState.City}
    onChange={(_,option)=>handleChange("City",option?.key as string)}
    
    />
    <DatePicker
    label='DOB'
    // onSelectDate={date=>handleChange("DOB",date?.toString()||"")}
    // onSelectDate={formState.DOB}
    // onSelectDate={(date)=>handleChange("DOB",date?.toString()||"")}
    value={formState.DOB?new Date(formState.DOB):undefined}
    // formatDate={formateDate}
    onSelectDate={date=>handleChange("DOB",date?.toString()||"")}
    formatDate={formateDate}
    strings={datePickerStrings}
    />
      <br/>
      <PrimaryButton text='Save' onClick={createTask} iconProps={{iconName:'save'}}/>
    </>
  )
}
export default SampleForm;