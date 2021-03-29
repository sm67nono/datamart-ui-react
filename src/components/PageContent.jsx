import React, { Component } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SimpleCard from "./Cards.jsx";
import HorizontalLabelPositionBelowStepper from "./DrillSteps";
import FlowDiagram1 from "./FlowDiagram1";
import CustomizedTabs from "./Tabs";
import { Fade } from "react-reveal";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Paper } from "@material-ui/core";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import mockData from '../mockData/MockData'
//import FlowDiagram2 from './FlowDiagram2';

const useStyles = (theme) => ({
  dialogPaper: {
    height: "60vh",
  },
  buttonContainer: {
    backgroundColor: "#37617f",
    color: "white",
  },
});

class PageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataOg: [],
      allGroupBy: [],
      depth: 0,
      groupBy: "",
      ops: "prev",
      showClickedCard: null,
      filter: [],
      viz: false,
      dataFlowId: "",
      allFlowData: [],
      showCards: true,
      selectedCardToExpand: undefined,
      uploadedDatasets: [],
      selectedDatasetUploads: [],
      catalogModal: false,
      selectedCatalogDataset: undefined
    };
    this.getData = this.getData.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleViz = this.handleViz.bind(this);
    this.toggleShowCards = this.toggleShowCards.bind(this);
  }
  componentDidUpdate(propsNow) {
    if (
      this.props.clickedCard != propsNow.clickedCard ||
      this.props.depth != propsNow.depth
    ) {
      this.handleMenuClick(
        this.props.filter,
        this.props.clickedCard,
        this.props.depth
      );
    }
  }
  componentDidMount() {
    this.getData();
    this.getUploadedDataSets();
  }

  componentWillReceiveProps(){
    this.getUploadedDataSets();
  }

  getUploadedDataSets = async () => {
    let uploadedDatasets = await fetch(
      "http://localhost:7898/publishedDataSetRecords"
    );
    uploadedDatasets = await uploadedDatasets.json();
    this.setState({
      uploadedDatasets: uploadedDatasets.data,
    });
  };

  handleCatalogOpen = (dataSetId) => {
    const {
      uploadedDatasets
    } = this.state
  
    let selectedDatasetUploads = []
    let selectedCatalogDataset
    uploadedDatasets.forEach(data=>{
      data.dataSetHierarchy.forEach(dataset=>{
        if(dataset.DataSubSetId === dataSetId){
          selectedDatasetUploads.push(data)
          selectedCatalogDataset = dataset
        }
      })
    })
    
    this.setState({
      catalogModal: true,
      selectedDatasetUploads,
      selectedCatalogDataset
    })
  }

  getData() {
    
    //Commenting out the live API to test with mock data
    /*fetch("http://localhost:7898/metadata")
      .then((res) => res.json())
      .then(
        (result) => {
          let _ = require("lodash");
          //console.log(result["data"]);
          //let groups = Object.keys(result["data"][0]);
          let groups = [
            "Data Domain",
            "Data Set",
            "Data Sub Set Group",
            "Data Sub Set",
          ];
          let dataGroups = _.groupBy(result["data"], groups[0]);
          //console.log(dataGroups);
          this.props.obData(result["data"]);
          //console.log(groups);

          this.setState({
            dataOg: result["data"],
            data: dataGroups,
            allGroupBy: groups,
            groupBy: groups[0],
          });
        },
        (error) => {
          console.log(error);
        }
      );

   
    fetch("http://localhost:7898/flowMetadata")
      .then((res) => res.json())
      .then(
        (result) => {
          let allFlows = result.data;
          //console.log(allFlows);
          this.setState({ allFlowData: allFlows });
        },
        (error) => {
          console.log(error);
        }
      );*/

      let result = mockData();
      //console.log(result);
      let _ = require("lodash");
      let groups = Object.keys(result[0]);
      let dataGroups = _.groupBy(result, groups[0]);
      this.props.obData(result); 

          this.setState({
            dataOg: result,
            data: dataGroups,
            allGroupBy: groups,
            groupBy: groups[0],
          }); 
        
        }
  
  handleViz = (flowID) => {
    this.setState({
      viz: !this.state.viz,
      dataFlowId: flowID,
      showCards: false,
    });
  };

  handleMenuClick(filter, card, depth) {
    let _ = require("lodash");
    let allGrps = this.state.allGroupBy;
    let data = this.state.dataOg;
    let gpdata = [],
      counter = 0;
    console.log(filter);
    for (let k of filter) {
      gpdata = _.groupBy(data, allGrps[counter++]);
      data = gpdata[k];
    }

    if(depth>=1){
      data = _.groupBy(data[0]["laureates"], "surname");
      
  }
  else{
    data = _.groupBy(data, allGrps[depth + 1]);
  }
   

    //console.log(Object.keys(data));
    this.setState({
      data: data,
      depth: depth + 1,
      groupBy: allGrps[depth],
      filter: filter,
      viztitle: "",
      viz: false,
    });
    //console.log(filter, card,depth);
  }

  handleNext(ops, groupBy) {
    if (ops == "next") {
      let gpBy = this.state.groupBy;
      let allGrps = this.state.allGroupBy;
      let dep = this.state.depth;

     

      if (gpBy == allGrps[allGrps.length - 1]) {
        return;
      }
      let _ = require("lodash");
      let data = this.state.data;
      let max = -1;

      let temp = data[groupBy];
      if(dep>=1){
        data = _.groupBy(temp[0]["laureates"], "surname");
        //console.log(data);
    }
    else{
      data = _.groupBy(temp, allGrps[dep + 1]);
      //console.log(data);
    }
      let fltr = this.state.filter;
      fltr.push(groupBy);

      this.setState({
        data: data,
        depth: dep + 1,
        groupBy: allGrps[dep + 1],
        filter: fltr,
      });
    } else {
      this.handlePrev(ops);
    }
  }

  handlePrev(ops) {
    if (ops == "prev") {
      let dep = this.state.depth;
      let fltr = this.state.filter;
      //console.log(fltr);
      fltr.pop();
      let _ = require("lodash");
      let allGrps = this.state.allGroupBy;
      let data = this.state.dataOg;
      let gpdata = [],
        counter = 0;

      for (let k of fltr) {
        gpdata = _.groupBy(data, allGrps[counter++]);
        data = gpdata[k];
      }
      data = _.groupBy(data, allGrps[dep - 1]);

      //console.log(Object.keys(data));
      this.setState({
        data: data,
        depth: dep - 1,
        groupBy: allGrps[dep],
        filter: fltr,
        viztitle: "",
        viz: false,
      });
    }
  }

  toggleShowCards(val) {
    if (val == "hierarchy") {
      this.setState({ showCards: true });
    } else {
      this.setState({ showCards: false });
    }
  }

  render() {
    let cards = [];
    let finalC = this.state.showClickedCard;
    const {
      catalogModal,
      selectedDatasetUploads
    } = this.state
    const {
      classes
    } = this.props

    if (finalC != null) {
      let t = (
        <Grid item xs={3} key={this.state.showClickedCard}>
          <SimpleCard
            title={this.state.showClickedCard}
            viz={this.handleViz}
            depth={3}
            ops={this.handleNext}
          />
        </Grid>
      );
      cards.push(t);
    } else {
      let dta = Object.keys(this.state.data);
      let allDta = this.state.data;

      for (let o of dta) {
        let description = "";
        let itemID = "";
        switch (this.state.depth) {
          case 0:
            description = "This card represents year in which the nobel prize was awarded. You can drill down into categories from here.";//allDta[o.toString()][0].domainDescription;
            itemID = allDta[o.toString()][0].domainId;
            break;

          case 1:
            description = "This card shows the category for which the nobel prize was awarded. You can click on view laureates to find out more.";//allDta[o.toString()][0].dataSetDescription;
            itemID = allDta[o.toString()][0].dataSetId;
            break;

          case 2:
            description = "This card shows the name and details of the nobel laureate. "//allDta[o.toString()][0].dataSubSetCategoryDescription;
            itemID = allDta[o.toString()][0].DataSubSetCategoryId;
            break;

          case 3:
            description = allDta[o.toString()][0].DataSubSetDescription;
            itemID = allDta[o.toString()][0].DataSubSetId;
            break;

          default:
            break;
        }

        let t = (
          <Grid item xs={3} key={o.toString()}>
            <Fade right duration={1500} distance="40px">
              <SimpleCard
                selectedCardToExpand={this.state.selectedCardToExpand}
                setSelectedCard={(val) =>
                  this.setState({ selectedCardToExpand: val })
                }
                openCatalogModal={this.handleCatalogOpen}
                closeCatalogModal={()=>this.setState({catalogModal: false})}
                desc={description}
                itemID={itemID}
                title={o.toString()}
                depth={this.state.depth}
                viz={this.handleViz}
                ops={this.handleNext}
              />
            </Fade>
          </Grid>
        );
        cards.push(t);
      }
    }

    if (this.state.showCards) {
      return (
        <div>
          <Grid container spacing={3}>
            <HorizontalLabelPositionBelowStepper
              index={this.state.depth}
              label={this.state.filter}
              ></HorizontalLabelPositionBelowStepper>
            {cards}
          </Grid>
          <Dialog
            open={catalogModal}
            onClose={() => this.setState({ catalogModal: false })}
            scroll={"paper"}
            fullWidth={true}
            classes={{ paper: classes.dialogPaper }}
            maxWidth={'md'}
            disableBackdropClick
            disableEscapeKeyDown
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog"
            >
            <DialogTitle id="scroll-dialog-title">
              Available Datasets
              <IconButton 
                aria-label="close" 
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                }} 
                onClick={()=>this.setState({ catalogModal: false })}
                >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers={"paper"}>
              {
                selectedDatasetUploads.length > 0 ? (
                  selectedDatasetUploads.map(dataFile=>{
                    let publishedDate = new Date(dataFile.publishedDate)
                    publishedDate = `${publishedDate.getMonth()+1}/${publishedDate.getDate()}/${publishedDate.getFullYear()}`
                    // [...Array(5).keys()].map(dataFile=>{
                    return (
                      <Paper elevation={3} style={{marginBottom: 20, padding: 10}}>
                        <div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography variant="h6" gutterBottom style={{color: '#37617f'}}>
                              {dataFile.dataSetName}
                              {/* Dataset {dataFile+1} */}
                            </Typography>
                            <Typography variant="body2" gutterBottom style={{paddingLeft: 10, color: 'grey'}}>
                                {publishedDate}
                                {/* 23/10/2019 */}
                            </Typography>
                          </div>
                          <div>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                              <Typography variant="subtitle2" gutterBottom style={{color: 'grey'}}>
                                Owned By: 
                              </Typography>
                              <Typography variant="body2" gutterBottom style={{paddingLeft: 10, color: 'grey'}}>
                                {dataFile.dataSetOwner}
                                {/*  */}
                              </Typography>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                              <Typography variant="subtitle2" gutterBottom style={{color: 'grey'}}>
                                Published By: 
                              </Typography>
                              <Typography variant="body2" gutterBottom style={{paddingLeft: 10, color: 'grey'}}>
                                {dataFile.publishedBy}
                                {/* Dinesh */}
                              </Typography>
                            </div>
                          </div>
                        </div>
                        <div>
                        <Typography variant="body2" gutterBottom style={{color: 'grey', paddingTop: 10}}>
                          {/* This is sample dataset {dataFile} body1Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                          unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam */}
                          {dataFile.dataSetDescription}
                        </Typography>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                          <Button 
                            variant="contained"
                            className={classes.buttonContainer}
                            onClick={() => window.open(`http://localhost:7898/getfiles/${encodeURI(dataFile.fileLink)}`)}
                          >
                            Download &nbsp;
                            <CloudDownloadIcon/>
                          </Button>
                        </div>
                      </Paper>
                    )
                  })
                ) : (
                  <Typography variant="h6" gutterBottom style={{display: 'flex', justifyContent: 'center', color: 'grey'}}>
                    No Dataset available yet
                  </Typography>
                )
              }
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    return (
      <div>
        <Grid container spacing={3}>
          <HorizontalLabelPositionBelowStepper
            index={this.state.depth}
            label={this.state.filter}
          ></HorizontalLabelPositionBelowStepper>
        </Grid>
      </div>
    );
  }
}
export default withStyles(useStyles)(PageContent);
