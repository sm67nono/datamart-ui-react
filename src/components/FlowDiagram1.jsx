import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { ArcherContainer, ArcherElement } from 'react-archer';



class FlowDiagram1 extends Component
{
  constructor(props)
  {
    super(props);
    this.state={flowData:[]};
  }
  componentDidMount()
  {
      this.getData();
  }
  getData()
  {
    
    var _ = require('lodash');

   
    fetch("http://localhost:7898/dataSubsetFlows")
            .then(res => res.json())
            .then(
                (result) => {
                 let fData= result.data;
                let s = _.groupBy(fData,'Datasubset ID')

                let finalflow=[];
                for(let tmp in s)
                {
                  let derived=[];
                  let dependent=[];
                  for(let arr of s[tmp])
                  {
                      if(arr["Relationship Type"]=="Dependent")
                      {
                          dependent.push({name:arr["Relationship Datasubset Name"], id:arr["Relationship Datasubset ID"]});
                      }
                      if(arr["Relationship Type"]=="Derived")
                      {
                          derived.push({name:arr["Relationship Datasubset Name"], id:arr["Relationship Datasubset ID"]});
                      }
                  }

                  finalflow.push({datasetID:tmp, datasetName:(s[tmp].length>0)?s[tmp][0]["Datasubset Name"]:"", derivedSets:derived , dependentSets:dependent});

                }

                this.setState({flowData:finalflow});



                },
            (error) => {
                console.log(error);
                }
            )

  }

  render()
  {
    const disp = this.state.flowData;
    //console.log(this.props.flowID);
    let val=[];
    for(let k of disp)
    {
      //Filter only for test
      if(k.datasetID!=this.props.flowID) continue;

      let derivedSts = [];
      for(let s of k.derivedSets)
      {
          derivedSts.push(<div style={{border:"solid 1px orange", padding:5, marginTop:10}} key={s.name}>{s.name}</div>);
      }

      let dependentSts = [];
      for(let s of k.dependentSets)
      {
          dependentSts.push(<div style={{border:"solid 1px green", padding:5, marginTop:10,}} key={s.name}>{s.name}</div>);
      }

      val.push(<ArcherElement id="element1" relations={[{targetId: 'element2', targetAnchor: 'left', sourceAnchor: 'right',style: { strokeColor: '#1565c0', strokeWidth: 1 }}]}>
          <div style={{display:"inline-block", color:"green",  border:"solid 2px green", padding:10, marginRight:150}}><div><center><b>Dependent</b></center></div>{dependentSts}</div>
        </ArcherElement>);
      val.push(<ArcherElement id="element2" relations={[{targetId: 'element3', targetAnchor: 'left', sourceAnchor: 'right',style: { strokeColor: '#1565c0', strokeWidth: 1 }}]}>
            <div style={{display:"inline-block", color:"white", border:"solid 2px #1565c0", background:"#1565c0", padding:10, marginRight:150}} key={k.datasetID}>{k.datasetName}</div>
            </ArcherElement>);
      val.push(<ArcherElement id="element3">
            <div style={{display:"inline-block", color:"orange", border:"solid 2px orange", padding:10}}><div><center><b>Derived</b></center></div>{derivedSts}</div>
              </ArcherElement>);


    }



    return(
      <div>


      <ArcherContainer>
        <div style={{marginTop:30, marginBottom:50}}>{val}</div>
      </ArcherContainer>


      </div>
    );
  }
}
export default FlowDiagram1;
