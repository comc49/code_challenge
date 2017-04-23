let React = require("react")
let ReactDOM = require("react-dom")
let axios = require("axios")
let url = 'https://code-challenge-briankoo.c9users.io';


//stateless component to create html list
const returnList = (name,value,i) => {
    return (
        <li key={name+value+i}>
        {name}
            <ul>
                <li>
                    {value}
                </li>
            </ul>
        </li>
    );
}

const DeleteButton = ({func}) => {
    return (
        <button onClick = {func}></button>
        )
    
}
const Drugs = ({data}) => {
    let jsx = data.reduce((acc,val,i) => {
        acc.push(
            <ul className = "drugs" key={i}>
                {returnList("autorizationNumber",val.autorizationNumber,i)}
                {returnList("DosageText",val.DosageText,i)}
                {returnList("medicinalProduct",val.medicinalProduct,i)}
                {returnList("drugIndication",val.drugIndication,i)}
            </ul>
        )
        return acc;
    },[]);
    return (
        <section>
            {jsx}
        </section>
        );
}
const Patient = ({data}) => {
    return (
        <ul>
            <li>
                Drugs
                <Drugs data = {data.drugs}/>
            </li>
            <li>
                reaction
                <Reaction data = {data.reaction}/>
            </li>
            <li>
                age
                <ul><li>{data.age}</li></ul>
            </li>
            <li>
                sex
                <ul><li>{data.sex}</li></ul>
            </li>
        </ul>
    ) 
}
const Reaction = ({data}) => {
    let jsx = data.reduce((acc,val,i) => {
        acc.push(
            <ul className="reaction" key = {i}>
                <li>
                meddraPrimaryTerm
                    <ul>
                        <li>
                            {val.meddraPrimaryTerm}
                        </li>
                    </ul>
                </li>
            </ul>
                )
        return acc;
    },[])
    return (
        <section>
            {jsx}
        </section>
        ) 
}
    
    
const Rows = ({data}) => {
    return (
        <ul type="circle" >
            <li>
                ID
                <ul><li>{data._id}</li></ul>
            </li> 
            <li>
                Receive Date
                <ul><li>{data.receiveDate}</li></ul>
            </li> 
            <li>
                Patient
                <Patient data={data.patient}/>
            </li> 
            <li>
                Receipt Date
                <ul><li>{data.receiptDate}</li></ul>
            </li> 
            <li>
                safetyReportId
                <ul><li>{data.safetyReportId}</li></ul>
            </li> 
            <li>
                companyNumber
                <ul><li>{data.companyNumber}</li></ul>
            </li> 
        </ul>
        );
}
//subcomponent for createForm component
class CreateFormReaction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
           meddraPrimaryTerm: ""
        }
    }
    render() {
        return (
            <div>
                Reaction
                <div className="reactionForm">
                    <label>
                        meddraPrimaryTerm
                        <input type="text" name="meddraPrimaryTerm" onChange={(event) => {this.props.onChange(event,this.props.keyV)}} required/>
                    </label>
                </div>
            </div>
        );
    }
}
//subcomponent for createForm component
class CreateFormDrugs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            autorizationNumber: "",
            DosageText: "",
            medicinalProduct: "",
            drugIndication: "",
        }
    }
    render() {
                        //<input type="text" name="autorizationNumber" onChange={this.props.onChange.bind(this,this.props.keyV)} required/>
        return (
            <div>
                Drugs 
                <div className="drugsForm">
                    <label >
                        autorizationNumber
                        <input type="text" name="autorizationNumber" onChange={(event) => {this.props.onChange(event,this.props.keyV)}} required/>
                        DosageText
                        <input type="text" name="DosageText" onChange={(event) => {this.props.onChange(event,this.props.keyV)}}  required/>
                        medicinalProduct
                        <input type="text" name="medicinalProduct" onChange={(event) => {this.props.onChange(event,this.props.keyV)}} required/>
                        drugIndication
                        <input type="text" name="drugIndication" onChange={(event) => {this.props.onChange(event,this.props.keyV)}} required/>
                    </label>
                </div>
            </div>
        );
    }
}

//controlled form react style
class CreateForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            receiveDate: "",
            receiptDate: "",
            safetyReportId: "",
            companyNumber: "",
            numDrugs: [<CreateFormDrugs keyV={"drug?"+0} key={0} onChange={this.handleInputChange.bind(this)}/>],
            numReaction: [<CreateFormReaction onChange={this.handleInputChange.bind(this)} keyV={"reaction?"+0} key={0}/>],
            drugValues: [{}],
            reactionValues: [{}],
        }
    }
    addMoreDrugs() {
        this.setState((prevState) => {
            let a = prevState.numDrugs;
            a.push(<CreateFormDrugs keyV={"drug?"+a.length} key={a.length} onChange={this.handleInputChange.bind(this)}/>);
            let a2 = prevState.drugValues;
            a2.push({})
            return {
                numDrugs: a,
                drugValues: a2,
            }
        })
    }
    deleteDrugs() {
        this.setState((prevState) => {
            if(prevState.numDrugs.length > 1) {
                prevState.numDrugs.pop();
                prevState.drugValues.pop();
                return {
                    numDrugs: prevState.numDrugs,
                    drugValues: prevState.drugValues 
                    
                }
            }
        })
    }
    addMoreReaction() {
        this.setState((prevState) => {
            let a = prevState.numReaction;
            let a2 = prevState.reactionValues;
            a2.push({})
            a.push(<CreateFormReaction onChange={this.handleInputChange.bind(this)} keyV={"reaction?"+a.length} key={a.length}/>);
            return {
                numReaction: a,
                reactionValues: a2,
            }
        })
    }
    deleteReaction() {
        this.setState((prevState) => {
            if(prevState.numReaction.length > 1) {
                prevState.numReaction.pop();
                prevState.reactionValues.pop();
                return {
                    numReaction: prevState.numReaction,
                    reactionValues: prevState.reactionValues 
                }
            }
        })
    }
    handleInputChange(event,key) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if(key) {
            let [keyName,keyVal] = key.split("?");
            
            //console.log(keyName,keyVal,name)
            
            if(keyName === "drug") {
                let newDrugValues = this.state.drugValues;
                let d = this.state.drugValues[keyVal];
                d[name] = value;
                newDrugValues[keyVal] = d;
                this.setState((prevState) => {
                    return {
                        drugValues: newDrugValues
                    }
                })
            } 
            if(keyName === "reaction") {
                let newReactionValues = this.state.reactionValues;
                let d = this.state.reactionValues[keyVal];
                d[name] = value;
                newReactionValues[keyVal] = d;
                this.setState((prevState) => {
                    return {
                        reactionValues: newReactionValues
                    }
                })
            }
        } else {
            this.setState( (prevState) => {
              return {
                  [name]: value
              }
            });
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        let json = {
        	"receiveDate": this.state.receiveDate,
        	"receiptDate": this.state.receiptDate,
        	"patient": {
        		"drugs": [],
        		"reaction": [],
        		"age": this.state.age,
        		"sex": this.state.sex,
        	},
        	"safetyReportId": this.state.safetyReportId,
        	"companyNumber": this.state.companyNumber,
        }
        let drugArr = this.state.drugValues.reduce((acc,val) => {
            acc.push(val)
            return acc;
        },[])
        let reactionArr = this.state.reactionValues.reduce((acc,val) => {
            acc.push(val)
            return acc;
        },[])
        json.patient.drugs = drugArr;
        json.patient.reaction = reactionArr;
            
        //axios.post(url+':8081/events',{ "hey": "SUP"}).then((res) => {
        axios.post(url+':8081/events',json).then((res) => {
            console.log(res);
        }).catch((err) => {
            throw err;
        })
            
        console.log(json)
        console.log(this.state)
    }

    render() {
        return (
            <form className="createForm" onSubmit={this.handleSubmit}>
                <h2>CREATE FORM</h2>
                <label>
                    <ul>
                        <li>
                            receiveDate
                            <input type="text" name="receiveDate" onChange={(event) => {this.handleInputChange(event)}} required/>
                        </li>
                        <li>
                            receiptDate
                            <input type="text" name="receiptDate" onChange={(event) => {this.handleInputChange(event)}} required/>
                        </li>
                        <li>
                            <div>
                                patient
                                <ul>
                                    <li>
                                        {this.state.numDrugs}
                                        <button type="button" onClick={()=>{this.addMoreDrugs()}}>Add more drugs</button>
                                        <button type="button" onClick={()=>{this.deleteDrugs()}}>delete drugs</button>
                                    </li>
                                    <li>
                                        {this.state.numReaction}
                                        <button type="button" onClick={()=>{this.addMoreReaction()}}>Add more reaction</button>
                                        <button type="button" onClick={()=>{this.deleteReaction()}}>delete reaction</button>
                                    </li>
                                    <li>
                                        age
                                        <input type="text" name="age" onChange={(event) => {this.handleInputChange(event)}} required/>
                                    </li>
                                    <li>
                                        sex
                                        <input type="text" name="sex" onChange={(event) => {this.handleInputChange(event)}} required/>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            safetyReportId
                            <input type="text" name="safetyReportId" onChange={(event) => {this.handleInputChange(event)}} required/>
                        </li>
                        <li>        
                            companyNumber
                            <input type="text" name="companyNumber" onChange={(event) => {this.handleInputChange(event)}} required/>
                        </li>
                    </ul>
                </label>
                <button type="button" onClick={this.handleSubmit.bind(this)}> Create </button>
            </form>
        );  
                //<input type="submit" value="Submit" />
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    deleteBPressed(id) {
        axios.delete(url+':8081/events?id='+id).then((res) => {
            /*
            console.log("deleted " + res);
            console.log("THIS",this)
            */
            this.props.getList();
        });
    }
    populateRows (data) {
        if(data !== null) {
            let a = data.reduce((acc,val,i) => {
                acc.push((
                    <section className="mainRow" key={i}>
                        <Rows data={val}/>
                        <button onClick={() => {this.deleteBPressed(val._id)}}> 
                            DELETE THIS EVENT
                        </button>
                    </section>
                ))
                return  acc;
            },[])
        return a;
            
        }
    }
    render() {
        let rows = this.populateRows(this.props.data);
        return (
            <section>
                <CreateForm/>
                {rows}
                <button onClick={this.props.increaseSize}>show 10 more </button>
            </section>
            );
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            listSize: 10
        }
    }
    increaseSize() {
        this.getList(this.state.listSize+10)
        this.setState((prevState) => {
            return {
                listSize: prevState.listSize + 10
            }
        })
    }
    getList(number) {
        console.log("GET LISTTT`")
        axios.get(url+':8081/events?list='+0+"-"+number).then((res) => {
            /*
            console.log("received data")
            console.log(res.data)
            */
             this.setState((prevState) => {
               return {data: res.data}
             })
        }).catch((err) => {
            console.log(err)
        });
    }
    componentDidMount() {
        this.getList(10);
    }
    render() {
        console.log("rendering");
        return(
           <App data={this.state.data} getList={()=> {this.getList(this.state.listSize)}}
           increaseSize={() => {this.increaseSize()}}
           />
            );
    }
}

ReactDOM.render(<Main />, document.getElementById("app"));
