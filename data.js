// DevFluent Mock Database Data

window.DEFAULT_TUTORIALS = [
    {
        id: 1,
        title: "Understanding Javascript Execution Scope",
        description: "Deep dive into variable lookup chains, execution contexts, lexical scope structures, and global registers.",
        difficulty: "Beginner",
        duration: "5 min",
        category: "JS Core",
        code: `// Lesson: Execution Scope Demo\nlet globalVar = "I am global";\n\nfunction scopeTest() {\n  let localVar = "I am local";\n  console.log("Global access:", globalVar);\n  console.log("Local access:", localVar);\n  return "Lexical Scope Validated!";\n}\n\nconsole.log(scopeTest());`,
        videoTitle: "Lexical Scope Visual Compilation",
        downloaded: false,
        comments: [
            { author: "Sarah Connor", date: "2026-07-10 14:32", text: "This visual timeline really helped clarify how functions capture variables!" },
            { author: "Markus V", date: "2026-07-11 09:12", text: "Does this compile differently inside node.js engines?" }
        ]
    },
    {
        id: 2,
        title: "Javascript Closures and Memory Retention",
        description: "Learn how references to outer lexical scopes are retained even after the outer function finishes executing.",
        difficulty: "Intermediate",
        duration: "8 min",
        category: "JS Advanced",
        code: `// Lesson: Closures Generator\nfunction createCounter() {\n  let count = 0;\n  return {\n    increment: function() {\n      count++;\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter();\nconsole.log("First increment:", counter.increment());\nconsole.log("Second increment:", counter.increment());`,
        videoTitle: "Closures & Garbage Collection",
        downloaded: false,
        comments: [
            { author: "Alan Turing", date: "2026-07-12 11:05", text: "Fascinating explanation of scope memory persistence." }
        ]
    },
    {
        id: 3,
        title: "Asynchronous Code execution and Event Loops",
        description: "An interactive breakdown of microtask queues, callstack execution, setTimeout and async-await resolution pipelines.",
        difficulty: "Advanced",
        duration: "12 min",
        category: "Asynchronous",
        code: `// Lesson: Event Loop Simulation\nconsole.log("1. Script start");\n\nsetTimeout(() => {\n  console.log("4. Timeout callback (Macrotask)");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log("3. Promise resolve (Microtask)");\n});\n\nconsole.log("2. Script end");`,
        videoTitle: "Asynchronous Event Loop Syncing",
        downloaded: false,
        comments: []
    }
];

window.SHOP_PRODUCTS = [
    { id: "pro_upgrade", title: "DevFluent Premium Pro Plan", price: 29.00, desc: "Lifetime access to advanced algorithms tutorials and system architecture schemas." },
    { id: "offline_usb", title: "Offline Study Hardware Pack", price: 49.00, desc: "Includes pre-configured USB Flash drive containing 10GB of video tutorials offline." },
    { id: "ai_token_pack", title: "AI Assistant Tokens Upgrade", price: 15.00, desc: "Adds 5,000 deep analysis tokens to query complex framework logs with the AI agent." }
];

window.LESSON_SUBJECTS = {
    js: {
        title: "JavaScript Lexicals & Scope",
        subtitle: "Understanding JavaScript engine behaviors",
        category: "JS Core",
        content: "JavaScript engine executes code in a two-pass mechanism: Compilation (lookups) and Execution. Variable bindings are stored inside Execution Context blocks. Functions keep outer scope references by creating closures. Be mindful of garbage collection retention when holding outer references.",
        code: `// Lexical Closures Example\nfunction buildMultiplier(factor) {\n  return function(number) {\n    return number * factor;\n  };\n}\nconst double = buildMultiplier(2);\nconsole.log(double(5)); // returns 10`,
        rating: 0,
        reviewsCount: 3
    },
    css: {
        title: "CSS Flexbox & Layout Paradigms",
        subtitle: "Creating beautiful glassmorphism structures",
        category: "Styling Modules",
        content: "Flexbox aligns content along a single flow (axis). Use 'align-items: center' to position components along the cross axis, and 'justify-content' along the main axis. Glassmorphism combines thin transparent borders, backdrop filters (blur), and variable radial HSL gradients to render state-of-the-art interactive containers.",
        code: `.glass-container {\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  backdrop-filter: blur(12px);\n  border-radius: var(--radius-md);\n  padding: 24px;\n}`,
        rating: 0,
        reviewsCount: 4
    },
    html: {
        title: "HTML5 Semantic Design & SEO Hooks",
        subtitle: "Structure elements for modern accessibility",
        category: "Semantic Web",
        content: "Avoid nesting generic divs recursively. Use semantic tags like 'aside' for sidebars, 'header' for top sections, 'main' for main contexts, and 'section' to separate pages. Provide unique ids for active elements to allow programmatic rendering and browser compliance verification.",
        code: `<!-- Semantic HTML Outline -->\n<aside class="sidebar">\n  <nav>\n    <ul class="nav-links">\n      <li><a href="#">Dashboard</a></li>\n    </ul>\n  </nav>\n</aside>`,
        rating: 0,
        reviewsCount: 2
    },
    react: {
        title: "React.js State Sync & Render Cycles",
        subtitle: "Virtual DOM diffing updates",
        category: "Frontend Frameworks",
        content: "React triggers render updates whenever state changes occur. The Virtual DOM structures compare node components changes, patching browser elements without rewriting the absolute tree. Synchronize updates using useEffect hooks to fetch and cache dynamic structures in offline local stores.",
        code: `// Simple State Sync Hook\nimport React, { useState, useEffect } from 'react';\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    console.log("Count synced:", count);\n  }, [count]);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}`,
        rating: 0,
        reviewsCount: 5
    },
    cpp: {
        title: "C++ Memory Addressing & Pointer Blocks",
        subtitle: "Understand low-level compilation structures",
        category: "System Programming",
        content: "C++ manages memory manually. Variables represent block memory addresses, which can be inspected directly using reference operators (&&). Pointers (*) store the memory address of another variable. Allocating dynamic memory (using 'new') registers addresses directly on the heap and requires manual deletion to avoid memory leakage.",
        code: `// C++ Pointer Addresses Demo\n#include <iostream>\nint main() {\n  int age = 21;\n  int* ptr = &age;\n  std::cout << "Value: " << age << "\\n";\n  std::cout << "Address: " << ptr << "\\n";\n  std::cout << "De-referenced: " << *ptr << "\\n";\n  return 0;\n}`,
        rating: 0,
        reviewsCount: 6
    }
};

window.QUIZ_SUBJECTS = {
    js: [
        {
            q: "Which keyword defines block-scoped variables in JavaScript?",
            options: ["var", "let", "global", "scope"],
            answer: 1
        },
        {
            q: "What mechanism is formed when a nested function references variables from its outer lexical scope?",
            options: ["Recursion", "Prototype", "Closure", "Hoisting"],
            answer: 2
        },
        {
            q: "What queue is resolved first in the event loop pipeline?",
            options: ["Macrotask queue", "Microtask queue", "Rendering tasks", "SetTimeout callbacks"],
            answer: 1
        }
    ],
    css: [
        {
            q: "Which property is utilized to blur the backdrop of an element in Glassmorphic designs?",
            options: ["filter: blur()", "backdrop-filter: blur()", "glass-backdrop: blur()", "opacity-blur: true"],
            answer: 1
        },
        {
            q: "What CSS Flexbox declaration centers child items along the cross-axis?",
            options: ["justify-content: center", "align-content: center", "align-items: center", "flex-direction: center"],
            answer: 2
        }
    ],
    html: [
        {
            q: "Which semantic HTML5 tag represents sidebar utility links or secondary tools?",
            options: ["<section>", "<article>", "<aside>", "<div>"],
            answer: 2
        },
        {
            q: "How many H1 tags are recommended per page according to SEO standard guidelines?",
            options: ["Exactly one", "Up to five", "Unlimited", "Zero"],
            answer: 0
        }
    ],
    react: [
        {
            q: "What hook triggers reactive side-effects when dependency values update?",
            options: ["useState", "useMemo", "useEffect", "useCallback"],
            answer: 2
        },
        {
            q: "React component UI updates are triggered by changes in what property?",
            options: ["Variables", "State and Props", "External files", "Virtual DOM directly"],
            answer: 1
        }
    ],
    cpp: [
        {
            q: "What operator retrieves the memory address of a C++ variable?",
            options: ["*", "&", "#", "->"],
            answer: 1
        },
        {
            q: "Which C++ command dynamically requests block allocation on the heap?",
            options: ["malloc", "new", "pointer", "delete"],
            answer: 1
        }
    ]
};
