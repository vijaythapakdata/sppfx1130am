import * as React from 'react';
// import styles from './SampleForm.module.scss';
import type { ISampleFormProps } from './ISampleFormProps';
import { ISampleFormState } from './ISampleFormState';
import { useState } from 'react';
import { Web } from '@pnp/sp/webs';
import { Dialog } from '@microsoft/sp-dialog';
import { Dropdown, PrimaryButton, TextField } from '@fluentui/react';
const  SampleForm:React.FC<ISampleFormProps>=(props)=>{
  const[formState,setFormState]=useState<ISampleFormState>({
    Name:"",
    EmailAddress:"",
    Age:"",
    Department:"",
    Gender:"",
    Hobbies:[]
  });
  const createTask=async()=>{
    let web=Web(props.siteurl);
    try{
await web.lists.getByTitle(props.ListName).items.add({
  Title:formState.Name,
  EmailAddress:formState.EmailAddress,
  Age:parseInt(formState.Age),
  Deprtment:(formState.Department),
  Gender:(formState.Gender),
  Hobbies:{results:formState.Hobbies}
});
Dialog.alert("Task created successfully");
setFormState({
  Name:"",
  EmailAddress:"",
  Age:"",
  Gender:"",
  Department:"",
  Hobbies:[]
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
     <Dropdown options={props.GenderOption}
    label='Gender'
    selectedKey={formState.Gender}
    onChange={(_,option)=>handleChange("Gender",option?.key as string)}
    
    />
      <br/>
      <PrimaryButton text='Save' onClick={createTask} iconProps={{iconName:'save'}}/>
    </>
  )
}
export default SampleForm;