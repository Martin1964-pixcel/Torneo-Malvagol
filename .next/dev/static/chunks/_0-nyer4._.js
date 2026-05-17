(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/sample-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories,
    "sampleMatches",
    ()=>sampleMatches,
    "sampleScorers",
    ()=>sampleScorers,
    "sampleStandings",
    ()=>sampleStandings
]);
const categories = [
    "Novatos Empresarial",
    "Veteranos 30 y Mayores",
    "Novatos Libre"
];
const sampleStandings = [
    {
        category: "Novatos Empresarial",
        teams: [
            {
                name: "Talleres FC",
                pj: 3,
                pg: 2,
                pe: 1,
                pp: 0,
                gf: 12,
                gc: 5,
                pts: 7
            },
            {
                name: "Constructora Norte",
                pj: 3,
                pg: 2,
                pe: 0,
                pp: 1,
                gf: 9,
                gc: 6,
                pts: 6
            },
            {
                name: "Oficinas United",
                pj: 3,
                pg: 1,
                pe: 1,
                pp: 1,
                gf: 7,
                gc: 7,
                pts: 4
            }
        ]
    },
    {
        category: "Veteranos 30 y Mayores",
        teams: [
            {
                name: "Veteranos Culiacán",
                pj: 3,
                pg: 3,
                pe: 0,
                pp: 0,
                gf: 10,
                gc: 3,
                pts: 9
            },
            {
                name: "Deportivo 30+",
                pj: 3,
                pg: 2,
                pe: 0,
                pp: 1,
                gf: 8,
                gc: 5,
                pts: 6
            },
            {
                name: "Real Amigos",
                pj: 3,
                pg: 1,
                pe: 0,
                pp: 2,
                gf: 6,
                gc: 9,
                pts: 3
            }
        ]
    },
    {
        category: "Novatos Libre",
        teams: [
            {
                name: "Malvagol FC",
                pj: 3,
                pg: 2,
                pe: 1,
                pp: 0,
                gf: 11,
                gc: 4,
                pts: 7
            },
            {
                name: "Los Cuali",
                pj: 3,
                pg: 2,
                pe: 0,
                pp: 1,
                gf: 8,
                gc: 6,
                pts: 6
            },
            {
                name: "Buitres FC",
                pj: 3,
                pg: 1,
                pe: 1,
                pp: 1,
                gf: 6,
                gc: 6,
                pts: 4
            }
        ]
    }
];
const sampleScorers = [
    {
        category: "Novatos Empresarial",
        player: "Carlos Medina",
        team: "Talleres FC",
        goals: 6
    },
    {
        category: "Novatos Empresarial",
        player: "Luis Robles",
        team: "Constructora Norte",
        goals: 5
    },
    {
        category: "Veteranos 30 y Mayores",
        player: "Jorge López",
        team: "Veteranos Culiacán",
        goals: 7
    },
    {
        category: "Veteranos 30 y Mayores",
        player: "Ramón Valdez",
        team: "Deportivo 30+",
        goals: 4
    },
    {
        category: "Novatos Libre",
        player: "Ángel Torres",
        team: "Malvagol FC",
        goals: 8
    },
    {
        category: "Novatos Libre",
        player: "Mario Sánchez",
        team: "Los Cuali",
        goals: 5
    }
];
const sampleMatches = [
    {
        category: "Novatos Empresarial",
        home: "Talleres FC",
        away: "Oficinas United",
        date: "Sábado",
        time: "7:00 PM",
        field: "Cancha 1"
    },
    {
        category: "Veteranos 30 y Mayores",
        home: "Veteranos Culiacán",
        away: "Real Amigos",
        date: "Sábado",
        time: "8:00 PM",
        field: "Cancha 2"
    },
    {
        category: "Novatos Libre",
        home: "Malvagol FC",
        away: "Buitres FC",
        date: "Domingo",
        time: "6:00 PM",
        field: "Cancha 1"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://sgnwbhohowvfmqocezrn.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_FrVO3UElMC7U0OtykirGBw_UlLhwAm9");
const supabase = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey) : "TURBOPACK unreachable";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/app/page.tsx'\n\nExpression expected");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
]);

//# sourceMappingURL=_0-nyer4._.js.map