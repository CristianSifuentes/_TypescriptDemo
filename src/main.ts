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

class Ainmal {
    private _id: number;
    public name: string;

    constructor(id: number, name: string) {
        this._id = id;
        this.name = name;
    }
}

class Sharpe {
    constructor(public id: number, public name: string) {
    }
}

const dog = new Ainmal(1, 'Dog');
const cat = new Sharpe(2, 'Cat');


// basic class

class Car {
    brand: string;
    model: string;
    year: string;

    constructor(brand: string, model: string,year: string){
       this.brand = brand;
       this.model = model;
       this.year = year;

    }

    getDetails(): string {
        return `Brand: ${this.brand}, Model: ${this.model}, Year: ${this.year}`;
    }
}

const myCar = new Car('Toyota', 'Corolla', '2020');
console.log(myCar.getDetails());

// medium
class BankAccount{
    private balance: number;
    constructor(initialBalance: number = 0) {
        this.balance = initialBalance;
    }
    deposit(amount: number): void {
        this.balance += amount;
        console.log(`Deposited: ${amount}`);
    }

    withdraw(amount: number): void {
        if (this.balance >= amount) {
            this.balance -= amount;
            console.log(`Withdrew: ${amount}`);
        } else {
            console.log("Insufficient funds");
        }
    }   
    getBalance(): number {
        return this.balance;
    }
}

const myAccount = new BankAccount(1000);
myAccount.deposit(500);
myAccount.withdraw(200);
console.log(`Balance: ${myAccount.getBalance()}`);

// advanced

class Employee {
    private name: string;
    private position: string;
    private salary: number;

    constructor(name: string, position: string, salary: number) {
        this.name = name;
        this.position = position;
        this.salary = salary;
    }

    promote(newPosition: string, newSalary: number): void {
        this.position = newPosition;
        this.salary = newSalary;
        console.log(`${this.name} has been promoted to ${this.position} with a salary of ${this.salary}`);
    }

    getDetails(): string {
        return `Name: ${this.name}, Position: ${this.position}, Salary: ${this.salary}`;
    }

    calculateAnnualSalary(): number {
        return this.salary * 12;
    }
}

class Manager extends Employee {
    private department: string;

    constructor(name: string, position: string, salary: number, department: string) {
        super(name, position, salary);
        this.department = department;
    }

    getDetails(): string {
        return `${super.getDetails()}, Department: ${this.department}`;
    }   

    calculateAnnualSalary(): number {
        const baseSalary = super.calculateAnnualSalary();
        const bonus = 10000; // Example bonus for managers
        return baseSalary + bonus;
    }
}

class Developer extends Employee {

    constructor(name: string, position: string, salary: number) {
        super(name, position, salary);
    }

    getDetails(): string {
        return `${super.getDetails()}, Role: Developer`;
    }

    calculateAnnualSalary(): number {
        const baseSalary = super.calculateAnnualSalary();
        const bonus = 5000; // Example bonus for developers
        return baseSalary + bonus;
    }
}



const employee = new Employee('Alice', 'Developer', 60000);
console.log(employee.getDetails());
employee.promote('Senior Developer', 80000);
console.log(employee.getDetails());

const manager = new Manager('Bob', 'Manager', 90000, 'Engineering');
console.log(manager.getDetails());

const developer = new Developer('Charlie', 'Developer', 70000);
console.log(developer.getDetails());

// types
// Beginner
interface User {
    // Write your types here
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
    phoneNumber?: string; // Optional property
}

const user1: User = {
    id : 1,
    name : "Alice",
    email: "alice@example.com",
    isAdmin: true
}
const user2: User = {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    isAdmin: false,
    phoneNumber: "123-456-7890"
}

// Intermediate
interface Circle {
    radius: number;
    kind: "circle";
}

interface Square {
    kind: "square";
    sideLength: number;
}

type Shape = Circle | Square;

function calculateArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius * shape.radius;
        case "square":
            return shape.sideLength * shape.sideLength;
        default:
            throw new Error("Unknown shape");
    }
}



// generics