import solc from 'solcjs-lightweight';
import Utils from './utils';

// https://github.com/rails/webpacker/issues/408
const ejsTemplateService = require('./cs-service.ejs');
const ejsTemplateInterface = require('./cs-service-interface.ejs');

// This RegEx matches the import statements and replaces "./xxx.sol" and "./sub-folder/xxx.sol" by "xxx.sol"
const importRegEx = /^(.*import){1}(.+){0,1}\s['"](.+)['"];/gm;

class ContractCompiler {
  constructor(mainContract, otherContracts, preferredNamespace, generateAllInterfacesAndImplementations = true, combineContracts = true) {
    this.mainContract = mainContract;
    this.otherContracts = otherContracts;
    this.preferredNamespace = preferredNamespace;
    this.generateAllInterfacesAndImplementations = generateAllInterfacesAndImplementations;
    this.combineContracts = combineContracts;

    this.combinedContractContent = '';
    this.generatedService = {};
    this.generatedInterface = {};
  }

  replaceImports(source) {
    const matches = [];
    let match = null;

    // https://github.com/airbnb/javascript/issues/1439
    // eslint-disable-next-line no-cond-assign
    while ((match = importRegEx.exec(source))) {
      matches.push(match[3]);
    }

    let sourceModified = source;
    matches.forEach((matchedImportStatement) => {
      sourceModified = sourceModified.replace(matchedImportStatement, Utils.sanitizeImport(matchedImportStatement));
    });

    return sourceModified;
  }

  static async getVersions() {
    const select = await solc.versions();
    return select.releases;
  }

  async generate(compilerVersion) {
    console.log(`Generate using compiler ${compilerVersion}`);

    const compiler = await solc(compilerVersion);
    console.log(`Compiling contracts with solc version '${compiler.version.name}'`);

    const mainContract = this.replaceImports(this.mainContract.content);
    const output = await compiler(mainContract, async (contractFilename) => {
      const contractName = Utils.sanitizeFilename(contractFilename);
      console.log(`Resolving contract '${contractFilename}' (${contractName})`);

      const importedContractContent = this.replaceImports(this.otherContracts[contractName] || 'Error !!!');

      if (this.combineContracts) {
        this.combinedContractContent = `${this.combinedContractContent}${this.stripContractContent(importedContractContent)}`;
      }

      return importedContractContent;
    });

    if (this.generateAllInterfacesAndImplementations) {
      output.forEach((contract) => {
        this.generateFilesForContract(contract);
      });
    } else {
      this.generateFilesForContract(output[0]);
    }

    return {
      combinedContractContent: this.combinedContractContent,
      generatedService: this.generatedService,
      generatedInterface: this.generatedInterface,
    };
  }

  generateContractService(contractName, ns, abi, bytecode) {
    const combinedInput = {
      _contractName: contractName,
      abi: JSON.parse(abi),
      bytecode,
      namespace: ns,
    };

    console.log(`${contractName}: generate C# interface(s)`);
    this.generatedInterface[contractName] = ejsTemplateInterface(combinedInput);

    console.log(`${contractName}: generate C# implementation(s)`);
    this.generatedService[contractName] = ejsTemplateService(combinedInput);
  }

  generateFilesForContract(contract) {
    const contractName = contract.name;
    const abi = JSON.stringify(contract.abi);
    const code = contract.binary.bytecodes.bytecode;

    // replace *** by contractName (if present)
    const namespace = this.preferredNamespace.endsWith('***') ? this.preferredNamespace.replace('***', contractName) : this.preferredNamespace;

    this.generateContractService(contractName, namespace, abi, code);
  }

  stripContractContent(contractContent, baseContractName) {
    const lines = contractContent.split('\r\n');

    for (let index = 0; index < lines.length; index += 1) {
      // Remove pragma solidity, except for baseContract
      if (lines[index].startsWith('pragma solidity')) {
        if (!baseContractName) {
          lines[index] = '';
        }
      }

      // Remove all import statements
      if (lines[index].startsWith('import')) {
        lines[index] = '';
      }

      // Comment all contract lines, except for baseContract
      if (lines[index].startsWith('contract')) {
        if (baseContractName) {
          lines[index] = `contract ${baseContractName} {`;
        } else {
          lines[index] = `// ${lines[index]}`;
        }
      }
    }

    lines[lines.length - 1] = '';

    return lines.join('\r\n');
  }
}

export default ContractCompiler;
