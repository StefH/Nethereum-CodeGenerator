/* eslint-disable import/no-webpack-loader-syntax */
import ejsTemplateService from '!raw-loader!./cs-service.ejs';
import ejsTemplateInterface from '!raw-loader!./cs-service-interface.ejs';
import Utils from './utils';

const ejs = require('ejs');
const solc = require('solcjs-lightweight');

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

  static async getVersions() {
    const select = await solc.versions();
    return select.releases;
  }

  async generate(compilerVersion) {
    console.log(`Generate using compiler ${compilerVersion}`);

    const compiler = await solc(compilerVersion);
    console.log(`Compiling contracts with solc version '${compiler.version.name}'`);

    const output = await compiler(this.mainContract.content, async (contractFilename) => {
      const contractName = Utils.sanitizeFilename(contractFilename);
      console.log(`Resolving contract '${contractFilename}' (${contractName})`);

      const contractContent = this.otherContracts[contractName] || 'ERROR !!!';

      if (this.combineContracts) {
        this.combinedContractContent = `${this.combinedContractContent}${this.stripContractContent(contractContent)}`;
      }

      return contractContent;
    });

    if (this.generateAllInterfacesAndImplementations) {
      output.forEach((contract) => {
        this.generateFilesForContract(contract);
      });
    } else {
      this.generateFilesForContract(output[0]);
    }

    return {
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
    const templateInterface = ejs.compile(ejsTemplateInterface);
    this.generatedInterface[contractName] = templateInterface(combinedInput);

    console.log(`${contractName}: generate C# implementation(s)`);
    const templateService = ejs.compile(ejsTemplateService);
    this.generatedService[contractName] = templateService(combinedInput);
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
