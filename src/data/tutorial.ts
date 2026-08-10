/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from '../types';

export interface OutputQuiz {
  id: string;
  language: string;
  code: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const tutorialLessons: Lesson[] = [
  {
    id: 'py-basics',
    title: 'Python Program Basics',
    category: 'python',
    concept: 'Variables & Print',
    text: 'In Python, we declare variables by simply assigning a value. No types needed. We print values using the `print()` function.',
    codeSnippet: 'name = "CodeSolver"\nage = 15\nprint("Welcome to " + name)\nprint("Age:", age)',
    exercise: {
      id: 'py-ex1',
      title: 'Greeting Card Maker',
      description: 'Create a variable called `greeting` and set it to your favorite phrase, then print it out.',
      startingCode: '# Write your code below\n',
      testPrompt: 'Verify if print() works nicely with variables.'
    }
  },
  {
    id: 'py-loops',
    title: 'Python Loops & Lists',
    category: 'python',
    concept: 'For Counters',
    text: 'A `for` loop in Python iterates over a sequence like a list or a range of numbers. Notice the clean indentation!',
    codeSnippet: 'languages = ["Python", "JavaScript", "C++"]\nfor lang in languages:\n    print("I can solve " + lang)',
    exercise: {
      id: 'py-ex2',
      title: 'Counting to Five',
      description: 'Write a loop that prints numbers from 1 to 5.',
      startingCode: '# Use a range loop\nfor i in range(1, 6):\n    ',
      testPrompt: 'Confirm numbers 1 to 5 print consecutively.'
    }
  },
  {
    id: 'java-basics',
    title: 'Java Class Boilerplate',
    category: 'java',
    concept: 'Types & Classes',
    text: 'Java is strongly typed and completely class-based. Every executable line must exist within a class and a `main` method.',
    codeSnippet: 'public class Main {\n    public static void main(String[] args) {\n        int hours = 24;\n        System.out.println("Hours per day: " + hours);\n    }\n}',
    exercise: {
      id: 'java-ex1',
      title: 'Write public static void main',
      description: 'Print "Java Learner" inside the main function.',
      startingCode: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
      testPrompt: 'Check if System.out.println compiles and outputs correctly.'
    }
  },
  {
    id: 'cpp-basics',
    title: 'C++ Structures & I/O',
    category: 'cpp',
    concept: 'Pointers & Std',
    text: 'C++ uses `#include <iostream>` for input/output streaming with `std::cout` and standard namespace structures.',
    codeSnippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int count = 5;\n    cout << "Item Count: " << count << endl;\n    return 0;\n}',
    exercise: {
      id: 'cpp-ex1',
      title: 'C++ Custom Hello',
      description: 'Output "Hello CodeSolver" with std::cout streaming.',
      startingCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Print here\n    \n    return 0;\n}',
      testPrompt: 'Ensure cout with streaming shifts works correctly.'
    }
  },
  {
    id: 'web-elements',
    title: 'Web Dev: HTML & CSS',
    category: 'web',
    concept: 'Document Structure',
    text: 'Modern web starts with standard tags like `div`, `p`, and Tailwind color styles. Tailwind styles allow instant, modular component visuals.',
    codeSnippet: '<div class="bg-indigo-900/40 p-4 border border-indigo-500 rounded-xl">\n  <h1 class="text-xl font-bold text-cyan-400">Hello Web</h1>\n  <p class="text-gray-300">Fast responsive layout details!</p>\n</div>',
    exercise: {
      id: 'web-ex1',
      title: 'Styled Hero Box',
      description: 'Create an interactive banner with a primary background, clean padding, and a styled button.',
      startingCode: '<div class="...">\n  <!-- Add content -->\n</div>',
      testPrompt: 'Verify borders, buttons, and custom padding.'
    }
  },
  {
    id: 'js-basics',
    title: 'JavaScript Asynchronous Control',
    category: 'javascript',
    concept: 'Promises & Async',
    text: 'Promises represent the eventual completion or failure of an asynchronous operation and its resulting value in modern JS.',
    codeSnippet: 'const fetchData = () => {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve("Data fetched!"), 500);\n  });\n};\nfetchData().then(console.log);',
    exercise: {
      id: 'js-ex1',
      title: 'Async Greet Maker',
      description: 'Create an async function that returns a resolved promise with "Hello JS" and run it.',
      startingCode: 'async function greet() {\n  return "Hello JS";\n}\n// Run execution\n',
      testPrompt: 'Verify async promise resolution logs output successfully.'
    }
  },
  {
    id: 'rust-basics',
    title: 'Rust Memory Ownership',
    category: 'rust',
    concept: 'Borrow Checker & Refs',
    text: 'Rust manages memory through a secure system of ownership with explicit scoping rules checked strictly by the borrow compiler.',
    codeSnippet: 'fn main() {\n    let s1 = String::from("hello");\n    let s2 = s1; // ownership moved\n    // println!("{}", s1); // compiler error!\n    println!("{}", s2);\n}',
    exercise: {
      id: 'rust-ex1',
      title: 'Borrowing Struct Reference',
      description: 'Pass resources by referencing with & borrows so that s1 is still accessible.',
      startingCode: 'fn main() {\n    let s1 = String::from("Rust Lifetime");\n    print_length(&s1);\n}',
      testPrompt: 'Verify code avoids move violations using references.'
    }
  },
  {
    id: 'go-basics',
    title: 'Go Goroutines Channels',
    category: 'go',
    concept: 'Lightweight Threads',
    text: 'Go utilizes concurrent Goroutines (extremely low capacity channels) to coordinate tasks via lightweight thread pathways.',
    codeSnippet: 'package main\nimport "fmt"\n\nfunc main() {\n    ch := make(chan string)\n    go func() { ch <- "Hello Go" }()\n    fmt.Println(<-ch)\n}',
    exercise: {
      id: 'go-ex1',
      title: 'Double Sender Channel',
      description: 'Initialize a safe sender channel and route the integer value 42 cleanly inside.',
      startingCode: 'package main\nimport "fmt"\nfunc main() {\n    ch := make(chan int)\n    // send to channel\n}',
      testPrompt: 'Confirm channel receives values without locking thread registers.'
    }
  },
  {
    id: 'kotlin-basics',
    title: 'Kotlin Null Safety Systems',
    category: 'kotlin',
    concept: 'Safe Optionals',
    text: 'Kotlin prevents NullPointer crashes by specifically tracking nullability inside the static compiler registers.',
    codeSnippet: 'fun main() {\n    var text: String = "Kotlin Platform"\n    // text = null // compiler error\n    var nullableText: String? = null // permitted\n    println(text)\n}',
    exercise: {
      id: 'kot-ex1',
      title: 'Elvis Operator Checks',
      description: 'Handle nullable parameters using standard safe-calls ?. and Elvis operators ?:.',
      startingCode: 'fun getLength(str: String?): Int {\n    return str?.length ?: 0\n}',
      testPrompt: 'Test null safety registers avoid compilation exceptions.'
    }
  },
  {
    id: 'swift-basics',
    title: 'Swift safe optional unwrappings',
    category: 'swift',
    concept: 'Guard-Let statement patterns',
    text: 'Swift is focused on strict compiler bindings requiring guarded scopes or optional unwrapping let bindings prior to code evaluation.',
    codeSnippet: 'let platform: String? = "Swift Core"\nif let unwrapped = platform {\n    print("Loaded \\(unwrapped)")\n}',
    exercise: {
      id: 'swi-ex1',
      title: 'Safeguard validation bounds',
      description: 'Implement a safety guard-let statement inside target handler scopes.',
      startingCode: 'func login(user: String?) {\n    guard let name = user else { return }\n    print(name)\n}',
      testPrompt: 'Validate Swift guard statements compiling cleanly.'
    }
  },
  {
    id: 'sql-basics',
    title: 'SQL Relational Operations',
    category: 'sql',
    concept: 'Relational Joins',
    text: 'Structured Query Language uses INNER, LEFT, or RIGHT JOIN components to aggregate disparate database registers logically.',
    codeSnippet: 'SELECT u.name, o.id\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nWHERE o.amount > 100;',
    exercise: {
      id: 'sql-ex1',
      title: 'Task Table Left Joins',
      description: 'Formulate SQL selections to left join table schemas with project identifiers.',
      startingCode: 'SELECT * FROM tasks t\nLEFT JOIN projects p ON -- complete match condition\n',
      testPrompt: 'Analyze join predicates aligning schemas appropriately.'
    }
  },
  {
    id: 'bash-basics',
    title: 'Bash Shell Utility Automation',
    category: 'bash',
    concept: 'Command Prompt Scripts',
    text: 'Bash is standard for pipeline setups. Reference variables with standard $ keys and ensure commands avoid spacing around equality.',
    codeSnippet: '#!/bin/bash\nDEPLOY_ENV="Production Container"\necho "Bootstrapping servers for: $DEPLOY_ENV"',
    exercise: {
      id: 'bash-ex1',
      title: 'Graceful Error Returns',
      description: 'Setup standard failure exit codes using custom parameters.',
      startingCode: '#!/bin/bash\nERR_CODE=1\n# exit command here\n',
      testPrompt: 'Assert shell runner responds correctly to customized execution exits.'
    }
  }
];

export const outputQuizzes: OutputQuiz[] = [
  {
    id: 'q1',
    language: 'Python',
    code: 'x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)',
    options: ['[1, 2, 3]', '[1, 2, 3, 4]', 'Error', 'None'],
    correctAnswer: '[1, 2, 3, 4]',
    explanation: 'In Python, lists are passed by reference. Assigning x to y means they both refer to the exact same list. Appending 4 to y changes x too!'
  },
  {
    id: 'q2',
    language: 'JavaScript',
    code: 'const res = 1 + "2" - 1;\nconsole.log(res);',
    options: ['11', '12', '121', 'NaN'],
    correctAnswer: '11',
    explanation: 'First, 1 + "2" does string concatenation yielding the string "12". Then, string subtraction coerced "12" back into a number and subtracted 1, yielding 11!'
  },
  {
    id: 'q3',
    language: 'C++',
    code: 'int a = 5;\nint b = 2;\nfloat c = a / b;\ncout << c;',
    options: ['2.5', '2.0', '2', 'Error'],
    correctAnswer: '2',
    explanation: 'Integer division between 5 and 2 happens first, which truncates to 5 / 2 = 2. Only then is it cast to float, resulting in 2.0 (rendered as 2).'
  },
  {
    id: 'q4',
    language: 'Java',
    code: 'String s1 = "hello";\nString s2 = new String("hello");\nSystem.out.println(s1 == s2);',
    options: ['true', 'false', 'compile error', 'runtime error'],
    correctAnswer: 'false',
    explanation: 'The == operator in Java checks for referential equality (whether they are the same actual object). s1 is placed in the string pool, whereas s2 is explicitly allocated on the heap as a new String object, so they refer to different locations and thus yield false.'
  },
  {
    id: 'q5',
    language: 'Rust',
    code: 'fn main() {\n    let mut x = 5;\n    let y = &x;\n    // x = 6;\n    println!("{}", y);\n}',
    options: ['5', '6', 'compiler error', 'panic'],
    correctAnswer: '5',
    explanation: 'If we were to uncomment "x = 6;", the compiler would fail because a variable cannot be mutated while it is immutably borrowed. However, since it is commented out, it compiles successfully and prints 5.'
  },
  {
    id: 'q6',
    language: 'Go',
    code: 'package main\nimport "fmt"\n\nfunc main() {\n    s := []int{1, 2}\n    s = append(s, 3)\n    fmt.Println(len(s), cap(s))\n}',
    options: ['3 3', '3 4', '3 2', '2 4'],
    correctAnswer: '3 4',
    explanation: 'When a Go slice capacity is exceeded during append, Go typically doubles the slice capacity (or scales it efficiently). The slice original capacity was 2; appending the 3rd element grows the capacity to 4, whilst its length becomes 3.'
  },
  {
    id: 'q7',
    language: 'Python',
    code: 'def add_to(num, target=[]):\n    target.append(num)\n    return target\n\nprint(add_to(1))\nprint(add_to(2))',
    options: ['[1]\n[2]', '[1]\n[1, 2]', '[1]\n[]', 'Error'],
    correctAnswer: '[1]\n[1, 2]',
    explanation: 'In Python, default arguments are evaluated once when the function is defined, not dynamically. A mutable default argument like target=[] persists across multiple function calls!'
  },
  {
    id: 'q8',
    language: 'JavaScript',
    code: 'console.log(typeof null);\nconsole.log(null instanceof Object);',
    options: ['"null"\nfalse', '"object"\ntrue', '"object"\nfalse', '"null"\ntrue'],
    correctAnswer: '"object"\nfalse',
    explanation: 'Due to a historical bug in JavaScript, typeof null returns "object". However, null is not actually an instance of any Object, so null instanceof Object is false.'
  },
  {
    id: 'q9',
    language: 'SQL',
    code: 'SELECT COUNT(*), COUNT(score)\nFROM (SELECT NULL as score UNION ALL SELECT 10);',
    options: ['1 1', '2 1', '2 2', '2 0'],
    correctAnswer: '2 1',
    explanation: 'COUNT(*) counts the total number of rows returned, which is 2. However, COUNT(column_name) ignores NULL values, counting only the rows where score is NOT NULL, which is 1.'
  }
];
