import * as ts from 'typescript';
import { sync as globSync } from 'glob';
import * as fs from 'fs';

const CJS_CONFIG: ts.CompilerOptions = {
  experimentalDecorators: true,
  jsx: ts.JsxEmit.React,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  noEmitOnError: false,
  noUnusedLocals: true,
  noUnusedParameters: true,
  stripInternal: true,
  resolveJsonModule: true,
  declaration: true,
  baseUrl: __dirname,
  target: ts.ScriptTarget.ES5
};

interface customTransformOption {
  program: ts.Program,
}

const file: string = process.argv.slice(2)[0];
function compile(
  input: string,
  options: ts.CompilerOptions = CJS_CONFIG
) {
  const file = globSync(input);
  const compilerHost = ts.createCompilerHost(options);
  const program: ts.Program = ts.createProgram(file, options, compilerHost);

  const sourceFile: ts.SourceFile = program.getSourceFile(input);
  const WriteFileCallback = (fileName, data, writeByteOrderMark, onError, sourceFiles) => {
    fs.writeFileSync(fileName, data, 'utf8');
  }
  const cancellationToken: ts.CancellationToken = undefined;
  const emitOnlyDtsFiles: boolean = false;
  const customTransformers: ts.CustomTransformers = {
    before: [],             // to evaluate before built-in .js transformations.
    after: [
      customTransform({program})
    ],              // to evaluate after built-in .js transformations.
    afterDeclarations: [],  // to evaluate after built-in .d.ts transformations
  };
  // EmitResult {
  //  emitSkipped: boolean;
  //  diagnostics: ReadonlyArray<Diagnostic>;
  //  emittedFiles?: string[];
  // }
  const emitResult: ts.EmitResult = program.emit(sourceFile, WriteFileCallback, cancellationToken, emitOnlyDtsFiles, customTransformers);
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach(diagnostic => {
    let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
      diagnostic.start
    );
    let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    console.log(
      `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
    );
  });

  const CarriageReturnLineFeed: ts.NewLineKind = 0;
  const printerOptions: ts.PrinterOptions = {
    removeComments: true,
    newLine: CarriageReturnLineFeed,
    omitTrailingSemicolon: false,
    noEmitHelpers: true,
  }
  
  // debug code print
  // const printer: ts.Printer = ts.createPrinter(printerOptions)
  // const code: string = printer.printFile(sourceFile);
  // console.log('code: =>', code)

  const exitCode = emitResult.emitSkipped ? 1 : 0;
  if (exitCode) {
    console.log(`Process exiting with code '${exitCode}'.`);
  }

  process.exit(exitCode);
}

function transformer(context: ts.TransformationContext, sorce: ts.SourceFile, options: customTransformOption): ts.Visitor {
  const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
    if (ts.isFunctionDeclaration(node)) {
      const declaration: ts.VariableDeclaration = ts.createVariableDeclaration(
        ts.createIdentifier('val'),
        ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        ts.createNumericLiteral('1000')
      );
      const declarations: ts.VariableDeclaration[] = [declaration];
      return ts.createVariableDeclarationList(declarations, ts.NodeFlags.Const);
    }
    return ts.visitEachChild(node, visitor, context);
  }
  return visitor;
}

function customTransform(options: customTransformOption): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sorceFile: ts.SourceFile) => {
      return ts.visitNode(sorceFile, transformer(context, sorceFile, options))
    }
  }
}

compile(file, CJS_CONFIG);
// => $ npx ts-node custom-ast-transform.ts example.ts