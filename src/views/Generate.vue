<template>
  <q-page padding>
    <p>
      <b>Generate C# Interfaces and Classes</b>
    </p>

    <div class="row">
      <div class="col-2">
        <p class="caption">Main Solidity Contract</p>
      </div>
      <div class="col-2">
        <q-uploader
          ref="uploaderMain"
          hide-upload-button
          hide-upload-progress
          url
          :upload-factory="uploadMainContract"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <p class="caption">Imported Solidity Contract(s)</p>
      </div>
      <div class="col-2">
        <q-uploader
          ref="uploaderOther"
          multiple
          batch
          hide-upload-button
          hide-upload-progress
          url
          :upload-factory="uploadContracts"
          @finish="uploadContractsFinish"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <p class="caption">Compiler Version</p>
      </div>
      <div class="col-2">
        <q-select v-model="selectedCompiler" :options="selectCompilers"/>
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <p class="caption">Namespace</p>
      </div>
      <div class="col-2">
        <q-input v-model="namespace"/>
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <q-btn label="Generate" :disabled="busy" @click="OnClickGenerate"/>
      </div>
    </div>

    <div class="row">
      <div class="col-8">
        <br>
        <br>
        <p v-show="busy">Compiling contracts and generating C# Interface and Service...</p>
        <br>
        <br>
        <p v-show="errorMesssage" class="error">Error : {{ errorMesssage }}</p>
      </div>
    </div>

    <div class="row">
      <div class="col-8">
        <q-input
          class="csharp-code"
          readonly
          v-model="generatedInterfaceText"
          type="textarea"
          float-label="Generated C# Interface"
          :max-height="150"
          rows="8"
        />
      </div>
      <div class="col-2">
        <q-btn label="Download" :disabled="downloadInterfaceDisabled" @click="DownloadInterface"/>
      </div>
    </div>

    <div class="row">
      <div class="col-8">
        <br>
        <br>
        <br>
      </div>
    </div>

    <div class="row">
      <div class="col-8">
        <q-input
          class="csharp-code"
          readonly
          v-model="generatedServiceText"
          type="textarea"
          float-label="Generated C# Service"
          :max-height="150"
          rows="8"
        />
      </div>
      <div class="col-2">
        <q-btn label="Download" :disabled="downloadServiceDisabled" @click="DownloadService"/>
      </div>
    </div>
  </q-page>
</template>

<style>
.csharp-code {
  font-size: 10px;
}
.error {
  color: red;
}
</style>

<script>
import ContractCompiler from "../business/ContractCompiler";
import Utils from "../business/utils";
import { saveAs } from "file-saver";

export default {
  name: "Generate",
  computed: {
    downloadInterfaceDisabled() { return this.busy || this.generatedInterfaceText.length === 0 },
    downloadServiceDisabled() { return this.busy || this.generatedServiceText.length === 0 }
  },
  data() {
    return {
      busy: false,
      errorMesssage: "",
      contract: {},
      contracts: {},
      selectCompilers: [],
      selectedCompiler: "v0.5.2-stable-2018.12.19",
      generatedServiceText: "",
      generatedInterfaceText: "",
      namespace: "DefaultNamespace"
    };
  },
  async mounted() {
    const versions = await ContractCompiler.getVersions();
    this.selectCompilers = versions.map(version => ({
      label: version,
      value: version
    }));
  },
  methods: {
    clearGeneratedFields() {
      this.errorMesssage = "";
      this.generatedServiceText = "";
      this.generatedInterfaceText = "";
    },
    async generateCode() {
      try {
        const contractCompiler = new ContractCompiler(
          this.contract,
          this.contracts,
          this.namespace
        );

        this.clearGeneratedFields();
        this.busy = true;
        const result = await contractCompiler.generate(this.selectedCompiler);

        this.generatedInterfaceText = result.generatedInterface[this.contract.name];
        this.generatedServiceText = result.generatedService[this.contract.name];

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

        reader.onloadend = async e => {
          const content = e.target.result;
          this.contract = {
            filename: file.name,
            name: Utils.sanitizeFilename(file.name),
            content
          };

          console.log("uploadMainContract done");
          console.log(
            `Loading ${this.$refs.uploaderOther.files.length} extra files`
          );
          if (this.$refs.uploaderOther.files.length == 0) {
            await this.generateCode();
          }

          resolve();
        };

        reader.onerror = e => {
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
        reader.onloadend = async e => {
          const content = e.target.result;
          this.contracts[Utils.sanitizeFilename(file.name)] = content;

          console.log(`Other contract ${file.name} is read`);

          resolve();
        };

        // Make sure to handle error states
        reader.onerror = e => {
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
      const file = new File([this.generatedInterfaceText], `${this.contract.name}Service.cs`, {
        type: "text/plain;charset=utf-8"
      });
      saveAs(file);
    },
    DownloadService() {
      const file = new File([this.generatedServiceText], `I${this.contract.name}Interface.cs`, {
        type: "text/plain;charset=utf-8"
      });
      saveAs(file);
    }
  }
};
</script>
