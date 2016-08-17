let a=[2,3,5,76,8,45,5,5,234,5,2,4,5,6,1,645]
console.log(a)
var forceFalse = () => false
a=a.reduce((p,c)=>forceFalse((c!==1)?p.push(c):p.push(999))||p,[])
    // if(c.uuid!==newnode.uuid){
    //   return 
    //console.log(p)
    

console.log(a)
