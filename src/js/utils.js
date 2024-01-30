export class queue{
    constructor(){
        this.state=[]
    }
   enqueue(x){
    this.state.push(x)
   }
   dequeue(){
    return this.state.shift()
   }
   undodequeue(x){
    this.state.unshift(x)
   }

   isempty(){
    if(this.state.length===0){
        return true
    }
    else{
        return false
    }
   }
  reset(){
    this.state=[]
  }

}