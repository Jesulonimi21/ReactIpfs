const initialState={
    client:"gooclient"
}

const reducer=(state=initialState,action)=>{
    switch(action.type){
        case "SET_CLIENT":
        return {...state,client:action.client}
    }

    return{...state};
}

export default reducer;