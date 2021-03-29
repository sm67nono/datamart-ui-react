import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from '@material-ui/core/Tooltip';
import Label from "@material-ui/icons/Label";
import List from "@material-ui/icons/List"
import File from "@material-ui/icons/InsertDriveFile"
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import InfoIcon from "@material-ui/icons/Info";
import ForumIcon from "@material-ui/icons/Forum";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    "&:hover > $content": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:focus > $content, &$selected > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)",
    },
    "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label": {
      backgroundColor: "transparent",
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: "inherit",
    color: "inherit",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
  tooltipStyle: {
    fontSize: 14
  }
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  // console.log(labelInfo)
  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Tooltip title={labelText} classes={{tooltip: classes.tooltipStyle}}>
            <Typography variant="body2" className={classes.labelText}>
              {
                labelText.length > 20 ? (
                  `${labelText.slice(0,20)}...`
                ) : (
                  labelText
                )
              }
            </Typography>
          </Tooltip>
          <List color="inherit" fontSize="small"/>
          <Typography variant="caption" color="inherit" style={{width: 20}}>
            {labelInfo}
          </Typography>
          <File color="inherit" fontSize="small"/>
          <Typography variant="caption" color="inherit" style={{width: 20}}>
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        //group: classes.group, --> To align all children under same level
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const createTreeViewLevel4 = function (data, selectCard) {
  if (data == null) {
    return [];
  }

  //console.log(data);

  let level1 = {};
  let level2 = {};
  let level3 = {};


  let treeStruct = [];

  let _ = require("lodash");
  //Seperate parent nodes level 1
  let temp = _.groupBy(data, "year");
  //console.log(temp);
  level1 = temp;
  let j = [];
  let l = [];
  let m = [];
  let p = [];

  let counter = 1;
  //Seperate level 2
  for (let obj1 in level1) {
    let filter1 = [];
    filter1.push(obj1);

    treeStruct.push({ depth: 0, name: obj1, len: level1[obj1].length });
    temp = _.groupBy(level1[obj1], "category");
    level2 = temp;
    //console.log(level2);
    //seperate level 3

    m = [];
    for (let obj2 in level2) {
      let filter2 = [].concat(filter1);
      filter2.push(obj2);
      treeStruct.push({ depth: 1, name: obj2, len: level2[obj2].length });
      temp = level2[obj2];
      level3 = temp[0]["laureates"];
      //seperate level 4
      l = [];
      //console.log(level3[0]["laureates"]);
     
      for (let obj3 in level3) {
        let filter3 = [].concat(filter2);
        filter3.push(level3[obj3]);
        treeStruct.push({ depth: 2, name: level3[obj3].surname, len: level3.length });
       

        l.push(
          <StyledTreeItem
            nodeId={counter++}
            labelText={level3[obj3].surname}
            labelIcon={Label}
            labelInfo={level3.length}
            color="#1a73e8"
            bgColor="#e8f0fe"
            onClick={() => console.log(level3[obj3].surname)}
          >
            {j}
          </StyledTreeItem>
        );
      }
      
      m.push(
        <StyledTreeItem
          nodeId={counter++}
          labelText={obj2}
          labelIcon={Label}
          labelInfo={level3.length}
          color="#1a73e8"
          bgColor="#e8f0fe"
          onClick={() => selectCard(filter2, obj2, 1)}
        >
          {l}
        </StyledTreeItem>
      );
    }

    p.push(
      <StyledTreeItem
        nodeId={counter++}
        labelText={obj1}
        labelIcon={Label}
        labelInfo={Object.keys(level2).length}
        color="#1a73e8"
        bgColor="#e8f0fe"
        onClick={() => selectCard(filter1, obj1, 0)}
      >
        {m}
      </StyledTreeItem>
    );
  }

  return p;
};

export default function SimpleTreeView(props) {
  const classes = useStyles();
  let data = createTreeViewLevel4(props.data, props.selectCard);
  //console.log(data);

  return (
    <TreeView
      className={classes.root}
      defaultExpanded={["2"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
    >
      {data}
    </TreeView>
  );
}
