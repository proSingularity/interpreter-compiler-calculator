import { expect } from "chai";
import { flow } from "fp-ts/lib/function";
import { DividedExpression } from "./expressions/DividedExpression";
import { MinusExpression } from "./expressions/MinusExpression";
import { PlusExpression } from "./expressions/PlusExpression";
import { TerminalExpression } from "./expressions/TerminalExpression";
import { TimesExpression } from "./expressions/TimesExpression";
import { parse } from "./parse";
import { Tokenizer } from "./tokens/Tokenizer";

const tokenizeAndParse = flow(Tokenizer.read, parse);

const minus = MinusExpression.of;
const plus = PlusExpression.of;
const times = TimesExpression.of;
const divided = DividedExpression.of;
const num = TerminalExpression.of;

describe("tokenize and parse", () => {
    it("works for 5 Rock! 3", () => {
        const input = "5 Rock! 3";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(plus(num(5), num(3)));
    });

    it("works for 5 Rock! 3 Rock! 1", () => {
        const input = "5 Rock! 3 Rock! 1";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(plus(plus(num(5), num(3)), num(1)));
    });

    it("works for 4 Yeah! 5 Rock! 3", () => {
        const input = "4 Yeah! 5 Rock! 3";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(plus(times(num(4), num(5)), num(3)));
    });

    it("works for 4 Yeah! 5 Rock! 3 Yeah! 8", () => {
        const input = "4 Yeah! 5 Rock! 3 Yeah! 8";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(
            times(plus(times(num(4), num(5)), num(3)), num(8))
        );
    });

    it("works for EVERYBODY_NOW 4 Yeah! 5 JUMP!", () => {
        const input = "EVERYBODY_NOW 4 Yeah! 5 JUMP!";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(times(num(4), num(5)));
    });

    it("works for EVERYBODY_NOW 4 Yeah! 5 JUMP! Rock! 3", () => {
        const input = "EVERYBODY_NOW 4 Yeah! 5 JUMP! Rock! 3";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(plus(times(num(4), num(5)), num(3)));
    });

    it("works for EVERYBODY_NOW 4 Yeah! 5 JUMP! Rock! EVERYBODY_NOW 2 Yeah! 3 JUMP!", () => {
        const input =
            "EVERYBODY_NOW 4 Yeah! 5 JUMP! Rock! EVERYBODY_NOW 2 Yeah! 3 JUMP!";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(
            plus(times(num(4), num(5)), times(num(2), num(3)))
        );
    });

    it("works for EVERYBODY_NOW 4 Yeah! 5 JUMP! Rock! EVERYBODY_NOW EVERYBODY_NOW 2 Yeah! 3 JUMP! Yeah! 7 JUMP!", () => {
        const input =
            "EVERYBODY_NOW 4 Yeah! 5 JUMP! Rock! EVERYBODY_NOW EVERYBODY_NOW 2 Yeah! 3 JUMP! Yeah! 7 JUMP!";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(
            plus(times(num(4), num(5)), times(times(num(2), num(3)), num(7)))
        );
    });

    it("works for 4 Shout! 5", () => {
        const input = "4 Shout! 5";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(minus(num(4), num(5)));
    });

    it("works for 4 Shout! 5 Rock! 4 Shout! EVERYBODY_NOW 3 Yeah! 2 JUMP!", () => {
        const input = "4 Shout! 5 Rock! 4 Shout! EVERYBODY_NOW 3 Yeah! 2 JUMP!";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(
            minus(plus(minus(num(4), num(5)), num(4)), times(num(3), num(2)))
        );
    });

    it("works for 6 Death! 3", () => {
        const input = "6 Death! 3";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(divided(num(6), num(3)));
    });

    it("works for 4 Shout! 5 Rock! 4 Death! EVERYBODY_NOW 18 Death! 2 JUMP!", () => {
        const input =
            "4 Shout! 5 Rock! 4 Death! EVERYBODY_NOW 18 Death! 2 JUMP!";

        const result = tokenizeAndParse(input);

        expect(result).to.deep.equal(
            divided(
                plus(minus(num(4), num(5)), num(4)),
                divided(num(18), num(2))
            )
        );
    });
});
