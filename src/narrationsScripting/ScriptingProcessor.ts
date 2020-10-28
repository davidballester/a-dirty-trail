import peg from 'pegjs';
import { Rule } from './Rules';
import scriptingGrammar from './scriptingGrammar';

class ScriptingProcessor {
    private parser: peg.Parser;

    constructor() {
        this.parser = peg.generate(scriptingGrammar);
    }

    parse(rule: string): Rule {
        return this.parser.parse(rule);
    }
}

const scriptingProcessor = new ScriptingProcessor();
export default scriptingProcessor;
