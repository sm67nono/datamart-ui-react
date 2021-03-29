/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      fontSize: 12
    },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CustomAutoComplete(props) {
    const classes = useStyles();

    return (
        <Autocomplete
            multiple={props.multiple}
            options={props.data}
            disableClearable
            disableCloseOnSelect
            limitTags={1}
            size={'small'}
            value={
                props.multiple ?
                    props.selectedValue ?
                        [...props.selectedValue] : []
                    :
                    props.selectedValue ?
                        props.selectedValue : {key: '', value: ''}
            }
            getOptionLabel={(option) => option.value}
            style={{ width: props.width }}
            onChange={(event, newValue)=>{
                // console.log("========newValue======", newValue)
                if(newValue){
                    // console.log(newValue)
                    props.onDataSelect(newValue)
                }
            }}
            renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.value}
                </React.Fragment>
            )}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    size={'small'}
                    variant="outlined" 
                    label={props.label} 
                    // InputProps={{classes}}
                    // InputLabelProps={{classes}}
                    placeholder={props.label} 
                />
            )}
        />
    );
}
