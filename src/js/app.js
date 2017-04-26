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
//stateless component to bind function passed in
const DeleteButton = ({func}) => {
    return (
        <button onClick = {func}></button>
        )
    
}
//stateless componet to show drug list
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
//stateless component to show patient list
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
//stateless component that create jsx obj containing reaction
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
    
//stateless component to show rows 
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
    componentWillReceiveProps(nextProps) {
        if(nextProps.data) {
            this.setState((prevState) => {
                return {
                    meddraPrimaryTerm: nextProps.data.meddraPrimaryTerm
                }
            })
        }
    }
    handleChange(event,keyValue) {
        let target = event.target;
        let value = event.value;
        let name = target.name;
        
        this.props.onChange(event,keyValue)
        this.setState((prevState) => {
            return {
                [name]: value
            }
        })
    }
    render() {
        return (
            <div>
                Reaction
                <div className="reactionForm">
                    <label>
                        meddraPrimaryTerm
                        <input type="text" value={this.state.meddraPrimaryTerm} name="meddraPrimaryTerm" onChange={(event) => {this.handleChange(event,this.props.keyV)}} required/>
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
    componentWillReceiveProps(nextProps) {
        if(nextProps.data) {
            console.log("NEXT PROP",nextProps.data)
            this.setState((prevState) => {
               return {
                   autorizationNumber: nextProps.data.autorizationNumber,
                   DosageText: nextProps.data.DosageText,
                   medicinalProduct: nextProps.data.medicinalProduct,
                   drugIndication: nextProps.data.drugIndication,
               } 
            })
        }
    }
    handleChange(event,keyValue) {
        let target = event.target;
        let value = target.value;
        let name = target.name;
        this.setState((prevState) => {
            return {
                [name] : value
            }
        })
        this.props.onChange(event,keyValue);
    }
    render() {
                        //<input type="text" name="autorizationNumber" onChange={this.props.onChange.bind(this,this.props.keyV)} required/>
        return (
            <div>
                Drugs 
                <div className="drugsForm">
                    <label >
                        authorizationNumber
                        <input type="text"  value = {this.state.autorizationNumber} name="autorizationNumber" onChange={(event) => {this.handleChange(event,this.props.keyV)}} required/>
                        DosageText
                        <input type="text" value={this.state.DosageText}  name="DosageText" onChange={(event) => {this.handleChange(event,this.props.keyV)}}  required/>
                        medicinalProduct
                        <input type="text" value={this.state.medicinalProduct}  name="medicinalProduct" onChange={(event) => {this.handleChange(event,this.props.keyV)}} required/>
                        drugIndication
                        <input type="text" value={this.state.drugIndication}  name="drugIndication" onChange={(event) => {this.handleChange(event,this.props.keyV)}} required/>
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
            numDrugs: [<CreateFormDrugs keyV={"drug?"+0} 
                key={0} onChange={this.handleInputChange.bind(this)}/>],
            numReaction: [<CreateFormReaction 
                onChange={this.handleInputChange.bind(this)} keyV={"reaction?"+0} key={0}/>],
            drugValues: [{}],
            reactionValues: [{}],
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data ? nextProps.data.patient ? nextProps.data.patient.drugs ? true: false : false : false) {
            let dValues = [];
            let arr = nextProps.data.patient.drugs.reduce((acc,val,i) => {
                acc.push(<CreateFormDrugs keyV={"drug?"+i} data={val}
                key={i} onChange={this.handleInputChange.bind(this)}/>)
                dValues.push({});
                return acc;
            },[])
            this.setState((prevState) => {
                return {
                    numDrugs: arr,
                    drugValues: dValues,
                    receiveDate: nextProps.data.receiveDate,
                    receiptDate: nextProps.data.receiptDate,
                    safetyReportId: nextProps.data.safetyReportId,
                    companyNumber: nextProps.data.companyNumber,
                    age: nextProps.data.patient.age,
                    sex: nextProps.data.patient.sex,
                }
            });
        }
        if(nextProps.data ? nextProps.data.patient ? nextProps.data.patient.reaction ? true: false : false : false) {
            let rValues = [];
            let arr = nextProps.data.patient.reaction.reduce((acc,val,i) => {
                console.log("REACTION",val)
                acc.push(
                <CreateFormReaction onChange={this.handleInputChange.bind(this)} 
                data = {val} keyV={"reaction?"+i} key={i}/>)
                console.log("VALUE",val)
                rValues.push({})
                return acc;
            },[]);
            this.setState((prevState) => {
                return {
                    numReaction: arr,
                    reactionValues: rValues,
                }
            });
        }
    }
    addMoreDrugs() {
        this.setState((prevState) => {
            let a = prevState.numDrugs;
            a.push(<CreateFormDrugs keyV={"drug?"+a.length} data={this.props.data}
                key={a.length} onChange={this.handleInputChange.bind(this)}/>);
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
            a.push(<CreateFormReaction onChange={this.handleInputChange.bind(this)} 
                data = {this.props.data} keyV={"reaction?"+a.length} key={a.length}/>);
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
        console.log("PLEWASSESHANDLEINPUT")
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if(key) {
            let [keyName,keyVal] = key.split("?");
            
            console.log("KEYNAME!!",keyName,keyVal,name)
            
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
            
        axios.post(url+':8081/events',json).then((res) => {
            console.log(res);
        }).catch((err) => {
            throw err;
        })
    }

    render() {
        console.log(this.state)
        return (
            <form className="createForm" onSubmit={this.handleSubmit}>
                <h2>CREATE FORM</h2>
                <label>
                    <ul>
                        <li>
                            receiveDate
                            <input type="text" value = {this.state.receiveDate}
                                name="receiveDate" onChange={(event) => {this.handleInputChange(event)}} required/>
                        </li>
                        <li>
                            receiptDate
                            <input type="text" value = {this.state.receiptDate}
                                name="receiptDate" onChange={(event) => {this.handleInputChange(event)}} required/>
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
                                        <input type="text" value = {this.state.age} name="age" onChange={(event) => {this.handleInputChange(event)}} required/>
                                    </li>
                                    <li>
                                        sex
                                        <input type="text" value = {this.state.sex} name="sex" onChange={(event) => {this.handleInputChange(event)}} required/>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            safetyReportId
                            <input type="text" value = {this.state.safetyReportId}
                                name="safetyReportId" onChange={(event) => {this.handleInputChange(event)}} required/>
                        </li>
                        <li>        
                            companyNumber
                            <input type="text" value = {this.state.companyNumber}
                                name="companyNumber" onChange={(event) => {this.handleInputChange(event)}} required/>
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
        this.state = {
            updateData: null
        }
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
    updateRow(data) {
        this.setState((prevState) => {
           return {updateData: data}
        })
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
                        <button onClick={() => {this.updateRow(val)}}> 
                            UPDATE THIS EVENT
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
                <CreateForm />
                <CreateForm data={this.state.updateData}/>
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
        return(
           <App data={this.state.data} getList={()=> {this.getList(this.state.listSize)}}
           increaseSize={() => {this.increaseSize()}}
           />
            );
    }
}

ReactDOM.render(<Main />, document.getElementById("app"));
