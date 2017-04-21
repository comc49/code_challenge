let React = require("react")
let ReactDOM = require("react-dom")
let axios = require("axios")
let url = 'https://code-challenge-briankoo.c9users.io';


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

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    deleteBPressed(id) {
        console.log(url+':8081/events?id='+id)
        axios.delete(url+':8081/events?id='+id).then((res) => {
            console.log("deleted " + res);
            console.log("THIS",this)
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
            console.log("received data")
            console.log(res.data)
             this.setState((prevState) => {
               return {data: res.data}
             })
             /*
             this.setState({
               data: JSON.stringify(res.data)  
             })
             */
        }).catch((err) => {
            console.log(err)
        });
    }
    componentDidMount() {
        this.getList(10);
    }
    getMoreData(start,end) {
        axios.get(url+':8081/events?list='+0+"-"+end).then((res) => {
            //let data = JSON.stringify(res.data);
        }).catch((err) => {
            console.log(err);
        });
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
