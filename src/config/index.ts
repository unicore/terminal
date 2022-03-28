// TODO вынести из гита

export default {
  chains: [
    {
      name: 'FLOWER',
      rpcEndpoints: [
        {
          protocol: 'https',
          host: 'api.intellect.run',
          port: 443,
        },
      ],
      explorerApiUrl: 'https://explorer.gaia.holdings',
    },
  ],
  ual: {
    rootChain: 'FLOWER',
  },
  tableCodeConfig: {
    core: 'unicore',
    staker: 'staker',
    p2p: 'p2p',
    reg: 'registrator',
    part: 'part',
  },
}
