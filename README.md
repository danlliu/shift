shift: the programming language
---

###Statements
All statements have a specific syntax, and evaluate to either a value, a referenced value, or nothing. The syntax
 definition may use regular expressions. When `value` is used, it can refer to anything that acts as a value or a
  referenced value. Curly braces (`{}`) are used to signify parameters and should not be included in code. For
   example, one of the syntaxes of an @ statement (shown below) is `@{[0-9]+}`, but when using one, should be written
    as, for example, `@18`.
#### The @ Statement:
The @ statement evaluates to a referenced value and has the syntax of `@{value}` or `@{[0-9]+}`. The first syntax
 evaluates to the value at memory address `value`, while the second syntax evaluates to the value at the memory
  address specified by the integer after `@`.
#### The # Statement:
The # statement evaluates to a value and has the syntax of `#{[0-9]+}`. It evaluates to a value specified by the
 integer after `#`.
#### The > Statement:
The > statement evaluates to a value and has the syntax of `{value}>{referenced value}`. It assigns the
 value from the left side of `>` to the referenced value on
 the right side of `>`, and evaluates to whatever value was assigned. Only one > statement can appear per line.
#### The ^ Statement:
The ^ statement evaluates to nothing and has the syntax of `^{value}` or `^{[0-9]+}`. It is the equivalent of a jump or
 goto
 statement, and the next line of code executed is line number `value` or the line number specified by the integer
  after `^`, depending on which syntax is used.
#### The $ Statement:
The $ statement evaluates to a referenced value and has the syntax of `$[A-Z]`. It evaluates to the value of the
 global variable specified by the letter. There are 26 global variables available for use, corresponding to the
  letters A-Z.
#### The \_PRINT\_ Statement:
print stuff
#### The ! Statement:
Unconditional halt
#### The Ternary:
The ternary evaluates to nothing and has the syntax of `{value}?{statement}:{statement}`. Only one ternary statement
 can appear per line.
