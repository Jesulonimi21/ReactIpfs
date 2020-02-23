import React, { Component } from 'react';
import './App.css';
import buffer from 'buffer';
import ipfs from './an';
import {connect} from 'react-redux';
import {Aepp} from '@aeternity/aepp-sdk'
import Config from './Config/ContractDetails';
class App extends Component {
  state={
    imageUrl:""
     }
  client=null;
  // async componentDidMount(){
  // this.getClient().then((cl)=>{
  //     this.client=cl;
  //      let dpHash="";
  //   this.client.call("getUrl",[]).then(value=>{
  //     console.log(value);
  //     this.setState({imageUrl:value});
  //   }).catch(err=>{
  //     console.error(err);
  //   })

  //  });
   
  // }



 addFileToIpfs=(file)=>{
  
   // var ipfs = window.IpfsApi('ipfs.infura.io', '5001');
   
    console.log(ipfs,"ipfs");
    const fileType = file.type;
    const prefix = `data:${fileType};base64,`;
    let reader= new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend=()=>{
      ipfs.add(prefix+this.base64ArrayBuffer(Buffer(reader.result)),(err,result)=>{
        if(err){
          console.log(err);
          return;
        }

      console.log(result,"Am hashz");
    //  this.client.call("putUrl",[result[0].hash]).then((result)=>{
    //     console.log(result)
    //  });
      this.setState({imageUrl:result[0].hash})
      console.log(this.state.imageUrl);
      this.props.setClient(result);
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
             <input type="file" onChange={this.captureFile}/>

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

base64ArrayBuffer(arrayBuffer) {
   let base64 = '';
   const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

   const bytes = new Uint8Array(arrayBuffer);
   const byteLength = bytes.byteLength;
   const byteRemainder = byteLength % 3;
   const mainLength = byteLength - byteRemainder;

   let a;
   let b;
   let c;
   let d;
   let chunk;

   // Main loop deals with bytes in chunks of 3
   for (let i = 0; i < mainLength; i += 3) {
     // Combine the three bytes into a single integer
     chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

     // Use bitmasks to extract 6-bit segments from the triplet
     a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
     b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
     c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
     d = chunk & 63; // 63       = 2^6 - 1

     // Convert the raw binary segments to the appropriate ASCII encoding
     base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
   }

   // Deal with the remaining bytes and padding
   if (byteRemainder === 1) {
     chunk = bytes[mainLength];

     a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

     // Set the 4 least significant bits to zero
     b = (chunk & 3) << 4; // 3   = 2^2 - 1

     base64 += `${encodings[a]}${encodings[b]}==`;
   } else if (byteRemainder === 2) {
     chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

     a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
     b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

     // Set the 2 least significant bits to zero
     c = (chunk & 15) << 2; // 15    = 2^4 - 1

     base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
   }

   return base64;
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
