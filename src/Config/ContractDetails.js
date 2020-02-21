const contractSource="ct_2qiF2CexEuKSsZYNykmZYxM2RhJZt4n3WbeZEhbeeoy8CjD2AK";
const contractAddress=`
contract SaveImage=
  record state={
    url:string
      }
  
  stateful entrypoint init()={url=""}
   
  stateful entrypoint putUrl(url':string)=
    put(state{url=url'})
  
  
  entrypoint getUrl():string=
    state.url
`;

export default {
    contractSource,contractAddress
};