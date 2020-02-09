![r0b0p logo](images/r0b0p.png)

Project for CMSI 488 Spring 2020  
Group: Adriana Donkers, Maddie Louis, Merissa Tan

Have you ever written JavaScript and wished it felt more robotic? Beep boop bop? Have you ever felt like Elon Musk, and you're trapped in a simulation? Then r0b0p is the language for you. r0b0p is inspired by JavaScript, and is a fun scripting language in which you can write complex programs while having a good time doing so.

## Notable Features

- Scripting Language
- Dynamically Typed
- Full type inference
- Escape sequences

## Primitive Types

- `b00l` (boolean)
- `l3tt3r` (char)
- `d1g1ts` (number)
- `uncl3ar` (undefined)

## Reference Types

- `t3xt` (string)
- `l1st` (list)
- `d1ct` (dictionary)

## JavaScript vs. r0b0p

#### Operators

```
3 + 5                                         3 + 5
10 - 3                                        10 - 3
3 * 8                                         3 * 8
21 / 7                                        21 / 7

x && y                                        x && y
x || y                                        x || y

x < y                                         x < y
x > y                                         x > y
x <= y                                        x <= y
x >= y                                        x >= y
x === y                                       x == y
x !== y                                       N0T (x == y)
x = -8                                        x = -8
```

#### Reference Types

```
let x = [1, 2, 3, 4];                         x = {1, 2, 3, 4};
let y = {a: 1, b: 2};                         y = {a: 1, b: 2};
let z = "Hello world!";                       z = "Hello world!";
```

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

#### Conditionals

```
let x = 3;                                    x = 3;
if (x < 6) {                                  PR3SUM1NG[x < 6] {
  console.log("X is less than 6!");             SP3AK["X is less than 6!"];
}                                             }
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

#### Comments

r0b0p does not support multi-line comments. Just add more dots!

```
// This is a comment!                         ...This is a comment!
```

## Example Programs

#### Getting the area of a circle:

```
function areaOfCircle(r) {
  return Math.PI * r * r;
}

let area = areaOfCircle(10);
```

```r0b0p
PR0GRAM area_of_circle[r] {
  G1V3 3.14159265 * r * r;
}

area = area_of_circle[10];
```

#### GCD

```
function gcd(a, b) {
  if (b === 0)
    return a;
  else
    return gcd(b, (a % b));
}
```

```r0b0p
PR0GRAM gcd[a, b] {
  PR3SUM1NG[b == 0] {
    G1V3 a;
  }
  G1V3 gcd[b, (a % b)];
}
```

#### Fibonacci

```
var fibb = function(n) {
    if(n <= 2) {
        return 1;
    } else {
        return fibb(n - 1) + fibb(n - 2);
    }
};
```

```r0b0p
PR0GRAM fibb[n] {
  PR3SUM1NG[n <= 2] {
    G1V3 1;
  } 3LS3 {
    G1V3 fibb[n - 1] + fibb[n - 2];
  }
}
```
