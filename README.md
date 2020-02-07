![r0b0p logo](images/r0b0p.png)

Project for CMSI 488 Spring 2020  
Group: Maddie Louis, Merissa Tan, Adriana Donkers

Have you ever written JavaScript and wished it felt more robotic? Beep boop bop? Have you ever felt like Elon Musk, and you're trapped in a simulation? Then r0b0p is the language for you. r0b0p is inspired by JavaScript, and is a fun scripting language in which you can write complex programs while having a good time doing so.

## Notable Features

- Scripting Language
- Dynamically Typed
- Full type inference

## Primitive Types

- `b00l` (boolean)
- `l3tt3r` (char)
- `d1g1ts` (number)
- `uncl3ar` (undefined)

## Reference Types

- `t3xt`

## JavaScript vs. r0b0p

#### Printing to the console

```
console.log("Hello, world!")                  SP3AK["Hello, world!"]
```

#### Assignments

```
let numOfMembers = 3;                         num_of_members = 3;
let name = "r0b0p";                           name = "r0b0p";
const AGE_TOTAL = 62;                         AGE_TOTAL = 62;
```

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


let x = 0;                                    x = 0;
while (x < 6) {                               WH1L3[x < 6] {
  console.log("Adding to x");                   SP3AK["Adding to x"];
  x++;                                          x = x + 1;
}                                             }
```

## Example Programs

#### Getting the area of a circle:

```
function areaOfCircle(r) {
  return Math.PI * r * r;
}
```

```r0b0p
PR0GRAM area_of_circle[r] {
  G1V3 Math.PI * r * r;
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
