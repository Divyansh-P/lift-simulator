
let floors=document.querySelector('#floorinp')
let lifts=document.querySelector('#liftinp')
const generatebutton=document.querySelector('#generate')
const container=document.querySelector('.container')
let liftarray=[]
let checkLoop;
let w;
let maxl;
let minv=1
let minv2=2
let f=1
class queue{
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
   ispresent(x){
    this.state.map(y=>{
        if(y==x){
            return true
        }
    })
    return false
   }
  reset(){
    this.state=[]
  }

}



let q=new queue()



const createfloors=()=>{    
container.innerHTML=""

for(let i=floors.value;i>0;i--){
    container.append(createFloorEl(i))
}
 }


 const createlifts=()=>{
    const floor=document.querySelector('#floor1')
    liftarray=[]
    for(let i=1;i<=lifts.value;i++){
        floor.append(createliftEl(i))
    }
 }



const createliftEl=(i)=>{
    
    const liftel=document.createElement('div')
    liftel.classList.add('liftcontainer')
    liftel.setAttribute("id", `l${i}`);
    liftel.innerHTML+=`
    <div class="leftdoor" id="leftdoor${i}"></div>
    <div class="rightdoor" id="rightdoor${i}"></div>
    `

    let liftObj={
        id:i,
        lift:liftel,
        currentFloor:1,
        moving:false
    }
     
    liftarray.push(liftObj)

    return liftel
}


 const createFloorEl=(floor)=>{
    const floorel=document.createElement('div')
    floorel.classList.add('floor')
    floorel.setAttribute("id", `floor${floor}`);
 if(floor===floors.value){
   floorel.innerHTML+=`
   <div class="floorbutton">
    <button class="buttondown" id="buttondown${floor}">Down</button>
</div>
<div class="floornumber">
    ${floor}
</div>
   `
 }
 else if(floor===1){
    floorel.innerHTML+=`
    <div class="floorbutton">
     <button class="buttonup" id="buttonup${floor}">Up</button>
 </div>
 <div class="floornumber">
     ${floor}
 </div>
    `
 }
 else{
    floorel.innerHTML+=`
    <div class="floorbutton">
    <button class="buttonup" id="buttonup${floor}">Up</button>
    <button class="buttondown" id="buttondown${floor}">Down</button>
    
 </div>
 <div class="floornumber">
     ${floor}
 </div>
    `
 }
return floorel
 }

 generatebutton.addEventListener('click',()=>{
    if(lifts.value>maxl||lifts.value<minv){
        alert(`invalid lift input select between 1 to ${maxl}`)
        return
    }
    if(floors.value<minv2){
        alert(`invalid floor input select value > 2 `)
        return
    }
 
    clearInterval(checkLoop)
    q.reset()
    createfloors()
    createlifts()
    callbuttonhandler()
    checkLoop=setInterval(checkstatus,100)
})


 const addtoqueue=(e)=>{
   const id=e.target.id
   let n=0
   if(id.startsWith('buttonup')){
    n=+(id.substr(8))
   }
   else{
    n=+(id.substr(10))
   }
   
    q.enqueue(n)
   
   
 }

const callbuttonhandler=()=>{

    const upbuttonlist=document.querySelectorAll('.buttonup')
    const downbuttonlist=document.querySelectorAll('.buttondown')

    for(let btn of upbuttonlist){
      
        btn.addEventListener('click',addtoqueue)
    }
    for(let btn of downbuttonlist){
        btn.addEventListener('click',addtoqueue)
    }
}

const closeDoor=(e)=>{
let targetId=e.target.id
let lift_no=targetId.substr(9)

let leftdoor=document.querySelector(`#leftdoor${lift_no}`)
let rightdoor=document.querySelector(`#rightdoor${lift_no}`)
rightdoor.removeEventListener('webkitTransitionEnd',closeDoor)
leftdoor.style.transform = `translateX(0)`;
rightdoor.style.transform = `translateX(0)`;
leftdoor.style.transition = `all 2.5s ease-out`;
rightdoor.style.transition = `all 2.5s ease-out`;
setTimeout(() => {
    makeLiftIdle(lift_no);
  }, 2500);
}

const makeLiftIdle=(lift_no)=>{
for(let lift of liftarray){
    if(lift.id==lift_no){
        lift.moving=false
    }
}

}


const Opendoor=(e)=>{
let targetId=e.target.id
let lift_no=targetId.substr(1)
let lift=document.querySelector(`#l${lift_no}`)
lift.removeEventListener('webkitTransitionEnd',Opendoor)
let leftdoor=document.querySelector(`#leftdoor${lift_no}`)
let rightdoor=document.querySelector(`#rightdoor${lift_no}`)
leftdoor.removeEventListener("webkitTransitionEnd", Opendoor);
rightdoor.removeEventListener("webkitTransitionEnd", Opendoor);
rightdoor.addEventListener('webkitTransitionEnd',closeDoor)
leftdoor.style.transform = `translateX(-100%)`;
rightdoor.style.transform = `translateX(100%)`;
leftdoor.style.transition = `all 2.5s ease-out`;
rightdoor.style.transition = `all 2.5s ease-out`;
}

const movelift=(lift,floor)=>{
let distance=-1*(floor-1)*100
let lift_no=lift.id
let from=lift.currentFloor
lift.currentFloor=floor
lift.moving=true
let lft=lift.lift
lft.addEventListener('webkitTransitionEnd',Opendoor)
let absdistance=Math.abs(floor-from)
lft.style.transform=`translateY(${distance}%)`
let time=2*absdistance
if(time===0){
    let e={}
    e.target={}
    e.target.id=`l${lift_no}`
    Opendoor(e)
}
lft.style.transition=`transform  ease-in-out ${time}s`
}


const getNearestLift=(floor)=>{
let nearestlift;
let minDistance=Infinity

let f=0;

for(let lift of liftarray){
    if(lift.moving&&lift.currentFloor==floor){
      nearestlift=404
      f=1;
    }
}
if(f==0){
    for(let lift of liftarray){
        if(!lift.moving&&Math.abs(floor-lift.currentFloor<minDistance)){
            minDistance=Math.abs(floor-lift.currentFloor)
            nearestlift=lift
        }
    }
}

return nearestlift
}

const checkstatus=()=>{
   
    if(q.isempty()){
        return

    }
  let floor=q.dequeue()
  let lift=getNearestLift(floor)
  if(!lift){
    q.undodequeue(floor)
    return
  }
  if(lift==404){
    return
  }
  
movelift(lift,floor)
}

const maxdecider=()=>{
    w=window.innerWidth
   const inp=document.querySelector('#liftinp')
   if(w>480){
    maxl=11
   inp.setAttribute('max',11)
   }
   else{
    inp.setAttribute('max',3)
    maxl=3
   }
}
maxdecider()

