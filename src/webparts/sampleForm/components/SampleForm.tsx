import * as React from 'react';
// import styles from './SampleForm.module.scss';
import type { ISampleFormProps } from './ISampleFormProps';
import { ISampleFormState } from './ISampleFormState';
import { useState } from 'react';
import { Web } from '@pnp/sp/webs';
import { Dialog } from '@microsoft/sp-dialog';
import { ChoiceGroup, Dropdown, IDropdownOption, PrimaryButton, TextField } from '@fluentui/react';
const  SampleForm:React.FC<ISampleFormProps>=(props)=>{
  const[formState,setFormState]=useState<ISampleFormState>({
    Name:"",
    EmailAddress:"",
    Age:"",
    Department:"",
    Gender:"",
    Skills:[]
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
  Skills:{results:formState.Skills}
});
Dialog.alert("Task created successfully");
setFormState({
  Name:"",
  EmailAddress:"",
  Age:"",
  Gender:"",
  Department:"",
  Skills:[]
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
      <br/>
      <PrimaryButton text='Save' onClick={createTask} iconProps={{iconName:'save'}}/>
    </>
  )
}
export default SampleForm;