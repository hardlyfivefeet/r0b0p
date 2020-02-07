# r0b0p

Project for CMSI 488 Spring 2020  
Group: Maddie Louis, Merissa Tan, Adriana Donkers

Have you ever written JavaScript and wished it felt more robotic? Beep boop bop? Have you ever felt like Elon Musk, and you're trapped in a simulation? Then r0b0p is the language for you. r0b0p is inspired by JavaScript, and is a fun scripting language in which you can write complex programs while having a good time doing so.

## Notable Features

- Scripting Language
- Dynamically Typed
- Full type inference

## JavaScript vs. r0b0p

#### Printing to the console

```
console.log("Hello, world!")                  SP3AK["Hello, world!"]
```

#### Assignments

#### Booleans

```
true                                          b1p
false                                         b0p
let x = true;                                 x = b1p;
let y = false;                                y = b0p;
```

#### Loops

```
for (let i = 0; i < 10; i++) {                C0UNT[i:0->10] {
  console.log(i);                               SP3AK[i];
}                                             }
```

## Example Programs

```Javascript
function areaOfCircle(r) {
  return Math.PI * r * r;
}
```

```r0b0p
PR0GRAM area_of_circle[r] {
  G1V3 Math.PI TIMES r TIMES r;
}
```

```Javascript
let x = 3;
if(x < 6) {
  console.log("X is less than 6!");
}
```

```r0b0p
x = 3;
PR3SUM1NG[x < 6] {
	SP3AK["X is less than 6!"];
}
```
