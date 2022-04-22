import { getProvider, setupWeb3, getNetworkId, getNetwork } from './web3'
import { ENS } from './ens.js'
import { setupRegistrar } from './registrar'
import { ensConfig } from './ensConfig'
export { utils, ethers } from 'ethers'

export async function setupENS({
  customProvider,
  ensAddress,
  reloadOnAccountsChange,
  enforceReadOnly,
  enforceReload,
  infura
} = {}) {
  const { provider } = await setupWeb3({
    customProvider,
    reloadOnAccountsChange,
    enforceReadOnly,
    enforceReload,
    infura
  })
  const networkId = await getNetworkId();
  console.log("读取SDK里的chainId", networkId, typeof networkId);

  const theConfig = ensConfig.ens[String(networkId)];
  let tld = "eth";
  let ensAddressUpdated = ensAddress;
  console.log("读取SDK里的配置", ensConfig, theConfig);
  if (theConfig) {
    tld = theConfig.tld;
    ensAddressUpdated = theConfig.ensAddress;
  }

  console.log("更新SDK里的配置", tld, ensAddressUpdated);

  const ens = new ENS({ tld, provider, networkId, registryAddress: ensAddressUpdated })
  const registrar = await setupRegistrar(tld, ens.registryAddress)

  const network = await getNetwork();
  if (theConfig) {
    network.name = theConfig.name;
  }

  return { ens, registrar, provider: customProvider, network, providerObject: provider }
}

export * from './ens'
export * from './registrar'
export * from './web3'
export * from './constants/interfaces'
export * from './utils'
export * from './contracts'
