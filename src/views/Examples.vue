<template>
  <q-page padding>
    <p><b>Example Smart Contracts</b></p>
    <br>
    <p>Single Smart Contract Example</p>
    <ul>
      <li>
        <a href="https://raw.githubusercontent.com/StefH/Nethereum-CodeGenerator/master/src/contracts/SimpleStorageContract.sol">SimpleStorageContract.sol</a>
      </li>
    </ul>
    <br>
    <br>
    <p>Smart Contract Example which imports other contracts</p>
    <ul>
      <li>
        <a target="_blank" href="https://raw.githubusercontent.com/StefH/Nethereum-CodeGenerator/master/src/contracts/SupplyChainLogContract.sol">Main Contract: SupplyChainLogContract.sol</a>
      </li>
      <li>
        <a target="_blank" href="https://raw.githubusercontent.com/StefH/Nethereum-CodeGenerator/master/src/contracts/OrderContract.sol">Imported Contract: OrderContract.sol</a>
      </li>
      <li>
        <a target="_blank" href="https://raw.githubusercontent.com/StefH/Nethereum-CodeGenerator/master/src/contracts/AuthorizationContract.sol">Imported Contract: AuthorizationContract.sol</a>
      </li>
      <li>
        <a target="_blank" href="https://raw.githubusercontent.com/StefH/Nethereum-CodeGenerator/master/src/contracts/CommonContract.sol">Imported Contract: CommonContract.sol</a>
      </li>
    </ul>
    <br>
    <br>
    <br>
  </q-page>
</template>

<script>
export default {
  name: 'PageExample',
};
</script>
