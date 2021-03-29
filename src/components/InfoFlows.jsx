import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FlowDiagram1 from './FlowDiagram1';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import clsx from 'clsx';
import { useEffect } from 'react';
import '../css/flow.css'
import { useState } from 'react';

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: '#37617f'
    },
    content: {
        // flexGrow: 1,
        padding: theme.spacing(10),
        // paddingLeft: theme.spacing(3)
    },
}));

export default function InfoFlows(props) {
    const [data, setData] = useState([])
    const [dependentDerivedData, setDependentDerivedData] = useState([])
    let checkAllParentsNodeAdded = {}
    const [treeNode, setTreeNode] = useState("")
    const classes = useStyles();
    let treeFlow = "";
    let tree="";
    const { id } = props.match.params
    //const id = '144-125-0'
    useEffect(() => {
        fetch("http://localhost:7898/flowMetadata").then(res => res.json())
      

            .then(
                (result) => {

                    // console.log(result.data)
                    setData(result.data)
                },
                (error) => {
                    console.log(error);
                }
            );
    }, [id])

    useEffect(() => {
        createTags()
    }, [data])

    useEffect(() => {
        // console.log("-----tree changed-----", treeNode)
        document.getElementById("treeView").innerHTML = treeNode;
    }, [treeNode])


      function checkForMany2One(data)
{
  let childParentMap = [];
  //creata a child parent map

  for(let k of data)
  {
    if(k.children!=undefined)
    {
      if(k.children.length==1)
      {
         childParentMap.push({child:k.children[0].name,parent:k.name});
         checkAllParentsNodeAdded[k.name]=0;
      }
      else {
        continue;
      }
    }
  }


  let p = _.groupBy(childParentMap,"child");



  return p;
}

function createTags()
{

//let id = document.getElementById('flowID').value;

let k=[];

for(let dt of data)
{


  if(dt.id==id)
  {

    k=dt.val;
    break;
  }
}



let chpMap = checkForMany2One(k);

let dependentConnArrow=[];
let derivedConnArrow=[];

for(let s of k)
{
  let callCount=0;
  //Obtain the middle section
  treeFlow = '';
  let multipleParentFlag={val:0};

  let derivedSets = [];

  //To be used for arrow connections later
  dependentConnArrow.push(s.name.toString().replace(/ /g,''));

  if(checkAllParentsNodeAdded[s.name]==1)
  {
    continue;
  }
  checkAllParentsNodeAdded={};

  obtainTreeRecursively(s, chpMap, callCount,multipleParentFlag,derivedSets);


  let depSts = getDependentSet(s);

  if(multipleParentFlag.val==1)
  {
    for(let s2 of k)
    {
      if(checkAllParentsNodeAdded[s2.name]==1)
      {
        depSts+=getDependentSet(s2);
      }
    }
  }




  tree += '<div class="parentWrapperPerFlow">'

  //1. Step Adding dependent sets for each flow
 if(depSts.length>0)
  {
    tree+='<div class="dependentFlow" id="dependent_'+s.name.toString().replace(/ /g,'')+'">';
    tree+=depSts;
    tree+='</div>';
  }

  //2. Step
  //Creating each individual flows
  tree+='<div class="centerFlow">';
  tree+='<ul id="treeID" class="tree">';
  tree+=treeFlow;
  tree+='</div>';


  //3. Step Adding derived sets for each flow
  if(derivedSets.length>0)
  {
    tree+='<div class="derivedFlow">';
    for(let derSts of derivedSets)
    {
      if(derSts.derivedSt.length<=0) continue;
      derivedConnArrow.push(derSts.appName.toString().replace(/ /g,''));
      tree+='<div id="derived_'+derSts.appName.toString().replace(/ /g,'')+'">';


        for(let elem of derSts.derivedSt)
        {
          tree+='<div class="derElem">'+elem.appName+' ('+elem.relationDataSet+')'+'</div>';
        }
      tree+='</div>';
    }
    tree+='</div>';
  }



//CLose Wrapper
  tree+='</div>';

}
//console.log(tree);

//Add element for connectors
tree+='<div id="addArrows"></div>';
document.getElementById("treeView").innerHTML = tree;



let dpc ='';
//Adding derived connections;

for(let ar of derivedConnArrow)
{
  dpc+='<connection from="#'+ar+'" to="#derived_'+ar+'" color="orange" fromX="1" fromY="0.50" toX="0" toY="0.50" tail></connection>';
}

//Adding dependent connections
for(let arw of dependentConnArrow)
{
  dpc+='<connection from="#dependent_'+arw+'" to="#'+arw+'" color="green" fromX="1" fromY="0.50" toX="0" toY="0.50" tail></connection>';
}




document.getElementById("addArrows").innerHTML = dpc;
}


function getDependentSet(s)
{
  let m = s.dependentSt;
  //Create a div html structure
  let dephtml = '';
  for(let arr of m)
  {
    dephtml+='<div class="depElem">'+arr.appName+' ('+arr.relationDataSet+')'+'</div>';
  }

  return dephtml;


}
function obtainTreeRecursively(s, chpMap, callCount, multipleParentFlag, derivedSets)
{
  //console.log(callCount);




  let vals=[];
  vals.push(s.name);
  for(let ch in chpMap)
  {
      for(let v of chpMap[ch])
      {
          if(v.parent.toString()==s.name.toString())
          {

            //Here we get all the parents associated with a child component
            vals = Object.keys(_.groupBy(chpMap[ch], "parent"));
            break;
          }

      }
  }



  if(vals.length>1)
  {
    multipleParentFlag.val =1;
    treeFlow=treeFlow+'<li><span>';
    for(let g of vals)
    {

      checkAllParentsNodeAdded[g]=1;
      treeFlow=treeFlow+'<div class="parentElem" id="'+s.name.toString().replace(/ /g,'')+'">'+g.toString()+'</div>';
    }
    treeFlow=treeFlow+"</span>";


  }

  //When the number of elements are more than 1
  else {


    treeFlow=treeFlow+'<li><span id="'+s.name.toString().replace(/ /g,'')+'">';
    treeFlow=treeFlow+vals[0].toString();
    treeFlow=treeFlow+"</span>";
  }




  if(s.children!=undefined)
  {
    if(s.children.length>1)
    {
      treeFlow=treeFlow+"<ul class='multipleChild'>";
    }
    else {
      if(s.children.length==1)
      {  treeFlow=treeFlow+"<ul>"; }
      if(s.children.length==0)
      {
        //Adding all the derived datasets
        derivedSets.push({appName:s.name.toString(), derivedSt:s.derivedSt});
        return;
      }
    }

    let m = s.children;
    let chpMap = checkForMany2One(m);
    for(let h of m)
    {
      callCount++;
      obtainTreeRecursively(h, chpMap,callCount, multipleParentFlag,derivedSets);
    }
    treeFlow=treeFlow+"</ul>";
  }


treeFlow=treeFlow+"</li>";
//finally closing the initiated UL and LI tags for dependentSets

  return;
}

    return (
        <div>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar)}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Sample - Flow Visualization
                    </Typography>
                </Toolbar>
            </AppBar>



            <div className={classes.content}>
                <Typography
                    variant="h6"
                    align="left"
                    className={clsx(classes.header)}
                >

                </Typography>


                <div style={{marginLeft:200}}>
                  <FlowDiagram1  viz={true} flowID={id} />
                </div>
                <div id='treeView' className='treeView'>


                </div>
            </div>
        </div>
    )
}
