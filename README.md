![r0b0p logo](images/r0b0p.png)

# 🅁🄌🄱🄌🄿

Project for CMSI 488 Spring 2020  
Group: Adriana Donkers, Maddie Louis, Merissa Tan

Have you ever written JavaScript and wished it felt more robotic? Beep boop bop? Have you ever felt like Elon Musk, and you're trapped in a simulation? Then r0b0p is the language for you. r0b0p is inspired by JavaScript, and is a fun scripting language in which you can write complex programs while having a good time doing so.

## Notable Features

- Scripting Language
- Dynamically Typed
- Dictionaries and lists
- String Interpolation
- Escape sequences
- Beep boop bop

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

#### Printing to the console

```
console.log("Hello, world!");                 SP3AK["Hello, world!"];
```

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

#### Lists

```
let x = [1, 2, 3, 4];                         x = {1, 2, 3, 4};
x[0] = 100;                                   SUBST1TUT3[x, 0, 100];
x.splice(2, 0, 5);                            PLAC3_AT[x, 2, 5];
x.splice(3, 1);                               D1SCARD_AT[x, 3];
let value = x[0];                             value = R3TR13V3_AT[x, 0];
let arrayLength = x.length;                   array_length = S1Z3[x];
```

#### Dictionaries

```
let y = {a: 1, b: 2};                         y = {a: 1, b: 2};
y[a] = 5;                                     SUBST1TUT3[y, a, 5];
y[c] = 3;                                     PLAC3[y, c, 3];
delete y[a];                                  D1SCARD[y, a];
let value = y[a];                             value = R3TR13V3[y, a];
console.log(Object.keys(y));                  SP3AK[C0D3S[y]];
```

#### Conditionals

```
let x = 3;                                    x = 3;
if (x < 6) {                                  PR3SUM1NG[x < 6] <
  console.log("X is less than 6!");             SP3AK["X is less than 6!"];
}                                             >
```

#### Loops

```
for (let i = 0; i < 10; i++) {                C0UNT[i:0->10] <
  console.log(i);                               SP3AK[i];
}                                             >


let x = 0;                                    x = 0;
while (x < 6) {                               WH1L3[x < 6] <
  console.log("Adding to x");                   SP3AK["Adding to x"];
  x++;                                          x = x + 1;
}                                             >
```

#### Comments

r0b0p does not support multi-line comments. Just add more dots!

```
// This is a comment!                         ...This is a comment!
```

#### String Interpolation

```
let bananas = 3;                              bananas = 3;
console.log(`I have ${bananas} bananas`);     SP3AK["I have 'bananas' bananas"];

let quote = "Hello, world!"                   quote = "Hello, world!"
console.log(`She said \'${quote}\'`);         SP3AK["She said \''quote'\'"];
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
PR0GRAM area_of_circle[r] <
  G1V3 3.14159265 * r * r;
>

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
PR0GRAM gcd[a, b] <
  PR3SUM1NG[b == 0] <
    G1V3 a;
  >
  G1V3 gcd[b, (a % b)];
>
```

#### Fibonacci

```
function fibb(n) {
    if(n <= 2) {
        return 1;
    } else {
        return fibb(n - 1) + fibb(n - 2);
    }
};
```

```r0b0p
PR0GRAM fibb[n] <
  PR3SUM1NG[n <= 2] <
    G1V3 1;
  > 3LS3 <
    G1V3 fibb[n - 1] + fibb[n - 2];
  >
>
```

#### FizzBuzz

```
for (let i = 1; i <= 20; i++) {
    if (i % 15 == 0)
        console.log("FizzBuzz");
    else if (i % 3 == 0)
        console.log("Fizz");
    else if (i % 5 == 0)
        console.log("Buzz");
    else
        console.log(i);
}
```

```r0b0p
C0UNT[i:1->21] <
    PR3SUM1NG[i % 15 == 0] <
        SP3AK["FizzBuzz"];
    > 3LS3 1F[i % 3 == 0] <
        SP3AK["Fizz"];
    > 3LS3 1F[i % 5 == 0] <
        SP3AK["Buzz"];
    > 3LS3 <
        SP3AK[i];
    >
>
```

#### Collatz

```
function collatzSteps(n) {
  let steps = 0;
  while(n !== 1) {
    if(n % 2 === 0) {
      n /= 2;
    } else {
      n = (3 * n) + 1;
    }
    steps++;
  }
  return steps;
};
```

```r0b0p
PR0GRAM collatzSteps[n] <
  steps = 0;
  WH1L3[N0T (n == 1)] <
    PR3SUM1NG[n % 2 == 0] <
      n = n / 2;
    > 3LS3 <
      n = (3 * n) + 1;
    >
    steps = steps + 1;
  >
  G1V3 steps;
>
```

#### Powers

```
function powers(base, limit, callback) {
  let current = 1;
  let i = 1;
  while (current <= limit) {
    callback(current);
    current = base ** i;
    i++;
  }
}
```

```r0b0p
PR0GRAM powers[base, limit, callback] <
  current = 1;
  i = 1;
  WH1L3[current <= limit] <
    callback[current];
    current = base ** i;
    i = i + 1;
  >
>
```

#### PiSolver

```
const RADIUS = 1;

function calculatePi(numDarts) {
  numDartsInCircle = throwDarts(numDarts);
  return (4 * (numDartsInCircle / numDarts));
}

function throwDarts(numDarts) {
  let circleCount = 0;
  for (let dartsThrown = 0; dartsThrown < numDarts; dartsThrown++) {
    if (throwDart() < RADIUS) {
      circleCount++;
    }
  }
  return circleCount;
}

function throwDart() {
  let x = (Math.random() * 2);
  let y = (Math.random() * 2);
  return calculateDistanceFromCenter(x, y);
}

function calculateDistanceFromCenter(x, y) {
  return Math.sqrt(Math.pow(x - RADIUS, 2) + Math.pow(y - RADIUS, 2));
}
```

```r0b0p
RADIUS = 1;

PR0GRAM calculate_pi[num_darts] <
  num_darts_in_circle = throw_darts[num_darts];
  G1V3 (4 * (num_darts_in_circle / num_darts));
>

PR0GRAM throwDarts[num_darts] <
  circle_count = 0;
  C0UNT[darts_thrown:0->num_darts] <
    PR3SUM1NG[throw_dart[] < RADIUS] <
      circle_count = circle_count + 1;
    >
  >
  G1V3 circle_count;
>

PR0GRAM throw_dart[] <
  x = UNPR3D1CTABL3 * 2;
  y = UNPR3D1CTABL3 * 2;
  G1V3 calculate_distance_from_center[x, y];
>

PR0GRAM calculate_distance_from_center[x, y] <
  G1V3 SQRT[((x - RADIUS) ** 2) + ((y - RADIUS) ** 2)];
>
```

#### Average of Triples

```
function tripleAverages(arr) {
  let averages = [];
  for (int i = 0; i < arr.length - 2; i++) {
    let ave = (arr[i] + arr[i + 1] + arr[i + 2]) / 3;
    averages.push(ave);
  }
}
```

```
PR0GRAM triple_averages[arr] <
  averages = {};
  arr_length = S1Z3[arr];
  C0UNT[i:0->arr_length] <
    ave = (R3TR13V3_AT[arr, i] + R3TR13V3_AT[arr, i + 1] + R3TR13V3_AT[arr, i + 2]) / 3;
    PLAC3_AT[averages, i, ave];
  >
>
```
