export function dates() {
    // @ts-ignore
    var Parser = this.Parser
    var tokenizers = Parser.prototype.inlineTokenizers
    var methods = Parser.prototype.inlineMethods

    // Add an inline tokenizer (defined in the following example).
    tokenizers.date = tokenizeDate

    // Run it just before `text`.
    methods.splice(methods.indexOf('text'), 0, 'date')
}

tokenizeDate.notInLink = true
tokenizeDate.locator = locateDate

function tokenizeDate(eat: any, value: string, silent: boolean) {
    const match = /@date\(([0-9]{4}),([0-9]{2}),([0-9]{2})\)/.exec(value);


    if (match && value.startsWith(match[0])) {
        if (silent) {
            return true;
        }

        return eat(match[0])({
            type: 'date',
            year: parseInt(match[1]),
            month: parseInt(match[2]) - 1,
            day: parseInt(match[3]),
            children: []
        });
    }
}

function locateDate(value: string, fromIndex: number) {
    return value.indexOf('@', fromIndex);
}