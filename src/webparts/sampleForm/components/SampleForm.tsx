import * as React from 'react';
// import styles from './SampleForm.module.scss';
import type { ISampleFormProps } from './ISampleFormProps';
import { ISampleFormState } from './ISampleFormState';
import { useState } from 'react';
import { Web } from '@pnp/sp/webs';
import { Dialog } from '@microsoft/sp-dialog';
import { PrimaryButton, TextField } from '@fluentui/react';
const  SampleForm:React.FC<ISampleFormProps>=(props)=>{
  const[formState,setFormState]=useState<ISampleFormState>({
    Name:"",
    EmailAddress:"",
    Age:""
  });
  const createTask=async()=>{
    let web=Web(props.siteurl);
    try{
await web.lists.getByTitle(props.ListName).items.add({
  Title:formState.Name,
  EmailAddress:formState.EmailAddress,
  Age:parseInt(formState.Age)
});
Dialog.alert("Task created successfully");
setFormState({
  Name:"",
  EmailAddress:"",
  Age:""
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
      <br/>
      <PrimaryButton text='Save' onClick={createTask} iconProps={{iconName:'save'}}/>
    </>
  )
}
export default SampleForm;