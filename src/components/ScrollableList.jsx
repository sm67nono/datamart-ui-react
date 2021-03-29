import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import { Paper } from '@material-ui/core';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CancelRounded from "@material-ui/icons/HighlightOff"


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: 200
    },
    subTextStyle: {
        fontSize: 10,
        color: 'white',
        padding: 5,
        paddingTop: 3,
        paddingBottom: 3,
        marginRight: 5,
        marginTop: 3,
        marginBottom: 3,
        backgroundColor: '#37617f',
        borderRadius: 10,
        // whiteSpace: 'nowrap'
    },
    subTextContainer: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    listItemStyle: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    },
    noDataContainer: {
        height: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'grey',
        fontSize: 16
    },
    primary: {
        fontSize: 14,
        marginRight: 10
    }
}));


export default function ScrollableList(props) {
    const classes = useStyles();
    const { data, hasChecked, checkedData, handleDataSetSelect } = props
    // console.log(data)
    const itemData = data && Object.values(data).sort((a,b)=>a[0]['Data Sub Set'].localeCompare(b[0]['Data Sub Set']))

    const renderRow = (props) => {
        const { index, style, data } = props;
        let resData = data && data[index] && data[index][0]
        // console.log(resData)
        return (
            <ListItem 
                button={hasChecked}
                className={classes.listItemStyle}
                style={style} 
                key={index} 
                onClick={()=> handleDataSetSelect(resData)}
            >
                {/* {
                    hasChecked &&
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            color='primary'
                            checked={checkedData && Object.keys(checkedData).indexOf(resData['DataSubSetId']) !== -1}
                            // disableRipple
                            inputProps={{ 'aria-labelledby': index }}
                        />
                    </ListItemIcon>
                } */}
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                    {/* <React.Fragment> */}
                        {/* <ListItemText 
                            classes={{
                                primary: classes.primary
                            }}
                            primary={resData['Data Sub Set']}
                        /> */}
                    <div className={classes.subTextContainer}>
                        <span className={classes.primary}>{resData['Data Sub Set']}</span>
                        <span className={classes.subTextStyle}>{resData['Data Domain']}</span>
                        <span className={classes.subTextStyle}>{resData['Data Set']}</span>
                        <span className={classes.subTextStyle}>{resData['Data Sub Set Group']}</span>
                    </div>
                    <div onClick={()=>handleDataSetSelect(resData)}>
                        {
                            !hasChecked &&
                                <CancelRounded style={{color: 'red', cursor: 'pointer'}}/>
                        }
                    </div>
                    {/* </React.Fragment> */}
                </div>
            </ListItem>
        );
    }

    return (
        <div className={[classes.root, {height: props.height}]}>
            {
                itemData && itemData.length > 0 ? (
                    <FixedSizeList
                        height={props.height}
                        maxWidth={450}
                        itemSize={60}
                        itemCount={itemData && itemData.length}
                        itemData={itemData}
                    >
                        {renderRow}
                    </FixedSizeList>
                ) : (
                    <div className={classes.noDataContainer}>
                        No Profiles Selected
                    </div>
                )
            }
        </div>
    );
}
