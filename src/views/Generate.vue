<template>
  <q-page class="q-pa-lg">
    <p>
      <b>Generate a C# Interface and Implementation based on Solidity Smart Contract(s)</b>
    </p>

    <div class="input-data">
      <div class="row">
        <div class="col-2">
          <p class="caption">Main Solidity Contract</p>
        </div>
        <div class="col-3">
          <q-uploader ref="uploaderMain" hide-upload-button hide-upload-progress url :upload-factory="uploadMainContract" />
        </div>
      </div>

      <div class="row">
        <div class="col-2">
          <p class="caption">Imported Solidity Contract(s)</p>
        </div>
        <div class="col-3">
          <q-uploader ref="uploaderOther" multiple batch hide-upload-button hide-upload-progress url :upload-factory="uploadContracts" @finish="uploadContractsFinish" />
        </div>
      </div>

      <div class="row">
        <div class="col-2">
          <p class="caption">Compiler Version</p>
        </div>
        <div class="col-2">
          <q-select v-model="selectedCompiler" :options="selectCompilers" />
        </div>
      </div>

      <div class="row">
        <div class="col-2">
          <p class="caption">Namespace</p>
        </div>
        <div class="col-2">
          <q-input v-model="namespace" />
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col-2">
          <q-btn size="sm" icon="build" label="Generate" :disabled="busy" @click="OnClickGenerate" />
        </div>
        <div class="col-6">
          <div v-show="busy">
            <p>Compiling contracts and generating C# Interface and Service...</p>
          </div>
          <div>
            <p v-show="errorMesssage" class="error">Error : {{ errorMesssage }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-8 code-block q-mb-md">
        <highlight-code lang="cs" :code="generatedInterfaceText"></highlight-code>
      </div>
      <div class="col-2">
        <q-btn size="sm" icon="save" label="Interface" :disabled="downloadInterfaceDisabled" @click="DownloadInterface" />
      </div>
    </div>

    <div class="row">
      <div class="col-8 code-block q-mb-md">
        <highlight-code lang="cs" :code="generatedServiceText"></highlight-code>
      </div>
      <div class="col-2">
        <q-btn size="sm" icon="save" label="Service" :disabled="downloadServiceDisabled" @click="DownloadService" />
      </div>
    </div>

    <div class="row">
      <div class="col-8 code-block q-mb-md">
        <highlight-code lang="cs" :code="generatedExampleText"></highlight-code>
      </div>
      <div class="col-2">
        <q-btn size="sm" icon="save" label="Example" :disabled="downloadExampleDisabled" @click="DownloadExample" />
      </div>
    </div>
  </q-page>
</template>

<style>
.code-block {
  border: 1px;
  border-style: solid;
  color: grey;
}
.hljs {
  font-size: 0.7em;
  height: 215px;
}
.input-data {
  font-size: 0.9em;
}
.error {
  color: red;
  font-size: 0.9em;
}
pre {
  margin: 0em 0px;
}
</style>

<script>
import { saveAs } from 'file-saver';
import ContractCompiler from '../business/ContractCompiler';
import Utils from '../business/utils';

export default {
  name: 'Generate',
  computed: {
    downloadInterfaceDisabled() {
      return this.busy || this.generatedInterfaceText.length === 0;
    },
    downloadServiceDisabled() {
      return this.busy || this.generatedServiceText.length === 0;
    },
    downloadExampleDisabled() {
      return this.busy || this.generatedExampleText.length === 0;
    },
  },
  data() {
    return {
      busy: false,
      errorMesssage: '',
      contract: {},
      contracts: {},
      selectCompilers: [],
      selectedCompiler: 'v0.5.2-stable-2018.12.19',
      generatedServiceText: '',
      generatedInterfaceText: '',
      generatedExampleText: '',
      namespace: 'DefaultNamespace',
    };
  },
  async mounted() {
    const versions = await ContractCompiler.getVersions();
    this.selectCompilers = versions.map(version => ({
      label: version,
      value: version,
    }));
  },
  methods: {
    clearGeneratedFields() {
      this.errorMesssage = '';
      this.generatedServiceText = '';
      this.generatedInterfaceText = '';
      this.generatedExampleText = '';
    },
    async generateCode() {
      try {
        const contractCompiler = new ContractCompiler(
          this.contract,
          this.contracts,
          this.namespace,
        );

        this.clearGeneratedFields();
        this.busy = true;
        const result = await contractCompiler.generate(this.selectedCompiler);

        this.generatedInterfaceText = result.generatedInterface[this.contract.name];
        this.generatedServiceText = result.generatedService[this.contract.name];
        this.generatedExampleText = result.generatedExample;

        this.$refs.uploaderMain.reset();
        this.$refs.uploaderOther.reset();
      } catch (e) {
        this.errorMesssage = e;
        console.log(e);
      } finally {
        this.busy = false;
      }
    },
    uploadMainContract(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = async (e) => {
          const content = e.target.result;
          this.contract = {
            filename: file.name,
            name: Utils.sanitizeFilename(file.name),
            content,
          };

          console.log('uploadMainContract done');
          console.log(
            `Loading ${this.$refs.uploaderOther.files.length} extra files`,
          );
          if (this.$refs.uploaderOther.files.length === 0) {
            await this.generateCode();
          }

          resolve();
        };

        reader.onerror = (e) => {
          reject(e);
        };

        // read text
        reader.readAsText(file);
      });
    },
    uploadContracts(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Wait till complete
        reader.onloadend = async (e) => {
          const content = e.target.result;
          this.contracts[Utils.sanitizeFilename(file.name)] = content;

          console.log(`Other contract ${file.name} is read`);

          resolve();
        };

        // Make sure to handle error states
        reader.onerror = (e) => {
          reject(e);
        };

        // read text
        reader.readAsText(file);
      });
    },
    async uploadContractsFinish() {
      await this.generateCode();
    },
    async OnClickGenerate() {
      this.contract = {};
      this.contracts = {};

      this.$refs.uploaderMain.upload();
      this.$refs.uploaderOther.upload();
    },
    DownloadInterface() {
      const file = new File(
        [this.generatedInterfaceText],
        `I${this.contract.name}Service.Generated.cs`,
        {
          type: 'text/plain;charset=utf-8',
        },
      );
      saveAs(file);
    },
    DownloadService() {
      const file = new File(
        [this.generatedServiceText],
        `${this.contract.name}Service.Generated.cs`,
        {
          type: 'text/plain;charset=utf-8',
        },
      );
      saveAs(file);
    },
    DownloadExample() {
      const file = new File(
        [this.generatedExampleText],
        `${this.contract.name}Service.ConsoleApp.cs`,
        {
          type: 'text/plain;charset=utf-8',
        },
      );
      saveAs(file);
    },
  },
};
</script>
