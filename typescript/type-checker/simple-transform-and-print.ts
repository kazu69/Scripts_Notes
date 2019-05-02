import * as ts from 'typescript';

const printer: ts.Printer = ts.createPrinter();
const fileName: string = 'created-file.ts';
const sourceText: string = `const x: number = 1`
const languageVersion: ts.ScriptTarget = ts.ScriptTarget.ES2015;
const setParentNodes: boolean = true;
const scriptKind: ts.ScriptKind = ts.ScriptKind.TS;
// create sorce file
const sourceFile: ts.SourceFile = ts.createSourceFile(
  fileName,
  sourceText,
  languageVersion,
  setParentNodes,
  scriptKind
);

console.log(printer.printFile(sourceFile))
// $ npx ts-node simple-transform-and-print.ts
// => const x: number = 1;

const addedNode = ts.createAdd(ts.createLiteral(1), ts.createLiteral(2));
console.log(printer.printNode(ts.EmitHint.Expression, addedNode, sourceFile))
// => 1 + 2

const transformerWithDebug = <T extends ts.Node>(context: ts.TransformationContext) =>
        (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
        console.info(`Visiting: ${ts.SyntaxKind[node.kind]}\nText: ${node.getText()}\nChildCount: ${node.getChildCount()}\n`);
        return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
};

const result: ts.TransformationResult<ts.SourceFile> = ts.transform<ts.SourceFile>(
  sourceFile, [ transformerWithDebug ]
);
const transformedSource: ts.SourceFile = result.transformed[0];

console.log(printer.printFile(transformedSource));
// => const x: number = 1;
