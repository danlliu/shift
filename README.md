shift: the programming language
---

###Statements:
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
The \_PRINT\_ statement evaluates to nothing and has the syntax of `_PRINT_ arg0 arg1 ...`. It can have an arbitrary
 number of arguments, and evaluates each and prints the result, separating each with spaces.
#### The ! Statement:
The `!` statement has the syntax of `!` and is an unconditional halt.
#### The Ternary:
The ternary evaluates to nothing and has the syntax of `{value}?{statement}:{statement}`. Only one ternary statement
 can appear per line.

### Arithmetic

#### Addition:
The syntax for addition is `{value}+{value}`, and evaluates to the value of the sum of the two values.
#### Additive Inverse:
The syntax for additive inverse is `~{value}`, and evaluates to the additive inverse of the value (`value*(-1)`).
#### Multiplication:
The syntax for multiplication is `{value}*{value}`, and evaluates to the value of the product of the two values.
#### Division:
The syntax for division is `{value}|{value}`, and evaluates to the result of integer division of the first value by
 the second value.
#### Modulus:
The syntax for modulus is `{value}%{value}`, and evaluates to the result of taking the first value mod the second value.

### Comparisons

#### Equality
The syntax for checking equality is `{value}_EQ_{value}`, and evaluates to 1 if and only if the two values are equal
, and 0 otherwise.
#### Inequality
The syntax for checking inequality is `{value}_NEQ_{value}`, and evaluates to 1 if and only if the two values are not
 equal, and 0 otherwise.
#### Less than
The syntax for checking values being less than is `{value}_LT_{value}`, and evaluates to 1 if and only if the first
 value is strictly less than the second value, and 0 otherwise.
#### Greater than
The syntax for checking values being greater than is `{value}_GT_{value}`, and evaluates to 1 if and only if the
 first value is strictly greater than the second value, and 0 otherwise.
 
### Logical Operators

#### Logical AND
The syntax for checking logical AND is `{value}_AND_{value}`, and evaluates to 1 if and only if both inputs are nonzero.
#### Logical OR
The syntax for checking logical OR is `{value}_OR_{value}`, and evaluates to 1 if and only if at least one input is
 nonzero.
 
