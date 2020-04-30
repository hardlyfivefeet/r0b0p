const builtin = {
    SQRT([n]) {
        return `Math.sqrt(${n})`;
    },
    ABS([n]) {
        return `Math.abs(${n})`;
    },
    FL00R([n]) {
        return `Math.floor(${n})`;
    },
    CE1L([n]) {
        return `Math.ceil(${n})`;
    },
    R0UND([n]) {
        return `Math.round(${n})`;
    },
    MAX1MUM([list]) {
        return `Math.max(${list})`;
    },
    M1N1MUM([list]) {
        return `Math.min(${list})`;
    },
    UNPR3D1CTABL3() {
        return `Math.random()`;
    },
    PLAC3_AT([list, i, value]) {
        return `${list}.splice(${i}, 0, ${value})`;
    },
    D1SCARD_AT([list, i]) {
        return `${list}.splice(${i}, 1)`;
    },
    R3TR13V3_AT([list, i]) {
        return `${list}[${i}]`;
    },
    SUBST1TUT3([list, i, value]) {
        return `${list}[${i}] = ${value}`;
    },
    S1Z3([list]) {
        return `${list}.length`;
    },
    PLAC3([dict, key, value]) {
        return `${dict}[${key}] = ${value}`;
    },
    D1SCARD([dict, key]) {
        return `delete ${dict}[${key}]`;
    },
    R3TR13V3([dict, key]) {
        return `${dict}[${key}]`;
    },
    C0D3S([dict]) {
        return `Object.keys(${dict})`;
    },
    C0NTA1NS([string, substring]) {
        return `${string}.includes(${substring})`;
    },
    SUBT3XT([string, start, end]) {
        return `${string}.substring(${start}, ${end})`;
    },
    SPL1T([string, separator]) {
        return `${string}.split(${separator})`;
    },
    MAK3_UPP3R([string]) {
        return `${string}.toUpperCase()`;
    },
    MAK3_LOW3R([string]) {
        return `${string}.toLowerCase()`;
    },
};

module.exports = { builtin };
