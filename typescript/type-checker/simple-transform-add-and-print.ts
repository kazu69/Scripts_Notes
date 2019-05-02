import * as ts from 'typescript';

const printer: ts.Printer = ts.createPrinter();
const fileName: string = 'created-file.ts';
const sourceText: string = `const x: number = 1;`
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

const transformerWithDebug = <T extends ts.Node>(context: ts.TransformationContext) =>
        (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
      // console.info(`Visiting: ${ts.SyntaxKind[node.kind]}\nText: ${node.getText()}\nChildCount: ${node.getChildCount()}\n`);
      if (ts.isVariableDeclaration(node)) {
        console.log(node.type.kind)
        const declarations: ts.VariableDeclaration[] = [
          ts.createVariableDeclaration(
            ts.createIdentifier(node.name.getText()),
            ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            ts.createNumericLiteral(node.initializer.getText())
          ),
          ts.createVariableDeclaration(
            ts.createIdentifier('y'),
            ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            ts.createNumericLiteral('2')
          ),
        ];
        return ts.createVariableDeclarationList(declarations, ts.NodeFlags.Const);
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
};

const result: ts.TransformationResult<ts.SourceFile> = ts.transform<ts.SourceFile>(
  sourceFile, [ transformerWithDebug ]
);
const transformedSource: ts.SourceFile = result.transformed[0];

console.log(printer.printFile(transformedSource));
// => const x: number = 1, y: number = 2;
