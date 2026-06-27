const hellowworld : () => void = () => {
    console.log("Hello World");
}
hellowworld();

const a = 10;
console.log(a);
let b = 20;
console.log(b);
let isVisuble = true;
console.log(isVisuble);
let name = "John";
console.log(name);

/* CONTRACT */
interface Person {
    username: string;
    age: number;
    gender?: string; // ? -> optional
}


const ob :  Person = { 
    username : 'Max',
    age: 30,
    gender: 'male'
  
}

let myObject: typeof ob;
myObject = {
    username: 'Max',
    age: 30,
}
let otherObject: 
{ 
    username: string, 
    age: number 
};

// *any -> cualquiera
// *unknown -> desconocido

let myAny: any;
let myUnknown: unknown;
console.log(myUnknown as typeof ob);
console.log(myObject);