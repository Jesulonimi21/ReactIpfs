import React, { Component } from 'react';
import './App.css';
import ipfs from './ipfs';
import {connect} from 'react-redux';
import {Aepp} from '@aeternity/aepp-sdk'
import Config from './Config/ContractDetails';
class App extends Component {
  state={
    imageUrl:""
  }
  client=null;
  async componentDidMount(){
  this.getClient().then((cl)=>{
      this.client=cl;
       let dpHash="";
    this.client.call("getUrl",[]).then(value=>{
      console.log(value);
      this.setState({imageUrl:value});
    }).catch(err=>{
      console.error(err);
    })

   });
   
  }
 addFileToIpfs=(file)=>{
    let reader= new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend=()=>{
      ipfs.files.add(Buffer(reader.result),(err,result)=>{
        if(err){
          console.log(err);
          return;
        }
      console.log(result[0].hash);
     this.client.call("putUrl",[result[0].hash]).then((result)=>{
        console.log(result)
     });
      this.setState({imageUrl:result[0].hash})
      this.props.setClient(result[0].hash);
      })
    }
  }


 captureFile=(event)=>{
   console.log(event.target.files);
   const file=event.target.files[0];
   this.addFileToIpfs(file);
 }
  render() {
    return <div>
            <img src={`https://ipfs.io/ipfs/${this.state.imageUrl}`} />
            </div>
  }

getClient=()=>{
  console.log("In client")
new Aepp({parent:window.parent}).then((cClient)=>{
  console.log("Gotten Client");
return cClient.getContractInstance(Config.contractSource,{contractAddress:Config.contractAddress}).catch(err=>{
    console.error(err);
  })
}).catch(err=>{
  console.error(err)
})
}

}



const mapStateToProps=(state)=>{
  return{
    client:state.client
  }

}

const mapDispatchToProps=(dispatch)=>{
  return{
    setClient:(client)=>dispatch({type:"SET_CLIENT",client:client})
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(App);
